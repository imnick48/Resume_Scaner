import os
from os import environ as env
from authlib.integrations.flask_client import OAuth
from db import engine, SessionLocal
from models import Base, User,Resume,Jobs
from dotenv import find_dotenv, load_dotenv
from flask import Flask, jsonify, redirect, request, session, url_for
from datetime import datetime
from rank import get_data_from_pdf,compare_resume,get_improvement_suggestions
from flask_cors import CORS
dt = datetime.today()
seconds = dt.timestamp()

ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)


app = Flask(__name__)
CORS(app)
app.secret_key = env.get("SECRET_KEY", "your-secret-key")


UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
ALLOWED_EXTENSIONS = {"pdf"}
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


oauth = OAuth(app)
Base.metadata.create_all(bind=engine)
def create_entity(name, email,g_id):
    db = SessionLocal()
    try:
        new_entity = User(name=name, email=email,g_id=g_id)
        db.add(new_entity)
        db.commit()
        db.refresh(new_entity)
    except Exception as e:
        db.rollback()
        print("Error:", e)
    finally:
        db.close()
def create_Jobs(name, jd,recruter_id):
    db = SessionLocal()
    try:
        new_entity = Jobs(name=name,jd=jd,recruiter_id=recruter_id)
        db.add(new_entity)
        db.commit()
        db.refresh(new_entity)
    except Exception as e:
        db.rollback()
        print("Error:", e)
    finally:
        db.close()

def create_resume(name,email,path,similarity,improvements,job_id):
    db = SessionLocal()
    existing = db.query(Resume).filter_by(email=email,job_id=job_id).first()
    if not existing:
        new_entity = Resume(name=name, email=email,path=path,similarity=similarity,improvements=improvements,job_id=job_id)
        db.add(new_entity)
        try:
            db.commit()
            db.refresh(new_entity)
        except Exception as e:
            db.rollback()
            print("Error:", e)
        finally:
            db.close()
oauth.register(
    name="google",
    client_id=env.get("GOOGLE_CLIENT_ID"),
    client_secret=env.get("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={
        "scope": "openid email profile",
        "prompt": "select_account"
    }
)
@app.route("/login-google")
def login_google():
    return oauth.google.authorize_redirect(
        redirect_uri=url_for("google_callback", _external=True)
    )

@app.route("/authorize")
def google_callback():
    db=SessionLocal()
    token = oauth.google.authorize_access_token()
    user_info = token.get('userinfo')
    session["user"] = user_info
    create_entity(
         name=user_info.get("name"),
         email=user_info.get("email"),
         g_id=user_info.get("sub")
    )
    user_id=db.query(User).filter_by(email=user_info.get("email")).first().id
    return redirect(f"http://localhost:5173/dashboard?userId={user_id}")
@app.route("/Create-Jobs",methods=["POST"])
def create_jobs():
    data = request.get_json() 
    if request.method == "POST":
        name = data.get("name")
        jd = data.get("jd")
        recruiter_id = data.get("recruiter_id") 
    create_Jobs(name=name, jd=jd, recruter_id=recruiter_id)
    return "Job Created",201

@app.route("/projects/<id>")
def projects(id):
    if request.method=="GET":
        id=int(id)
        db=SessionLocal()
        jobs = db.query(Jobs).filter_by(recruiter_id=id).all()
        jobs_data = []
        for job in jobs:
            jobs_data.append({
                "id": job.id,
                "name": job.name,
                "jd": job.jd,
                "recruiter_id": job.recruiter_id
            })
        db.close()
    print(jobs_data)
    return jsonify(jobs_data)

@app.route("/upload-resume/<id>",methods=["POST"])
def uploadResume(id):
    db = SessionLocal()
    job=db.query(Jobs).filter_by(id=id).first()
    jd=job.jd
    if request.method == "POST":
        file = request.files["file"]
        if file and allowed_file(file.filename):
            filename = str(int(seconds))+file.filename
            filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            file.save(filepath)
            resumetxt=get_data_from_pdf(filepath)
            score=compare_resume(jd,resumetxt)
            improvements=get_improvement_suggestions(score,jd,resumetxt)
            create_resume(name=request.args.get("name"),email=request.args.get("email"),path=filepath,similarity=score,improvements=improvements,job_id=id)

            return "File successfully uploaded", 200
        return "File not allowed", 400
    db.close()
@app.route("/jobdetails/<id>")
def jobDetails(id):
    db=SessionLocal()
    resumes=db.query(Resume).filter_by(job_id=id).all()
    resumes_data=[]
    for resume in resumes:
        resumes_data.append({
            "id":resume.id,
            "name":resume.name,
            "email":resume.email,
            "path":resume.path,
            "similarity":resume.similarity,
            "improvements":resume.improvements,
            "job_id":resume.job_id
        })
    db.close()
    return jsonify(resumes_data)

if __name__ == "__main__":
    app.run(debug=True)