from pydantic_settings import BaseSettings
from typing import List, Union
from pydantic import field_validator
import os

class Settings(BaseSettings):
    database_url: str = "postgresql://user:pass@localhost/db"
    jwt_secret_key: str = "secret"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 30
    cors_origins: Union[List[str], str] = "http://localhost:5173,http://localhost:3000"
    environment: str = "development"
    debug: bool = True

    @field_validator('cors_origins', mode='before')
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(',')]
        return v

    model_config = {
        "env_file": [
            ".env",
            f".env.{os.getenv('ENVIRONMENT', 'development')}"
        ]
    }

    @property
    def is_development(self) -> bool:
        return self.environment == "development"
    
    @property
    def is_production(self) -> bool:
        return self.environment == "production"

settings = Settings()
