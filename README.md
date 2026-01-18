# Mentovia — Skill Sharing & Learning Platform

Mentovia is a full-stack skill sharing and learning platform with social features and learning progress tracking. It supports **Google Sign-In using Firebase Authentication**, and provides an **admin panel** to manage learning resources (PDF/video).

---

## Features

### Learner / User

* Google Sign-In (Firebase Authentication)
* User profiles
* Social feed: create posts, like, comment
* Learning plan / progress tracking
* Browse learning resources (PDF/video)

### Admin

* Admin panel to add/manage learning resources (PDF/video metadata)
* Manage platform content (based on implemented modules)

---

## Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Firebase Authentication (Google Provider)

### Backend

* Java, Spring Boot
* JWT-based API security (as implemented)

### Database

* MongoDB

### File Storage

* Local `/uploads` directory (project-level storage)

---

## Project Structure

Mentovia/

* backend/ — Spring Boot API
* frontend/ — React (Vite) web app
* uploads/ — uploaded files/assets

---

## Getting Started (Local)

### Prerequisites

* Node.js (LTS recommended)
* Java 17+ (recommended)
* Maven (or Maven Wrapper)
* MongoDB (local or Atlas)

### 1) Clone the repository

git clone [https://github.com/ChamupathiDev/Mentovia.git](https://github.com/ChamupathiDev/Mentovia.git)
cd Mentovia

### 2) Backend setup (Spring Boot)

1. Configure MongoDB connection + JWT secret (see **Configuration** below).
2. Run the backend:

cd backend
mvn spring-boot:run

(If you have Maven wrapper)
./mvnw spring-boot:run

Backend commonly runs on:
[http://localhost:8080](http://localhost:8080)

### 3) Frontend setup (React + Vite)

cd ../frontend
npm install
npm run dev

Frontend commonly runs on:
[http://localhost:5173](http://localhost:5173)

---

## Firebase Setup (Google Authentication)

### 1) Create Firebase Project

* Go to Firebase Console → Create Project

### 2) Add a Web App

* Project Settings → Your apps → Web → Register app
* Copy the Firebase config values (apiKey, authDomain, etc.)

### 3) Enable Google Provider

* Build → Authentication → Sign-in method → Google → Enable

### 4) Authorized Domains

* Authentication → Settings → Authorized domains

  * Add: localhost
  * Add your production domain when deploying

---

## Environment Variables

### Frontend (.env)

Create a file: frontend/.env

VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID

(Optional)
VITE_API_BASE_URL=[http://localhost:8080](http://localhost:8080)

Notes:

* In Vite, variables must start with VITE_
* Access them via: import.meta.env.VITE_...

---

### Backend Configuration (Typical)

Use application.properties or application.yml (depending on your project).

Example application.properties:

### MongoDB

spring.data.mongodb.uri=mongodb://localhost:27017/mentovia

### JWT (example — adjust to your implementation)

app.jwt.secret=CHANGE_ME
app.jwt.expiration=86400000

### CORS (example)

app.cors.allowedOrigins=[http://localhost:5173](http://localhost:5173)

### Upload dir

app.upload.dir=uploads

If your backend validates Firebase tokens (only if implemented), you may need Firebase Admin SDK credentials. If your project does not use Admin SDK, you can ignore this.

---

## Build

### Frontend

cd frontend
npm run build

### Backend

cd backend
mvn clean package

---

## Security Notes

* Do not commit secrets or .env files
* Keep JWT secret strong
* Restrict CORS origins for production
* Use secure MongoDB credentials in production

---

