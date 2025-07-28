from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from models import User, Project, File
from schemas import UserCreate, ProjectCreate, FileCreate, FileUpdate
from auth import get_password_hash, verify_password
from typing import Optional, List

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user: UserCreate) -> User:
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        name=user.name,
        password_hash=hashed_password
    )
    
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except IntegrityError:
        db.rollback()
        raise ValueError("User with this email already exists")

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user

def update_user_last_opened_project(db: Session, user_id: int, project_id: str) -> Optional[User]:
    user = get_user_by_id(db, user_id)
    if not user:
        return None
    
    user.last_opened_project = project_id
    db.commit()
    db.refresh(user)
    return user

def get_project_by_id(db: Session, project_id: str, user_id: int) -> Optional[Project]:
    return db.query(Project).filter(Project.id == project_id, Project.user_id == user_id).first()

def get_projects_by_user(db: Session, user_id: int) -> List[Project]:
    return db.query(Project).filter(Project.user_id == user_id).all()

def get_or_create_default_project(db: Session, user_id: int) -> Project:
    project_id = f"default-project-{user_id}"
    project = get_project_by_id(db, project_id, user_id)
    
    if not project:
        project = Project(
            id=project_id,
            name="My Widget Project",
            user_id=user_id
        )
        db.add(project)
        db.commit()
        db.refresh(project)
    
    return project

def create_project(db: Session, project: ProjectCreate, user_id: int) -> Project:
    db_project = Project(
        id=project.id,
        name=project.name,
        user_id=user_id
    )
    
    try:
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        return db_project
    except IntegrityError:
        db.rollback()
        raise ValueError("Project with this ID already exists")

def update_project(db: Session, project_id: str, user_id: int, name: str) -> Optional[Project]:
    project = get_project_by_id(db, project_id, user_id)
    if not project:
        return None
    
    project.name = name
    db.commit()
    db.refresh(project)
    return project

def delete_project(db: Session, project_id: str, user_id: int) -> bool:
    project = get_project_by_id(db, project_id, user_id)
    if not project:
        return False
    
    db.delete(project)
    db.commit()
    return True

def get_file_by_id(db: Session, file_id: str, project_id: str) -> Optional[File]:
    return db.query(File).filter(File.id == file_id, File.project_id == project_id).first()

def get_files_by_project(db: Session, project_id: str) -> List[File]:
    return db.query(File).filter(File.project_id == project_id).all()

def create_file(db: Session, file: FileCreate, project_id: str) -> File:
    db_file = File(
        id=file.id,
        name=file.name,
        type=file.type,
        path=file.path,
        content=file.content,
        thumbnail=file.thumbnail,
        project_id=project_id
    )
    
    try:
        db.add(db_file)
        db.commit()
        db.refresh(db_file)
        return db_file
    except IntegrityError:
        db.rollback()
        raise ValueError("File with this ID already exists")

def update_file(db: Session, file_id: str, project_id: str, file_update: FileUpdate) -> Optional[File]:
    file = get_file_by_id(db, file_id, project_id)
    if not file:
        return None
    
    if file_update.name is not None:
        file.name = file_update.name
    if file_update.content is not None:
        file.content = file_update.content
    if file_update.thumbnail is not None:
        file.thumbnail = file_update.thumbnail
    
    db.commit()
    db.refresh(file)
    return file

def delete_file(db: Session, file_id: str, project_id: str) -> bool:
    file = get_file_by_id(db, file_id, project_id)
    if not file:
        return False
    
    db.delete(file)
    db.commit()
    return True