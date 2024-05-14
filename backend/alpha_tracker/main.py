import uvicorn
from fastapi import FastAPI
from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from alpha_tracker.configs import ALPHA_TRACKER_HOST, ALPHA_TRACKER_PORT
from alpha_tracker.utils.logging import setup_logger
from alpha_tracker.modules.auth.api import router as auth_router
from alpha_tracker.modules.user.api import router as user_router
from alpha_tracker.modules.portfolio.api import router as portfolio_router

logger = setup_logger()

def get_application() -> FastAPI:
    application = FastAPI(
        root_path="/api", 
        redirect_slashes=True
    )

    application.include_router(auth_router)
    application.include_router(user_router)
    application.include_router(portfolio_router)

    application.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @application.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        exc_str = f"{exc}".replace("\n", " ").replace("   ", " ")
        logger.exception(f"{request}: {exc_str}")
        return JSONResponse(
            status_code=422,
            content={"message": exc_str, "data": None},
        )
    
    @application.exception_handler(ValueError)
    async def value_error_handler(request: Request, exc: ValueError):
        exc_str = f"{exc}".replace("\n", " ").replace("   ", " ")
        logger.exception(f"{request}: {exc_str}")
        return JSONResponse(
            status_code=400,
            content={"message": exc_str, "data": None},
        )

    return application

app = get_application()

if __name__ == "__main__":
    logger.info(
        f"Starting AlphaTracker on http://{ALPHA_TRACKER_HOST}:{str(ALPHA_TRACKER_PORT)}/"
    )
    uvicorn.run(app, host=ALPHA_TRACKER_HOST, port=ALPHA_TRACKER_PORT)
