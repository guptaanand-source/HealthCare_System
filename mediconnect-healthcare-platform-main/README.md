# MediConnect 🏥
**India's Smart Healthcare Management Platform**

MediConnect is a comprehensive, full-stack MERN (MongoDB, Express, React, Node.js) application designed to bridge the gap between patients, doctors, and healthcare administration. It features role-based access, interactive appointment booking, digital prescriptions, and an engaging UI powered by Framer Motion.

---

## 🌟 Features

### 🧑‍⚕️ For Patients
- **Find & Filter Doctors**: Search for verified doctors based on their specialization.
- **Smart Appointment Booking**: Real-time slot booking that prevents double-booking.
- **Digital Health Records**: Access prescriptions, upload lab reports, and view past consultation history.
- **Engaging Dashboard**: Animated interface with live health tip tickers, unread notification badges, and personalized greetings.
- **Healthcare Resources**: Integrated sections for **Government Health Schemes** (Ayushman Bharat, CGHS, etc.), **Emergency Numbers**, and **Insurance Comparisons**.

### 🩺 For Doctors
- **Visual Availability Grid**: A highly intuitive, spreadsheet-like weekly grid to toggle working days, bulk-select morning/afternoon/evening slots, and manage availability effortlessly.
- **Appointment Management**: View pending, confirmed, and completed appointments in a streamlined timeline.
- **Digital Prescriptions & Notes**: Easily write prescriptions and clinical notes that are instantly available to the patient.
- **Avatar Upload**: Profile management with dynamic image uploads.

### 🛡️ For Administrators
- **Dedicated Admin Portal**: Hidden, secure access gateway.
- **Platform Management**: Oversee all doctors, patients, and appointments on the platform.

---

## 🚀 Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Framer Motion (for fluid animations and page transitions)
- React Router DOM
- Axios

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (ODM)
- JSON Web Tokens (JWT) for secure authentication
- Multer (for image/avatar uploads)
- bcryptjs (for password hashing)

---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) (Running locally on port 27017)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/mediconnect.git
cd mediconnect
```

### 2. Install Dependencies
Open two terminals.
**Terminal 1 (Backend):**
```bash
cd server
npm install
```

**Terminal 2 (Frontend):**
```bash
cd client
npm install
```

### 3. Environment Variables
Create a `.env` file in the `server` directory and add the following:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/doctor-patient-db
JWT_SECRET=your_super_secret_jwt_key_here
```

### 4. Seed the Database
Populate the database with initial test accounts (Admin, Doctor, Patient):
```bash
cd server
npm run seed
```

### 5. Run the Application
**Backend:**
```bash
cd server
npm run dev
```
**Frontend:**
```bash
cd client
npm run dev
```

The app will be running at `http://localhost:5173`

---

## 🔑 Test Accounts
After running the seed script, you can log in using:
- **Patient**: `patient@mediconnect.com` | Password: `password123`
- **Doctor**: `house@mediconnect.com` | Password: `password123`
- **Admin**: `admin@mediconnect.com` | Password: `password123`

---

## 📂 Project Structure
```text
mediconnect/
├── client/                 # React Frontend
│   ├── public/             
│   └── src/
│       ├── components/     # Reusable UI (Buttons, Sidebars, AvatarUpload)
│       ├── context/        # Auth Context
│       ├── pages/          # Role-based pages (Admin, Doctor, Patient, Public)
│       └── services/       # API integration (Axios)
├── server/                 # Node/Express Backend
│   ├── config/             # DB Connection
│   ├── controllers/        # Route logic
│   ├── middleware/         # JWT Auth & Role guards
│   ├── models/             # Mongoose Schemas
│   ├── routes/             # API Endpoints
│   ├── uploads/            # Locally stored images/avatars
│   └── seed.js             # Database seeding script
└── database_backup/        # JSON exports of the MongoDB collections
```
