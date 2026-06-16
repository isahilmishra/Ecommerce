# ⚡ ApexStore - Full-Stack MERN E-Commerce Platform

![ApexStore Showcase](https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200)

**Live Demo:** [https://ecommerce-xi-one-97.vercel.app/](https://ecommerce-xi-one-97.vercel.app/)

ApexStore is a modern, highly responsive, and fully functional e-commerce web application built from the ground up using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). Designed with a premium Flipkart-inspired aesthetic, it features advanced cart management, seamless checkout flows, and secure authentication.

---

## 🚀 Key Features

*   **Hybrid Cart System:** Users can add items to their cart anonymously via a generated `sessionId`. When they decide to log in or sign up, their guest cart seamlessly merges with their permanent user account.
*   **Dynamic Search Engine:** Live product filtering using MongoDB's `$regex` queries across multiple item categories and keywords.
*   **Persistent Checkout:** Simulates a real checkout flow with local storage persistence, automatically remembering a user's shipping addresses and payment choices (UPI, Credit Card, Net Banking) for future purchases.
*   **Secure Authentication:** Powered by JSON Web Tokens (JWT) and Bcrypt password hashing.
*   **Modern Aesthetic:** Lightweight, vanilla CSS utilizing custom design tokens for a sleek, glassmorphic UI without the bloat of heavy component libraries.

---

## 🛠️ Technology Stack

### Frontend (Client)
*   **React 18** (Functional Components & Hooks)
*   **Vite** (Next-generation lightning-fast build tool)
*   **React Router v6** (Client-side routing)
*   **Context API** (Global state management for Auth and Cart Sessions)
*   **Vanilla CSS3** (Custom responsive design)

### Backend (Server)
*   **Node.js & Express.js** (RESTful API architecture)
*   **MongoDB Atlas** (Cloud NoSQL Database)
*   **Mongoose** (Object Data Modeling)
*   **JWT & Bcrypt** (Stateless Auth & Security)
*   **CORS** (Dynamically handled for robust cross-origin requests)

---

## 💻 Local Installation & Setup

If you want to run this project locally on your machine, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/isahilmishra/Ecommerce.git
cd Ecommerce
```

### 2. Setup the Backend
Open a terminal and navigate to the backend folder:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add your secret keys:
```env
MONGO_URI=mongodb+srv://<your_username>:<your_password>@cluster0.mongodb.net/Ecommerce?appName=Cluster0
PORT=3000
JWT_SECRET=your_super_secret_jwt_key
```

Seed the database with sample products and start the server:
```bash
node scripts/seed.js
npm start
```
*(The backend will run on `http://localhost:3000`)*

### 3. Setup the Frontend
Open a **new** terminal and navigate to the frontend folder:
```bash
cd frontend
npm install
npm run dev
```
*(The frontend will run on `http://localhost:5173`)*

---

## ☁️ Deployment Architecture

*   **Frontend Deployment:** Hosted on **Vercel** with automatic continuous integration. Vercel builds the Vite React app and bakes the `VITE_API_URL` environment variable directly into the static assets.
*   **Backend Deployment:** Hosted on **Render** utilizing Node.js web services. The Express server dynamically accepts incoming CORS requests from the Vercel domain and securely connects to the MongoDB Atlas cluster.

---

## 📂 Project Structure

```
📦 Ecommerce
 ┣ 📂 backend
 ┃ ┣ 📂 config       # Database connection logic
 ┃ ┣ 📂 middleware   # JWT Auth verification
 ┃ ┣ 📂 models       # Mongoose Schemas (User, Product, Cart, Order)
 ┃ ┣ 📂 routes       # Express API routes
 ┃ ┣ 📂 scripts      # Database seeding scripts
 ┃ ┗ 📜 server.js    # Entry point & CORS configuration
 ┗ 📂 frontend
   ┣ 📂 public       # Static assets and icons
   ┣ 📂 src
   ┃ ┣ 📂 components # Reusable UI pieces (Header, CartItem, ProductCard)
   ┃ ┣ 📂 context    # React Context providers (AuthContext)
   ┃ ┣ 📂 pages      # Page-level components (Home, Checkout, Orders)
   ┃ ┣ 📂 services   # Axios API wrappers
   ┃ ┗ 📂 styles     # Vanilla CSS modules and design tokens
   ┗ 📜 index.html   # Main HTML template
```

---
*Built by Sahil Mishra as a full-stack portfolio showcase.*
