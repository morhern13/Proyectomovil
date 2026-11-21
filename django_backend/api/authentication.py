from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import RevokedToken


class RevocableJWTAuthentication(JWTAuthentication):
    def get_validated_token(self, raw_token):
        token = super().get_validated_token(raw_token)
        if RevokedToken.objects.filter(jti=token["jti"]).exists():
            raise AuthenticationFailed("La sesión ha sido cerrada.", code="token_revoked")
        return token
