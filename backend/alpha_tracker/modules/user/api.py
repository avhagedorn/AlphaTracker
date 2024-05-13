from typing import Annotated, Union
from fastapi import APIRouter, Cookie, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from alpha_tracker.db.engine import get_sqlalchemy_engine
from alpha_tracker.db.models import User
from alpha_tracker.modules.auth.models import DisplayUser
from alpha_tracker.utils.auth import get_current_admin_user, get_current_user

router = APIRouter(prefix="/user")

"""
Handle user management.
"""

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.get("/me")
async def read_users_me(
    current_user: User = Depends(get_current_user),
):
    return DisplayUser.from_db(current_user)


"""
Admin endpoints
"""

@router.post("/promote/{username}")
async def promote_user(
    username: str,
    _: User = Depends(get_current_admin_user),
):
    
    with Session(get_sqlalchemy_engine()) as db_session:

        current_user = db_session.query(User).filter(User.username == username).first()

        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        current_user.is_admin = True
        current_user.save()

        return DisplayUser.from_db(current_user)


@router.post("/demote/{username}")
async def demote_user(
    username: str,
    _: User = Depends(get_current_admin_user),
):
    
    with Session(get_sqlalchemy_engine()) as db_session:
        current_user = db_session.query(User).filter(User.username == username).first()

        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        current_user.is_admin = False
        current_user.save()

        return DisplayUser.from_db(current_user)


@router.get("/list")
async def list_users(
    _: User = Depends(get_current_admin_user),
):
    with Session(get_sqlalchemy_engine()) as db_session:
        users = db_session.query(User).all()
        return [DisplayUser.from_db(user) for user in users]


@router.delete("/delete/{username}")
async def delete_user(
    username: str,
    _: User = Depends(get_current_admin_user),
):
    
    with Session(get_sqlalchemy_engine()) as db_session:
        current_user = db_session.query(User).filter(User.username == username).first()

        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        
        if current_user.is_admin:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete admin user",
            )

        db_session.delete(current_user)
        db_session.commit()

        return DisplayUser.from_db(current_user)
