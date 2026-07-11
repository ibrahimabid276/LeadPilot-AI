import os
import logging
import httpx
import jwt
from jwt import PyJWKClient
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from models.user import User

logger = logging.getLogger(__name__)

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")

security = HTTPBearer(auto_error=False)

# Cache JWK client for performance
_jwks_client = None

def _get_jwks_client():
    """Get cached JWKS client for Supabase JWT verification."""
    global _jwks_client
    if _jwks_client is None and SUPABASE_URL:
        _jwks_client = PyJWKClient(f"{SUPABASE_URL}/auth/v1/keys")
    return _jwks_client


async def verify_supabase_token(token: str) -> dict:
    """Verify a Supabase JWT token locally or via API fallback."""
    if not SUPABASE_URL:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service not configured",
        )

    # Try local JWT verification first (fast path)
    try:
        # Supabase JWTs can be verified with the JWT secret
        if SUPABASE_JWT_SECRET:
            payload = jwt.decode(
                token,
                SUPABASE_JWT_SECRET,
                algorithms=["HS256", "RS256"],
                audience="authenticated",
                options={"verify_aud": True}
            )
            return {
                "sub": payload.get("sub", ""),
                "email": payload.get("email", ""),
                "name": payload.get("user_metadata", {}).get("full_name", ""),
            }
        # Try JWKS verification
        jwks_client = _get_jwks_client()
        if jwks_client:
            signing_key = jwks_client.get_signing_key_from_jwt(token)
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256"],
                audience="authenticated",
                options={"verify_aud": True}
            )
            return {
                "sub": payload.get("sub", ""),
                "email": payload.get("email", ""),
                "name": payload.get("user_metadata", {}).get("full_name", ""),
            }
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired. Please sign in again.",
        )
    except jwt.InvalidTokenError:
        pass  # Fall through to API verification
    except Exception as e:
        logger.debug(f"Local JWT verification failed, falling back to API: {e}")

    # Fallback: verify via Supabase REST API
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{SUPABASE_URL}/auth/v1/user",
                headers={
                    "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
                    "Content-Type": "application/json",
                },
                params={"access_token": token},
            )

            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid or expired token",
                )

            user_data = response.json()
            return {
                "sub": user_data.get("id", ""),
                "email": user_data.get("email", ""),
                "name": user_data.get("user_metadata", {}).get("full_name", ""),
            }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Token verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed. Please sign in again.",
        )


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """
    Dependency to get the current authenticated user.
    Requires a valid Supabase JWT token.
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Verify the Supabase JWT (async-compatible)
    import asyncio
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            # We're in an async context, use sync verification via httpx
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor() as pool:
                payload = pool.submit(
                    _verify_token_sync, credentials.credentials
                ).result()
        else:
            payload = asyncio.run(verify_supabase_token(credentials.credentials))
    except HTTPException:
        raise
    except Exception:
        payload = _verify_token_sync(credentials.credentials)

    auth_id = payload.get("sub")

    if not auth_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    # Get or create user in database
    user = db.query(User).filter(User.auth_id == auth_id).first()
    if not user:
        user = User(
            auth_id=auth_id,
            email=payload.get("email", ""),
            name=payload.get("name", ""),
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return user


def _verify_token_sync(token: str) -> dict:
    """Synchronous token verification fallback."""
    if SUPABASE_JWT_SECRET:
        try:
            payload = jwt.decode(
                token,
                SUPABASE_JWT_SECRET,
                algorithms=["HS256", "RS256"],
                audience="authenticated",
                options={"verify_aud": True}
            )
            return {
                "sub": payload.get("sub", ""),
                "email": payload.get("email", ""),
                "name": payload.get("user_metadata", {}).get("full_name", ""),
            }
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
            )
        except jwt.InvalidTokenError:
            pass

    # Fallback to API call
    if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
        response = httpx.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={
                "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
                "Content-Type": "application/json",
            },
            params={"access_token": token},
            timeout=10.0,
        )
        if response.status_code == 200:
            user_data = response.json()
            return {
                "sub": user_data.get("id", ""),
                "email": user_data.get("email", ""),
                "name": user_data.get("user_metadata", {}).get("full_name", ""),
            }

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication failed",
    )


def get_optional_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User | None:
    """Optional auth - returns None if not authenticated."""
    if credentials is None:
        return None
    try:
        return get_current_user(credentials, db)
    except HTTPException:
        return None
