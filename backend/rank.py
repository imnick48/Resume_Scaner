from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import re
import PyPDF2
model_name = "all-MiniLM-L6-v2"
text_gen_model="mistralai/Mistral-7B-Instruct-v0.1"
tokenizer = AutoTokenizer.from_pretrained(text_gen_model)
model = AutoModelForCausalLM.from_pretrained(
        text_gen_model,
        device_map="auto",
        load_in_4bit=True
)
llm = pipeline("text-generation",model=model,tokenizer=tokenizer,temperature=0.7,top_p=0.9,repetition_penalty=1.1)
def get_data_from_pdf(path):
   with open(path, "rb") as file:
    reader = PyPDF2.PdfReader(file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text
def preprocess_resume(text):
    text = re.sub(r'\s+', ' ', text).strip()
    text = text.lower()
    return text
def get_resume_embeddings(resume_text):
    model = SentenceTransformer(model_name)
    embedding = model.encode(resume_text)
    return embedding
def compare_resume(job_description, resume):
    job_desc = preprocess_resume(job_description)
    resume = preprocess_resume(resume)
    job_embedding = get_resume_embeddings(job_desc)
    resume_embedding = get_resume_embeddings(resume)
    score = cosine_similarity([job_embedding], [resume_embedding])[0][0]
    return score * 100
def get_improvement_suggestions(result,jd,resume):
    prompt = (
            f"Given the candidate's resume section:{resume}\n\n"
            f"Job Description:{jd}\n\n"
            f"cosine similarity:{result}\n\n"
            f"Provide improvement suggestions for the candidate's resume sections."
            f"You are talking directly to candidate be formal and suggession in 3 lines"
    )
    response = llm(prompt,max_new_tokens=100,do_sample=True,return_full_text=False)
    generated_text = response[0]['generated_text']
    return re.sub(r'\d+\.\s*', '', generated_text.replace('\n', ' ')).strip()