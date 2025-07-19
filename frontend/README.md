# 🌾 AgroAdvisor AI 🌦️

An AI-driven full-stack web app that helps farmers make smart agricultural decisions based on soil and weather conditions. It includes:

- ✅ **Crop Suggestion** using ML
- ✅ **Fertilizer Recommendation**
- ✅ **Live Weather** + **7-Day Forecast** using LSTM
- ✅ **AI Chatbot** powered by Gemini API & rule-based fallback
- ✅ **Data Storage** with Supabase
- ✅ Clean React + Flask architecture

---

## 🏗️ Project Structure


agroadvisor-ai/
│
├── backend/ # Flask API backend
│ ├── app.py
│ ├── models/
│ ├── utils/
│ └── ...
│
├── frontend/ # React frontend
│ ├── src/
│ ├── public/
│ └── ...
│
├── .gitignore
├── README.md
├── .env # Not tracked (contains API keys)




## 🚀 Features

- 🧠 ML-based crop and fertilizer predictions
- 🌤️ Weather forecasting via OpenWeather API
- 🤖 Gemini-powered chatbot with fallback logic
- 🔐 Supabase DB integration to store predictions and chats
- 🎨 Interactive modern UI using React + Tailwind

---

## 🔧 Setup

### 1. Backend (Flask)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py
