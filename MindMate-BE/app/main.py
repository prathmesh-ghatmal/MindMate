from fastapi import FastAPI
from app.api.routes import auth,user,mood
from app.db.database import Base, engine
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind=engine)

app = FastAPI()

# 👇 Allow specific origins (e.g., your frontend server)
origins = [
    "http://localhost:5173",  # HTML frontend (or Live Server)
    "http://127.0.0.1:5173",
    "http://localhost:3000",  # if you're using React
]

# 👇 Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # can also use ["*"] for all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RequestValidationError)
async def custom_validation_exception_handler(request, exc: RequestValidationError):
    errors = []

    for err in exc.errors():
        field = err["loc"][-1]  # Last part, e.g., 'email' or 'password'
        msg = err["msg"]

        # Optional: make error messages more user-friendly
        if "value is not a valid email address" in msg:
            msg = "Invalid email format"
        elif "does not match regex" in msg:
            msg = "Password must include uppercase, lowercase, digit, special character, and be 8+ chars."
        elif "field required" in msg:
            msg = f"{field.capitalize()} is required"

        errors.append({
            "field": field,
            "message": msg
        })

    return JSONResponse(
        status_code=400,   # ✅ instead of 422
        content={
            "status": "error",
            "errors": errors
        }
    )

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(mood.router)
