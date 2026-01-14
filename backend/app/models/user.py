from pydantic import (
    BaseModel, 
    EmailStr, 
    Field, 
    ConfigDict, 
    GetJsonSchemaHandler,
    BeforeValidator,
    PlainSerializer,
    WithJsonSchema
)
from typing import Optional, Any, Annotated
from datetime import datetime
from bson import ObjectId

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
    full_name: Optional[str] = None
    is_active: Optional[bool] = True

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserResponse(UserBase):
    id: str

    @classmethod
    def from_mongo(cls, data: dict):
        """Helper to convert MongoDB _id to string id"""
        if not data:
            return data
        id = data.pop('_id', None)
        return cls(id=str(id), **data)
