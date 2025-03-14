from sqlalchemy import Column, ForeignKey, Integer, String,Text,Float
from db import Base

class User(Base):
    __tablename__ = "User"
    id = Column(Integer, primary_key=True, index=True)
    g_id=Column(String(100),nullable=False,unique=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False, unique=True)

class Jobs(Base):
    __tablename__="Jobs"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    jd = Column(Text, nullable=False)
    recruiter_id = Column(Integer, ForeignKey("User.id"), nullable=False)

class Resume(Base):
    __tablename__="Resume"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email=Column(String(100),nullable=False)
    path = Column(String(100), nullable=False)
    similarity=Column(Float,nullable=False)
    improvements=Column(Text,nullable=False)
    job_id = Column(Integer, ForeignKey("Jobs.id"), nullable=False)