from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional, List, Dict, Any

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    last_opened_project: Optional[str] = None
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class AuthResponse(BaseModel):
    user: UserResponse
    token: str

class ProjectBase(BaseModel):
    name: str

class ProjectCreate(ProjectBase):
    id: str

class ProjectResponse(ProjectBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    user_id: int
    created_at: datetime
    updated_at: datetime

class FileBase(BaseModel):
    name: str
    type: str
    path: str
    content: Optional[Dict[str, Any]] = None
    thumbnail: Optional[str] = None

class FileCreate(FileBase):
    id: str

class FileUpdate(BaseModel):
    name: Optional[str] = None
    content: Optional[Dict[str, Any]] = None
    thumbnail: Optional[str] = None

class FileResponse(FileBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    project_id: str
    created_at: datetime
    updated_at: datetime

class ProjectWithFilesResponse(ProjectResponse):
    files: List[FileResponse]