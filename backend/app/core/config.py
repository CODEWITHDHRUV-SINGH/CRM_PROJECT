from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Universal AI CRM API"
    database_url: str = "postgresql+psycopg://crm_user:change-me@localhost:5432/crm"
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()