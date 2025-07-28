from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from config import settings
from database import get_db, engine
from models import Base, User
from schemas import (
    UserCreate, UserLogin, UserResponse, AuthResponse, Token,
    ProjectCreate, ProjectResponse, ProjectWithFilesResponse,
    FileCreate, FileUpdate, FileResponse
)
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
    return {"message": "Widget Authentication API is running!"}

@app.get("/api/test")
async def test_endpoint():
    return {"message": "Test endpoint working!"}

@app.get("/api/test-auth")
async def test_auth_endpoint(current_user: User = Depends(get_current_user)):
    return {"message": f"Test auth endpoint working for user {current_user.id}!"}

@app.post("/api/auth/register", response_model=AuthResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
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
    return UserResponse.from_orm(current_user)

@app.post("/api/auth/refresh", response_model=Token)
async def refresh_token(current_user = Depends(get_current_user)):
    access_token = create_access_token(data={"sub": current_user.email})
    return Token(access_token=access_token, token_type="bearer")

@app.put("/api/auth/last-opened-project")
async def update_last_opened_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        updated_user = crud.update_user_last_opened_project(db, current_user.id, project_id)
        if updated_user:
            return {"message": "Last opened project updated successfully"}
        else:
            raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating last opened project: {str(e)}"
        )

@app.get("/api/auth/last-opened-project")
async def get_last_opened_project(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.last_opened_project:
        project = crud.get_project_by_id(db, current_user.last_opened_project, current_user.id)
        if project:
            return {"project_id": current_user.last_opened_project}
    
    default_project = crud.get_or_create_default_project(db, current_user.id)
    return {"project_id": default_project.id}

@app.get("/api/default-project", response_model=ProjectWithFilesResponse)
async def get_default_project(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        project = crud.get_or_create_default_project(db, current_user.id)
        
        files = crud.get_files_by_project(db, project.id)
        
        return ProjectWithFilesResponse(
            id=project.id,
            name=project.name,
            user_id=project.user_id,
            created_at=project.created_at,
            updated_at=project.updated_at,
            files=files
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting default project: {str(e)}"
        )

@app.get("/api/projects", response_model=List[ProjectResponse])
async def get_projects(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    projects = crud.get_projects_by_user(db, current_user.id)
    return projects

@app.post("/api/projects", response_model=ProjectResponse)
async def create_project(
    project: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        db_project = crud.create_project(db, project, current_user.id)
        return db_project
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/projects/{project_id}", response_model=ProjectWithFilesResponse)
async def get_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = crud.get_project_by_id(db, project_id, current_user.id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    files = crud.get_files_by_project(db, project_id)
    
    return ProjectWithFilesResponse(
        id=project.id,
        name=project.name,
        user_id=project.user_id,
        created_at=project.created_at,
        updated_at=project.updated_at,
        files=files
    )

@app.put("/api/projects/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    project_name: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = crud.update_project(db, project_id, current_user.id, project_name)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.delete("/api/projects/{project_id}")
async def delete_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    success = crud.delete_project(db, project_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}

@app.post("/api/projects/{project_id}/files", response_model=FileResponse)
async def create_file(
    project_id: str,
    file: FileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = crud.get_project_by_id(db, project_id, current_user.id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    try:
        db_file = crud.create_file(db, file, project_id)
        return db_file
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/api/projects/{project_id}/files/{file_id}", response_model=FileResponse)
async def update_file(
    project_id: str,
    file_id: str,
    file_update: FileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = crud.get_project_by_id(db, project_id, current_user.id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    file = crud.update_file(db, file_id, project_id, file_update)
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    return file

@app.delete("/api/projects/{project_id}/files/{file_id}")
async def delete_file(
    project_id: str,
    file_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = crud.get_project_by_id(db, project_id, current_user.id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    success = crud.delete_file(db, file_id, project_id)
    if not success:
        raise HTTPException(status_code=404, detail="File not found")
    return {"message": "File deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)