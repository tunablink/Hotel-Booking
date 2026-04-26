from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL
connect_args = {"check_same_thread": False} if SQLALCHEMY_DATABASE_URL.startswith("sqlite") else {}

# Setting check_same_thread=False is needed only for SQLite
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args=connect_args
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def ensure_user_columns():
    """Keep existing SQLite user tables compatible with the current model."""
    inspector = inspect(engine)
    if "users" not in inspector.get_table_names():
        return

    existing_columns = {column["name"] for column in inspector.get_columns("users")}

    with engine.begin() as connection:
        if "full_name" not in existing_columns:
            connection.execute(text("ALTER TABLE users ADD COLUMN full_name VARCHAR"))
        if "username" not in existing_columns:
            connection.execute(text("ALTER TABLE users ADD COLUMN username VARCHAR"))

        refreshed_columns = existing_columns | {"full_name", "username"}
        if {"full_name", "username"}.issubset(refreshed_columns):
            connection.execute(
                text(
                    "UPDATE users SET full_name = username "
                    "WHERE full_name IS NULL AND username IS NOT NULL"
                )
            )
            connection.execute(
                text(
                    "UPDATE users SET username = full_name "
                    "WHERE username IS NULL AND full_name IS NOT NULL"
                )
            )


def ensure_hotel_map_columns():
    """Add map fields for existing SQLite databases created before this feature."""
    inspector = inspect(engine)
    if "hotels" not in inspector.get_table_names():
        return

    existing_columns = {column["name"] for column in inspector.get_columns("hotels")}
    columns_to_add = {
        "latitude": "FLOAT",
        "longitude": "FLOAT",
        "map_embed_url": "VARCHAR",
    }

    with engine.begin() as connection:
        for column_name, column_type in columns_to_add.items():
            if column_name not in existing_columns:
                connection.execute(
                    text(f"ALTER TABLE hotels ADD COLUMN {column_name} {column_type}")
                )


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
