from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta

from config import settings
from database import get_db, engine
from models import Base
from schemas import UserCreate, UserLogin, UserResponse, AuthResponse, Token
from auth import create_access_token, verify_token
import crud

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Widget Authentication API",
    description="Authentication backend for Widget app using Neon database",
    version="1.0.0",
    debug=settings.debug
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print(f"🚀 Starting Widget API in {settings.environment.upper()} mode")
print(f"🔐 Debug mode: {settings.debug}")
print(f"🌐 CORS origins: {settings.cors_origins}")
if settings.is_development:
    print(f"🗄️  Database: Development (Neon)")
else:
    print(f"🗄️  Database: Production (Neon)")

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Get current authenticated user"""
    token = credentials.credentials
    email = verify_token(token)
    
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = crud.get_user_by_email(db, email=email)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Widget Authentication API is running!"}

@app.post("/api/auth/register", response_model=AuthResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    try:
        existing_user = crud.get_user_by_email(db, email=user.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        db_user = crud.create_user(db, user=user)
        
        access_token = create_access_token(data={"sub": db_user.email})
        
        return AuthResponse(
            user=UserResponse.from_orm(db_user),
            token=access_token
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@app.post("/api/auth/login", response_model=AuthResponse)
async def login(user_login: UserLogin, db: Session = Depends(get_db)):
    """Login user"""
    user = crud.authenticate_user(db, user_login.email, user_login.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email})
    
    return AuthResponse(
        user=UserResponse.from_orm(user),
        token=access_token
    )

@app.get("/api/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user = Depends(get_current_user)):
    """Get current user information"""
    return UserResponse.from_orm(current_user)

@app.post("/api/auth/refresh", response_model=Token)
async def refresh_token(current_user = Depends(get_current_user)):
    """Refresh access token"""
    access_token = create_access_token(data={"sub": current_user.email})
    return Token(access_token=access_token, token_type="bearer")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
