# backend/app/api/auth.py
import secrets
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.config import settings
from app.core.security import create_access_token, get_password_hash, verify_password
from app.db.database import get_database
from app.models.user import UserCreate, UserResponse, UserUpdate
from app.services.email import send_password_reset_email

router = APIRouter()


@router.post("/signup", response_model=UserResponse)
async def signup(user_in: UserCreate, db: AsyncIOMotorDatabase = Depends(get_database)):
    # Check if user already exists
    existing_user = await db["users"].find_one({"email": user_in.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists",
        )

    # Create new user
    user_dict = user_in.model_dump()
    password = user_dict.pop("password")
    user_dict["hashed_password"] = get_password_hash(password)

    new_user = await db["users"].insert_one(user_dict)
    created_user = await db["users"].find_one({"_id": new_user.inserted_id})

    return UserResponse.from_mongo(created_user)


@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    user = await db["users"].find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user["email"], expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "full_name": user.get("full_name"),
        },
    }


# --- NEW: AUTH DEPENDENCIES & ME ENDPOINT ---

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError as e:
        raise credentials_exception from e

    user = await db["users"].find_one({"email": email})
    if user is None:
        raise credentials_exception
    return user


@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user=Depends(get_current_user)):
    """
    Fetch the current logged-in user's profile.
    Used for the Player Card / RPG Sheet.
    """
    return UserResponse.from_mongo(current_user)


@router.patch("/me", response_model=UserResponse)
async def update_user_me(
    user_update: UserUpdate,
    current_user=Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """
    Update profile fields (bio, specialization, etc.)
    """
    update_data = user_update.model_dump(exclude_unset=True)

    if update_data:
        await db["users"].update_one(
            {"_id": current_user["_id"]}, {"$set": update_data}
        )

    updated_user = await db["users"].find_one({"_id": current_user["_id"]})
    return UserResponse.from_mongo(updated_user)


@router.post("/forgot-password")
async def forgot_password(email: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    """
    Send a password reset email to the user.
    """
    user = await db["users"].find_one({"email": email})
    if not user:
        # We return success even if user doesn't exist for security (avoid email enumeration)
        return {
            "message": "If this email is registered, you will receive a reset link shortly."
        }

    # Generate token
    token = secrets.token_urlsafe(32)
    expiry = datetime.utcnow() + timedelta(hours=1)

    # Save token to user
    await db["users"].update_one(
        {"email": email}, {"$set": {"reset_token": token, "reset_token_expiry": expiry}}
    )

    # Send email
    send_password_reset_email(email, token)

    return {
        "message": "If this email is registered, you will receive a reset link shortly."
    }


@router.post("/reset-password")
async def reset_password(
    token: str, new_password: str, db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Reset password using a valid token.
    """
    user = await db["users"].find_one(
        {"reset_token": token, "reset_token_expiry": {"$gt": datetime.utcnow()}}
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token",
        )

    # Update password and clear token
    hashed_password = get_password_hash(new_password)
    await db["users"].update_one(
        {"_id": user["_id"]},
        {
            "$set": {"hashed_password": hashed_password},
            "$unset": {"reset_token": "", "reset_token_expiry": ""},
        },
    )

    return {"message": "Password updated successfully"}
