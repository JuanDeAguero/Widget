from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings

database_url = settings.database_url
if database_url.startswith("postgresql://"):
    database_url = database_url.replace("postgresql://", "postgresql+pg8000://", 1)
    
from urllib.parse import urlparse, parse_qs, urlunparse

parsed = urlparse(database_url)
query_params = parse_qs(parsed.query)

ssl_params_to_remove = ['sslmode', 'channel_binding']
for param in ssl_params_to_remove:
    query_params.pop(param, None)

from urllib.parse import urlencode
new_query = urlencode(query_params, doseq=True)
database_url_cleaned = urlunparse((
    parsed.scheme,
    parsed.netloc,
    parsed.path,
    parsed.params,
    new_query,
    parsed.fragment
))

connect_args = {}
if "sslmode=require" in settings.database_url:
    connect_args = {"ssl_context": True}

engine = create_engine(database_url_cleaned, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

metadata = MetaData()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
