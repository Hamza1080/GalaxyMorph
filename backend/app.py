from flask import Flask, render_template, request
from werkzeug.utils import secure_filename
import os
import tensorflow as tf
import numpy as np
from tensorflow.keras.utils import load_img
from tensorflow.keras.preprocessing.image import img_to_array
import os
import pandas as pd
import os
import numpy as np
from PIL import Image, ImageOps
import cv2
from sklearn.preprocessing import LabelEncoder
from werkzeug.utils import secure_filename
from langchain_community.document_loaders import CSVLoader


import getpass
import os
import sys


os.environ["GOOGLE_GENERATIVE_AI_API_KEY"] = 

from langchain_google_genai import ChatGoogleGenerativeAI
# from langchain.document_loaders.csv_loader import CSVLoader
from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
# from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_community.vectorstores import FAISS


app = Flask(__name__)

CORS(app)

app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def preprocess_single_image(image_path, output_folder='uploads', size=224):
    os.makedirs(output_folder, exist_ok=True)

    if not os.path.exists(image_path):
        print(f"Image not found: {image_path}")
        return None

    try:
        # Load and convert to RGB
        img = Image.open(image_path).convert('RGB')

        # Histogram normalization using OpenCV
        img_np = np.array(img)
        img_np = cv2.normalize(img_np, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
        img = Image.fromarray(img_np)

        # Resize and crop
        img = ImageOps.fit(img, (size, size), method=Image.LANCZOS, centering=(0.5, 0.5))

        # Save the processed image
        filename = os.path.basename("test.jpg")
        save_path = os.path.join(output_folder, filename)
        img.save(save_path)
        print(f"Processed image saved at: {save_path}")

        # Normalize to [-1, 1] range
        img_array = np.array(img) / 255.0
        img_array = (img_array - 0.5) / 0.5

        return save_path

    except Exception as e:
        print(f"Error processing {image_path}: {e}")
        return None


def predict_single_image_class(model_path, image_path, label_encoder, target_size=(224, 224)):
    # Load model
    model = tf.keras.models.load_model(model_path)
    
    # Load and preprocess image exactly like training
    try:
        img = load_img(image_path, target_size=target_size)
        img_array = img_to_array(img) / 255.0  # SAME normalization as training
        img_array = np.expand_dims(img_array, axis=0)  # (1, 224, 224, 3)
    except Exception as e:
        print(f"Failed to process image: {e}")
        return None

    # Predict
    preds = model.predict(img_array)
    predicted_index = np.argmax(preds, axis=1)[0]
    predicted_class = label_encoder.inverse_transform([predicted_index])[0]

    print(f"[DEBUG] Prediction Vector: {preds}")
    print(f"Predicted: {predicted_class}")
    return predicted_class

def chatbot(query):
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
    output=chain.invoke(query)
    return output['result']



# Keep your existing route for the HTML template
@app.route('/', methods=['GET', 'POST'])
def index():
    result = None
    chatbot_response = None

    if request.method == 'POST':
        if 'image' in request.files and request.files['image'].filename != '':
            uploaded_file = request.files['image']
            filename = secure_filename(uploaded_file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            uploaded_file.save(filepath)
            preprocessedpath = preprocess_single_image(filepath)
            df = pd.read_csv("merged_classes.csv")
            le = LabelEncoder()
            le.fit(df['class'])
            model_path = "separable_cnn_improved_75acc.keras"
            result = predict_single_image_class(model_path, preprocessedpath, le)

        if 'chat_input' in request.form and request.form['chat_input'].strip() != '':
            user_query = request.form['chat_input']
            chatbot_response = chatbot(user_query)

    return render_template('index.html', result=result, chatbot_response=chatbot_response)

# Add new API routes for the Next.js frontend
@app.route('/api/classify', methods=['POST'])
def api_classify():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    uploaded_file = request.files['image']
    if uploaded_file.filename == '':
        return jsonify({'error': 'No image selected'}), 400
    
    filename = secure_filename(uploaded_file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    uploaded_file.save(filepath)
    
    preprocessedpath = preprocess_single_image(filepath)
    if not preprocessedpath:
        return jsonify({'error': 'Failed to process image'}), 500
    
    df = pd.read_csv("merged_classes.csv")
    le = LabelEncoder()
    le.fit(df['class'])
    model_path = "separable_cnn_improved_75acc.keras"
    result = predict_single_image_class(model_path, preprocessedpath, le)
    
    if not result:
        return jsonify({'error': 'Classification failed'}), 500
    
    return jsonify({'result': result})

@app.route('/api/chat', methods=['POST'])
def api_chat():
    data = request.json
    if not data or 'query' not in data:
        return jsonify({'error': 'No query provided'}), 400
    
    user_query = data['query']
    if not user_query.strip():
        return jsonify({'error': 'Empty query'}), 400
    
    try:
        response = chatbot(user_query)
        return jsonify({'response': response})
    except Exception as e:
        print(f"Error in chatbot: {e}")
        return jsonify({'error': 'Failed to get response'}), 500

if __name__ == '__main__':
    app.run(debug=True)
