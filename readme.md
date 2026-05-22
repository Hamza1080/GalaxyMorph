# 🌌 GalaxyMorph: Galaxy Classification using CNNs

LIVE PREVIEW :  https://galaxy-morph.vercel.app/

GalaxyMorph is a deep learning project focused on classifying galaxies using the **Galaxy Zoo 2** dataset. It combines image preprocessing, augmentation, and a **Separable Convolutional Neural Network (Separable-CNN)** to perform galaxy morphological classification. A Flask dashboard is planned for visualizing classification results.

---
# 🎬 Demo Video

[Watch the demo](https://github.com/user-attachments/assets/7d784b46-6df4-4ded-944c-e91a5256c75f)

---

## 📁 Table of Contents

- [Introduction](#introduction)  
- [Dataset](#dataset)  
- [Features and Functions](#features-and-functions)  
- [Image Processing Pipeline](#image-processing-pipeline)  
- [CNN Performance](#cnn-performance)  
- [Project Structure](#project-structure)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Sources](#sources)  

---

## 🚀 Introduction

The project aims to:

- Structure and preprocess a galaxy image dataset.
- Apply image processing and augmentation techniques.
- Train a deep learning model to classify galaxy morphologies.
- Visualize results through a Flask dashboard.

---

## 📦 Dataset

The dataset originates from [Galaxy Zoo 2](https://data.galaxyzoo.org/), a citizen science initiative that provides labeled galaxy images from the Sloan Digital Sky Survey (SDSS).

- `merged_final.csv` contains two key columns:
  - `asset_id`: Unique image filename (e.g., `123456.jpg`)
  - `class`: Morphological class (e.g., Barred Spiral, Elliptical)

- Up to **1,000 images per class** were sampled, resulting in **9,998 total images**, later split into **training, validation, and test sets**.

---

## 🧠 Features and Functions

### ✅ Phase 1: Dataset Preparation

- Organizes images into class-specific folders inside `class_images/`
- Generates `image_class_mapping.csv` mapping each image to its class
- Input: `merged_final.csv` and raw image folder
- Libraries used: `os`, `pandas`, `shutil`

### 🛠️ Image Preprocessing & Augmentation

**Preprocessing Functions** (`OpenCV` based):

- `cv2.imread()` – Load images
- `cv2.resize()` – Resize to uniform size (e.g., 64x64)
- `cv2.cvtColor()` – Convert to grayscale
- `cv2.equalizeHist()` – Improve contrast
- `cv2.threshold()` – Remove dark background
- `cv2.GaussianBlur()` – Reduce noise
- `cv2.imwrite()` – Save output images

**Augmentation Functions:**

- `rotate()`, `flip()`, `zoom()`, `shift()`, `adjust_brightness()`  
- Transformation using `cv2.warpAffine()`, `cv2.resize()`, and HSV adjustment

**Advanced Processing:**

- `canny()` – Canny edge detection (saved)
- `threshold()` – Binary segmentation (saved)
- `dilate_mask()` – Mask dilation (saved)
- `bg_subtract()`, `adaptive_thresh_canny()`, `absdiff_thresh()` – Not saved

---

## 🧪 Image Processing Pipeline

### Preprocessing:

- Load and convert to grayscale
- Resize, blur, threshold, and histogram equalization
- Organize in `class_images/`

### Processing:

- Apply augmentation and advanced filters
- Save `canny`, `threshold`, and `dilate_mask` outputs

### Post-Processing:

- Generate `transformed_dataset.csv`
- Visualize results

---

## 🤖 CNN Performance

### Model Architecture: Separable Convolutional Neural Network

- `SeparableConv2D`: Efficient, fewer parameters
- `BatchNormalization`, `Dropout`: Better training
- `GlobalAveragePooling`, `L2 Regularization`: Prevent overfitting

### Training:

- Optimizer: `Adam`
- Loss: `CategoricalCrossentropy`
- Callbacks: `ReduceLROnPlateau`, `EarlyStopping`

### Evaluation Metrics:

- **Final Training Accuracy:** 74.65%
- **Final Validation Accuracy:** 73.61%
- **Training Loss:** 0.7562
- **Validation Loss:** 0.7788

---

## 🗂 Project Structure

```bash
.
├── application/
│   ├── frontend/
│   │   ├── app/
│   │   ├── components/
│   │   ├── public/
│   │   ├── styles/
│   │   ├── package.json
│   │   ├── tailwind.config.js
│   │   └── tsconfig.json
│   └── (backend-related files)
├── app/
├── chatbot/
├── chatbot_script/
├── data2/
├── faiss_index/
├── merged_classes/
├── templates/
├── upload/
├── uploads/
├── separable_cnn_improved_75acc.keras

```
# ⚙️ Installation

Clone the Repository  
git clone https://github.com/Hamza1080/GalaxyMorph.git  
cd GalaxyMorph  

Install Frontend Dependencies  
cd application/frontend  
npm install  # or yarn install  

Install Python Backend Dependencies  
pip install -r requirements.txt  

Required libraries: os, pandas, shutil, cv2, numpy, matplotlib, tensorflow, keras

---

# 🚦 Usage

1. Prepare the Dataset  
Ensure merged_final.csv and the image folder are present.  
Run the dataset preparation script.

2. Train the CNN  
Run the CNN training script if you want to retrain.  
Pretrained model: separable_cnn_improved_75acc.keras

3. Run the Flask Backend  
python app.py

4. Launch the Frontend  
cd application/frontend  
npm run dev  # or yarn dev  
Open: http://localhost:3000

---

# 🔗 Sources

Galaxy Zoo 2 Dataset: https://data.galaxyzoo.org/  
Sloan Digital Sky Survey (SDSS)

