# 💬 ComuniQ – A Real-Time Chat Application

**ComuniQ** is a feature-rich, real-time chat application designed for smooth and secure communication. It supports direct and group messaging, media and emoji sharing, Google authentication, and more. Built with the MERN stack and styled using Tailwind CSS, ComuniQ ensures a modern and responsive user interface. Socket.IO powers its real-time capabilities, while tools like Zustand and Zod streamline state management and validation. Whether it's private chats or community discussions, ComuniQ offers a robust messaging experience across devices.

Live : chat-comuniq.vercel.app

---

## 🚀 Features

- 🔐 **Authentication** – Secure sign-in/sign-up with JWT and bcrypt.
- 🔑 **Google OAuth 2.0** – Log in with Google using Passport.js.
- 💬 **1-to-1 Chat** – Private conversations with real-time updates.
- 📣 **Group Channels** – Join or create group chats for teams or topics.
- 🌍 **General Chat Room** – Chat with everyone using the platform.
- 📂 **Media Sharing** – Upload and share images, files with preview/download.
- 🖼️ **Image Preview** – See shared images before downloading.
- 😄 **Emoji Picker** – Express more with emojis.
- ⚡ **Real-Time Messaging** – Powered by Socket.IO.
- 💅 **Responsive UI** – Built using Tailwind CSS, ShadCN, Framer Motion.
- 🧠 **Global State** – Managed via Zustand.
- ✅ **Validation** – Form validation with Zod.
- ☁️ **Cloud Uploads** – Integrated with Cloudinary + Multer.

## 🛠️ Tech Stack

| Frontend             | Backend              | Others                |
|----------------------|----------------------|------------------------|
| React (Vite)         | Node.js + Express    | MongoDB (Mongoose)     |
| Tailwind CSS         | Socket.IO            | Cloudinary + Multer    |
| Zustand + Zod        | Passport.js (OAuth)  | JWT + Bcrypt           |
| Shadcn/UI Components |                      | Framer Motion (UI)     |

## 📦 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/ComuniQ.git
cd ComuniQ
```

### 2️⃣ Backend Setup 
```bash
cd server
npm install
```

### Create a `.env` file in the `server/` directory and add the following:

```bash
PORT=5000
JWT_KEY=your_jwt_secret
ORIGIN=http://localhost:5173
DATABASE_URL=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_LOGIN_REDIRECT_URL=http://localhost:5173/login
CLIENT_SIGNUP_REDIRECT_URL=http://localhost:5173/signup
```

### 3️⃣ Run the backend server:
```
npm run dev
```
### 4️⃣ Frontend Setup

 ```bash
 cd ../client
 npm install
 ```

 ### Create a `.env` file in the `client/` directory and add the following:
 ```bash
 VITE_SERVER_URL=http://localhost:5000
 ```
### 5️⃣ Start the frontend development server:

 ```bash
 npm run dev
 ```
### The application will be live 🚀

