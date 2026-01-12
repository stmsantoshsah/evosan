# backend/app/api/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.db.database import get_database
from app.models.user import UserCreate, UserInDB, UserResponse
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.config import settings
from datetime import timedelta
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter()

@router.post("/signup", response_model=UserResponse)
async def signup(user_in: UserCreate, db: AsyncIOMotorDatabase = Depends(get_database)):
    # Check if user already exists
    existing_user = await db["users"].find_one({"email": user_in.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Create new user
    user_dict = user_in.dict()
    password = user_dict.pop("password")
    user_dict["hashed_password"] = get_password_hash(password)
    
    new_user = await db["users"].insert_one(user_dict)
    created_user = await db["users"].find_one({"_id": new_user.inserted_id})
    
    return UserResponse(
        id=str(created_user["_id"]),
        email=created_user["email"],
        full_name=created_user.get("full_name"),
        is_active=created_user.get("is_active", True)
    )

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncIOMotorDatabase = Depends(get_database)):
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
            "full_name": user.get("full_name")
        }
    }
