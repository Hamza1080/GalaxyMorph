import os
from dotenv import load_dotenv
load_dotenv()

os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY", "")

from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain.document_loaders.csv_loader import CSVLoader
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

vector_db_path = "faiss_index"

embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")

def create_vector_db():
    loader = CSVLoader(file_path='data2.csv', source_column='prompt')
    data = loader.load()
    vectordb = FAISS.from_documents(documents=data, embedding=embeddings)
    vectordb.save_local(vector_db_path)
    print(f"FAISS index created with {len(data)} documents.")

def get_qa_chain():
    vectordb = FAISS.load_local(vector_db_path, embeddings, allow_dangerous_deserialization=True)
    retriever = vectordb.as_retriever(score_threshold=0.6)

    prompt_template = """Given the following context and a question, generate an answer based on this context only and a little bit of your knowledge.
    In the answer try to provide text from "response" section in the source document context without making much changes.
    If the answer is not found in the context, kindly state "I don't know." Don't try to make up an answer.
    Answer in paragraph from documents.
    CONTEXT: {context}

    QUESTION: {question}"""

    PROMPT = PromptTemplate(template=prompt_template, input_variables=["context", "question"])

    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
    )

    chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        input_key="query",
        return_source_documents=True,
        chain_type_kwargs={"prompt": PROMPT}
    )
    return chain

if __name__ == '__main__':
    print("Building FAISS index from data2.csv...")
    create_vector_db()
    print("Done! Index saved to", vector_db_path)
