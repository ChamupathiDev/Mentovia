````md
# Mentovia — Skill Sharing & Learning Platform

Mentovia is a full-stack skill sharing and learning platform with social interactions and learning progress tracking. It includes Google Sign-In via **Firebase Authentication** and an admin interface for managing learning resources.

---

## Core Features

### Learner / User
- **Google Sign-In** (Firebase Authentication)
- User profiles
- Social feed: create posts, like, comment
- Learning plan / progress tracking
- Browse learning resources (PDF/video)

### Admin
- Admin panel to manage learning resources (add/manage PDF/video metadata)
- Content management (based on implemented modules)

---

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- **Firebase Authentication (Google Provider)**

### Backend
- Java, Spring Boot
- JWT-based API security (as implemented)

### Database
- MongoDB

### File Storage
- Local `/uploads` directory (project-based storage)

---

## Project Structure

```text
Mentovia/
  backend/        # Spring Boot API
  frontend/       # React (Vite) app
  uploads/        # Uploaded files/assets
````

---

## Getting Started (Local)

### Prerequisites

* Node.js (LTS recommended)
* Java (17+ recommended)
* Maven (or Maven Wrapper if included)
* MongoDB (local or Atlas)

---

## Firebase Setup (Google Authentication)

### 1) Create a Firebase project

* Go to Firebase Console → Create Project

### 2) Add a Web App to Firebase

* Project settings → Your apps → Web → Register app
* Copy the **Firebase config** (apiKey, authDomain, etc.)

### 3) Enable Google Sign-In

* Build → Authentication → Sign-in method → **Google** → Enable
* Add an email for support if required

### 4) Configure Authorized Domains

* Authentication → Settings → Authorized domains
  Add:

  * `localhost`
  * Your production domain (if deploying)

---

## Environment Variables

### Frontend (`/frontend/.env`)

Create a file named `.env` inside the `frontend` folder:

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID

# Optional (recommended) if your frontend uses a configurable backend URL:
VITE_API_BASE_URL=http://localhost:8080
```

> Make sure your frontend reads these keys using `import.meta.env.VITE_...`.

---

### Backend (`/backend` config)

Use `application.properties` or `application.yml` depending on your setup.

**Example `application.properties`:**

```properties
# MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/mentovia

# JWT (example keys — adapt to your project)
app.jwt.secret=CHANGE_ME
app.jwt.expiration=86400000

# CORS (example)
app.cors.allowedOrigins=http://localhost:5173

# Uploads (if used)
app.upload.dir=uploads
```

> If your backend validates Firebase tokens, you may also require Firebase Admin SDK credentials. Only add this if your implementation uses it.

---

## Run Locally

### 1) Clone

```bash
git clone https://github.com/ChamupathiDev/Mentovia.git
cd Mentovia
```

### 2) Start Backend

```bash
cd backend
mvn spring-boot:run
# or (if you have Maven Wrapper)
./mvnw spring-boot:run
```

Backend typically runs on:

* `http://localhost:8080`

### 3) Start Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend typically runs on:

* `http://localhost:5173`

---

## Build

### Frontend

```bash
cd frontend
npm run build
```

### Backend

```bash
cd backend
mvn clean package
```

---



---

## Security Notes

* Do **not** commit `.env` files or secrets.
* Add `.env` to `.gitignore` (frontend) if not already.
* Use strong JWT secrets and restrict CORS origins in production.

---



::contentReference[oaicite:0]{index=0}
```

