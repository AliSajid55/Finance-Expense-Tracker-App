from fastapi import APIRouter, Depends
from app.schemas.user import UserResponse
from app.api.deps import get_current_user
from app.schemas.response import APIResponse

router = APIRouter()


@router.get("/me", response_model=APIResponse)
def get_profile(current_user=Depends(get_current_user)):
    return APIResponse(
        success=True,
        data=UserResponse.model_validate(current_user)
    )
