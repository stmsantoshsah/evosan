from datetime import datetime
from typing import Annotated

from bson import ObjectId
from pydantic import (
    BaseModel,
    BeforeValidator,
    ConfigDict,
    EmailStr,
    Field,
    PlainSerializer,
    WithJsonSchema,
)

# Pydantic v2 compatible PyObjectId
PyObjectId = Annotated[
    str,
    BeforeValidator(lambda x: str(x) if isinstance(x, ObjectId) else x),
    PlainSerializer(lambda x: str(x), return_type=str),
    WithJsonSchema({"type": "string"}, mode="validation"),
]


class UserBase(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True, populate_by_name=True)
    email: EmailStr
    full_name: str | None = None
    is_active: bool | None = True


class UserCreate(UserBase):
    password: str


class UserInDB(UserBase):
    id: PyObjectId | None = Field(default=None, alias="_id")
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    reset_token: str | None = None
    reset_token_expiry: datetime | None = None


class UserUpdate(BaseModel):
    full_name: str | None = None
    bio: str | None = None
    specialization: str | None = None
    avatar_url: str | None = None


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    name: str | None = None
    role: str = "ENGINEER"  # Default role
    joinedAt: datetime = Field(default_factory=datetime.utcnow)
    bio: str | None = None
    specialization: str | None = None
    avatarUrl: str | None = None

    # Allow extra fields if DB has more
    model_config = ConfigDict(populate_by_name=True)

    @classmethod
    def from_mongo(cls, data: dict):
        """Helper to convert MongoDB _id to string id"""
        if not data:
            return data

        id = data.pop("_id", None)
        return cls(
            id=str(id),
            email=data.get("email"),
            name=data.get("full_name", "Unknown User"),
            role=data.get("role", "ENGINEER"),
            joinedAt=data.get("created_at", datetime.utcnow()),
            bio=data.get("bio"),
            specialization=data.get("specialization"),
            avatarUrl=data.get("avatar_url"),
        )
