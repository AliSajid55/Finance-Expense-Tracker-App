from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.user import UserCreate
from app.schemas.auth import LoginRequest, TokenResponse
from app.crud.user import create_user, authenticate_user, get_user_by_email
from app.core.security import create_access_token
from fastapi.security import OAuth2PasswordRequestForm


router = APIRouter()


@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = get_user_by_email(db, user.email)

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    db_user = create_user(db, user)

    return {"message": "User created successfully", "user_id": db_user.id}




@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
   
    user = authenticate_user(db, form_data.username, form_data.password)
   
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": str(user.id)})
    
    return {"access_token": token, "token_type": "bearer"}
