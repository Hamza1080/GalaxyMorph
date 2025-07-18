import getpass
import os
import sys


os.environ["GOOGLE_GENERATIVE_AI_API_KEY"] = 

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.document_loaders.csv_loader import CSVLoader
from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

arg = sys.argv[1]
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)

embeddings = FastEmbedEmbeddings()
vector_db_path="faiss_index"

vectordb=FAISS.load_local(vector_db_path,embeddings, allow_dangerous_deserialization=True)
retriever = vectordb.as_retriever(score_threshold = 0.6)
prompt_template = """Given the following context and a question, generate an answer based on this context only and a little bit of your knowledge.
    In the answer try to provide text  from "response" section in the source document context without making much changes.
    If the answer is not found in the context, kindly state "I don't know." Don't try to make up an answer. and if you find the answer convert it into words related to given prompt
    Answer in paragraph from documents
    CONTEXT: {context}

     QUESTION: {question}"""


PROMPT = PromptTemplate(
        template=prompt_template, input_variables=["context", "question"]
    )
chain_type_kwargs = {"prompt": PROMPT}

chain = RetrievalQA.from_chain_type(llm=llm,
                            chain_type="stuff",
                            retriever=retriever,
                            input_key="query",
                            return_source_documents=True,
                            chain_type_kwargs=chain_type_kwargs
                            )
output=chain(arg)
print(output['result'])
sys.stdout.flush()