from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import Response
from fastapi import status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from alpha_tracker.configs import ACCESS_TOKEN_EXPIRE_MINUTES
from alpha_tracker.db.engine import get_sqlalchemy_engine
from alpha_tracker.db.models import User
from alpha_tracker.modules.auth.models import CreateUserRequest
from alpha_tracker.modules.auth.models import LoginRequest
from alpha_tracker.modules.auth.models import Token
from alpha_tracker.utils.auth import authenticate_user
from alpha_tracker.utils.auth import create_access_token
from alpha_tracker.utils.auth import get_password_hash
from alpha_tracker.utils.validation import is_valid_email

router = APIRouter(prefix="/auth")

"""
Handle token requests.
"""


@router.post("/token")
async def login_for_access_token(
    data: Annotated[LoginRequest, Depends()],
    response: Response,
) -> Token:
    user = authenticate_user(data.username, data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    return Token(access_token=access_token, token_type="bearer")


@router.post("/register")
async def register_user(
    data: Annotated[CreateUserRequest, Depends()],
    response: Response,
) -> Token:
    if data.password != data.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match",
        )

    elif len(data.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters",
        )

    elif len(data.username) < 4:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username must be at least 4 characters",
        )

    elif not is_valid_email(data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email",
        )

    try:
        with Session(get_sqlalchemy_engine()) as db_session:
            user = User(
                username=data.username,
                email=data.email,
                hashed_password=get_password_hash(data.password),
                is_admin=True,
            )

            db_session.add(user)
            db_session.commit()

            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            )
            return Token(access_token=access_token, token_type="bearer")
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already exists",
        )
