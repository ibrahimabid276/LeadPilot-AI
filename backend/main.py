import os
import time
import logging
from contextlib import asynccontextmanager
from collections import defaultdict
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from database import init_db
from routes import leads, emails, crm, dashboard

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create database tables
    init_db()
    logger.info("LeadPilot API started")
    yield
    # Shutdown: cleanup
    logger.info("LeadPilot API shutting down")


app = FastAPI(
    title="LeadPilot API",
    version="1.0.0",
    description="AI-powered lead generation and outreach platform",
    lifespan=lifespan,
)

app.include_router(leads.router)
app.include_router(emails.router)
app.include_router(crm.router)
app.include_router(dashboard.router)

# CORS configuration
ALLOWED_ORIGINS = os.getenv(
    "CORS_ORIGINS", "http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
    expose_headers=["X-Request-ID"],
    max_age=600,
)


# Rate limiting middleware (in-memory, use Redis for production)
class RateLimitMiddleware(BaseHTTPMiddleware):
    """Simple in-memory rate limiting middleware."""
    def __init__(self, app, max_requests: int = 100, window: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window = window
        self.requests = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        # Skip rate limiting for health check
        if request.url.path in ["/", "/health"]:
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"
        now = time.time()

        # Clean old requests
        self.requests[client_ip] = [
            t for t in self.requests[client_ip] if t > now - self.window
        ]

        if len(self.requests[client_ip]) >= self.max_requests:
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please try again later."},
                headers={"Retry-After": str(self.window)},
            )

        self.requests[client_ip].append(now)
        response = await call_next(request)
        return response


# Security headers middleware
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        # CSP - allow Supabase for auth
        supabase_url = os.getenv("SUPABASE_URL", "")
        supabase_domain = supabase_url.replace("https://", "").replace("http://", "") if supabase_url else ""
        csp = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self' data:; "
        )
        if supabase_domain:
            csp += f"connect-src 'self' https://{supabase_domain} https://*.supabase.co;"
        else:
            csp += "connect-src 'self' https://*.supabase.co;"
        response.headers["Content-Security-Policy"] = csp
        response.headers["Strict-Transport-Security"] = (
            "max-age=31536000; includeSubDomains"
        )
        return response


app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitMiddleware, max_requests=200, window=60)


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.method} {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An internal server error occurred. Please try again later."
        },
    )


@app.get("/")
def root():
    return {"message": "LeadPilot API is running", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "ok"}
