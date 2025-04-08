from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    """Schema for user signup request"""
    first_name: str
    last_name: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    """Schema for returning user data (excluding password)"""
    id: int
    first_name: str
    last_name: str
    email: EmailStr

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    """Schema for user login request"""
    email: EmailStr
    password: str

class UserDelete(BaseModel):
    """Schema for user deletion request"""
    email: EmailStr

class LoginUserResponse(BaseModel):
    id: int
    email: str
    name: str

class TokenResponse(BaseModel):
    """Schema for returning JWT token after login"""
    user: LoginUserResponse
    access_token: str
    token_type: str = "bearer"

