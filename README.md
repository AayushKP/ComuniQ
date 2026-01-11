# ComuniQ

A production-ready, real-time chat application designed for seamless and secure communication. ComuniQ supports direct messaging, group channels, media sharing, and Google authentication. Built with the MERN stack and powered by Socket.IO for real-time capabilities.

**[Live Demo](https://chat-comuniq.vercel.app)**

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Authentication & Security

- **JWT-Based Authentication** - Secure session management with JSON Web Tokens
- **Password Encryption** - User credentials protected with bcrypt hashing
- **Google OAuth 2.0** - Seamless single sign-on integration via Passport.js
- **Protected Routes** - Middleware-based route protection for authenticated endpoints

### Messaging

- **Direct Messaging** - Private one-to-one conversations with real-time delivery
- **Group Channels** - Create and manage topic-based or team-specific chat rooms
- **General Chat Room** - Global platform-wide communication channel
- **Real-Time Updates** - Instant message delivery powered by Socket.IO WebSockets
- **Message History** - Persistent conversation storage with MongoDB

### Media & Content

- **File Sharing** - Upload and share documents and files
- **Image Sharing** - Send and receive images with inline preview
- **Cloud Storage** - Media assets managed via Cloudinary integration
- **File Downloads** - Direct download capability for shared files

### User Experience

- **Emoji Picker** - Rich emoji selection for expressive messaging
- **Responsive Design** - Optimized layouts for desktop, tablet, and mobile devices
- **Smooth Animations** - Polished UI transitions with Framer Motion
- **Modern UI Components** - Consistent design system using Shadcn/UI

### User Management

- **Profile Customization** - Personalized user profiles with avatars and display names
- **Contact Search** - Find and connect with other platform users
- **Contact List** - Organized view of connections with recent activity

---

## Architecture

ComuniQ follows a modern client-server architecture with real-time communication capabilities.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                               │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                     React Application (Vite)                    │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │    │
│  │  │    Pages    │  │ Components  │  │     State Management    │  │    │
│  │  │  - Auth     │  │  - Chat     │  │      (Zustand Store)    │  │    │
│  │  │  - Chat     │  │  - Profile  │  │  - Auth Slice           │  │    │
│  │  │  - Profile  │  │  - Channel  │  │  - Chat Slice           │  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────┘  │    │
│  │  ┌─────────────────────────────────────────────────────────────┐│    │
│  │  │              Socket.IO Client Connection                    ││    │
│  │  └─────────────────────────────────────────────────────────────┘│    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                          HTTPS / WSS Connections
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              SERVER LAYER                               │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    Node.js + Express Server                     │    │
│  │  ┌─────────────────────────────────────────────────────────────┐│    │
│  │  │                     NGINX Reverse Proxy                     ││    │
│  │  │                                                             ││    │
│  │  └─────────────────────────────────────────────────────────────┘│    │
│  │                             │                                   │    │
│  │  ┌──────────────────────────┴───────────────────────────────┐   │    │
│  │  │                                                          │   │    │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │   │    │
│  │  │  │  REST API    │  │  Socket.IO   │  │  Middleware  │    │   │    │
│  │  │  │  Endpoints   │  │   Server     │  │  - Auth      │    │   │    │
│  │  │  │  - /auth     │  │  - Messages  │  │  - Multer    │    │   │    │
│  │  │  │  - /contacts │  │  - Channels  │  │  - CORS      │    │   │    │
│  │  │  │  - /messages │  │  - Presence  │  │              │    │   │    │
│  │  │  │  - /channels │  │              │  │              │    │   │    │
│  │  │  └──────────────┘  └──────────────┘  └──────────────┘    │   │    │
│  │  │                                                          │   │    │
│  │  └──────────────────────────────────────────────────────────┘   │    │
│  │                              │                                  │    │
│  │  ┌──────────────────────────┴───────────────────────────────┐   │    │
│  │  │                      Controllers                         │   │    │
│  │  │  ┌────────────────┐  ┌──────────────┐  ┌──────────────┐  │   │    │
│  │  │  │ AuthController │  │Messages      │  │ Channel      │  │   │    │
│  │  │  │ - signup       │  │ Controller   │  │ Controller   │  │   │    │
│  │  │  │ - login        │  │ - getMessages│  │ - create     │  │   │    │
│  │  │  │ - getUserInfo  │  │ - uploadFile │  │ - getChannels│  │   │    │
│  │  │  │ - updateProfile│  │              │  │ - getMessages│  │   │    │
│  │  │  └────────────────┘  └──────────────┘  └──────────────┘  │   │    │
│  │  └──────────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                             DATA LAYER                                  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                         MongoDB Database                        │    │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐   │    │
│  │  │   Users         │  │    Messages     │  │    Channels    │   │    │
│  │  │  - email        │  │  - sender       │  │  - name        │   │    │
│  │  │  - password     │  │  - recipient    │  │  - members     │   │    │
│  │  │  - firstName    │  │  - content      │  │  - admin       │   │    │
│  │  │  - lastName     │  │  - messageType  │  │  - messages    │   │    │
│  │  │  - image        │  │  - fileUrl      │  │  - isGeneral   │   │    │
│  │  │  - googleId     │  │  - timestamp    │  │                │   │    │
│  │  └─────────────────┘  └─────────────────┘  └────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                         Cloudinary CDN                          │    │
│  │                    (Image & File Storage)                       │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Authentication Flow**

   - User submits credentials via React frontend
   - Express server validates and issues JWT token
   - Token stored client-side for subsequent API requests

2. **Real-Time Messaging Flow**

   - Client establishes WebSocket connection via Socket.IO
   - Messages emitted to server, persisted to MongoDB
   - Server broadcasts to recipient(s) via their socket connection

3. **File Upload Flow**
   - Client sends file via Multer middleware
   - Server uploads to Cloudinary, receives CDN URL
   - URL stored in message document and delivered to recipients

---

## Tech Stack

### Frontend

| Technology       | Purpose                           |
| ---------------- | --------------------------------- |
| React            | UI component library              |
| Vite             | Build tool and development server |
| Tailwind CSS     | Utility-first CSS framework       |
| Shadcn/UI        | Accessible component primitives   |
| Zustand          | Lightweight state management      |
| Zod              | Schema validation                 |
| Framer Motion    | Animation library                 |
| Socket.IO Client | Real-time WebSocket communication |

### Backend

| Technology  | Purpose                                           |
| ----------- | ------------------------------------------------- |
| Node.js     | JavaScript runtime environment                    |
| Express     | Web application framework                         |
| Socket.IO   | Real-time bidirectional event-based communication |
| Passport.js | Authentication middleware (Google OAuth)          |
| Multer      | File upload handling                              |
| JWT         | Stateless authentication tokens                   |
| Bcrypt      | Password hashing                                  |

### Database & Storage

| Technology | Purpose                           |
| ---------- | --------------------------------- |
| MongoDB    | NoSQL document database           |
| Mongoose   | MongoDB object modeling           |
| Cloudinary | Cloud-based media storage and CDN |

### DevOps

| Technology     | Purpose                           |
| -------------- | --------------------------------- |
| Docker         | Containerization                  |
| Docker Compose | Multi-container orchestration     |
| NGINX          | Reverse proxy and SSL termination |
| Vercel         | Frontend deployment               |

---

## Project Structure

```
ComuniQ/
├── client/                      # React frontend application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── assets/              # Images and static files
│   │   ├── components/          # Reusable UI components
│   │   ├── context/             # React context providers
│   │   ├── lib/                 # Utility libraries
│   │   ├── pages/               # Route-based page components
│   │   ├── store/               # Zustand state management
│   │   ├── utils/               # Helper functions
│   │   ├── App.jsx              # Root application component
│   │   └── main.jsx             # Application entry point
│   ├── index.html               # HTML template
│   ├── package.json             # Frontend dependencies
│   ├── tailwind.config.js       # Tailwind configuration
│   └── vite.config.js           # Vite configuration
│
├── server/                      # Node.js backend application
│   ├── config/                  # Configuration files
│   ├── controllers/             # Request handlers
│   │   ├── AuthController.js    # Authentication logic
│   │   ├── ChannelController.js # Channel management
│   │   ├── ContactsController.js# Contact operations
│   │   ├── GoogleAuthController.js # OAuth handling
│   │   └── MessagesController.js# Message operations
│   ├── middlewares/             # Express middleware
│   ├── models/                  # Mongoose schemas
│   │   ├── ChannelModel.js      # Channel schema
│   │   ├── MessageModel.js      # Message schema
│   │   └── UserModel.js         # User schema
│   ├── nginx/                   # NGINX configuration
│   ├── routes/                  # API route definitions
│   ├── docker-compose.yml       # Container orchestration
│   ├── dockerfile               # Container image definition
│   ├── index.js                 # Server entry point
│   ├── package.json             # Backend dependencies
│   └── socket.js                # Socket.IO event handlers
│
└── README.md                    # Project documentation
```

---

## Installation

### Prerequisites

- Node.js v18.0.0 or higher
- npm v9.0.0 or higher
- MongoDB instance (local or cloud)
- Cloudinary account
- Google Cloud Console project (for OAuth)

### Clone the Repository

```bash
git clone https://github.com/AayushKP/ComuniQ.git
cd ComuniQ
```

### Backend Setup

```bash
cd server
npm install
```

### Frontend Setup

```bash
cd client
npm install
```

---

## Configuration

### Server Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=5000
ORIGIN=http://localhost:5173

# Authentication
JWT_KEY=your_secure_jwt_secret_key

# Database
DATABASE_URL=mongodb://localhost:27017/comuniq

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_LOGIN_REDIRECT_URL=http://localhost:5173/login
CLIENT_SIGNUP_REDIRECT_URL=http://localhost:5173/signup
```

### Client Environment Variables

Create a `.env` file in the `client/` directory:

```env
VITE_SERVER_URL=http://localhost:5000
```

---

## Usage

### Development Mode

Start the backend server:

```bash
cd server
npm run dev
```

Start the frontend development server:

```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`.

### Production Mode

Build the frontend:

```bash
cd client
npm run build
```

Start the production server:

```bash
cd server
npm start
```

### Docker Deployment

```bash
cd server
docker-compose up -d
```

---

## API Reference

### Authentication Endpoints

| Method | Endpoint                         | Description              |
| ------ | -------------------------------- | ------------------------ |
| POST   | `/api/auth/signup`               | Create new user account  |
| POST   | `/api/auth/login`                | Authenticate user        |
| GET    | `/api/auth/user-info`            | Get current user profile |
| POST   | `/api/auth/update-profile`       | Update user profile      |
| POST   | `/api/auth/add-profile-image`    | Upload profile image     |
| DELETE | `/api/auth/remove-profile-image` | Remove profile image     |
| POST   | `/api/auth/logout`               | End user session         |

### Contacts Endpoints

| Method | Endpoint                            | Description         |
| ------ | ----------------------------------- | ------------------- |
| POST   | `/api/contacts/search`              | Search for contacts |
| GET    | `/api/contacts/get-contacts-for-dm` | Get DM contact list |
| GET    | `/api/contacts/get-all-contacts`    | Get all contacts    |

### Messages Endpoints

| Method | Endpoint                     | Description            |
| ------ | ---------------------------- | ---------------------- |
| POST   | `/api/messages/get-messages` | Retrieve conversation  |
| POST   | `/api/messages/upload-file`  | Upload file attachment |

### Channel Endpoints

| Method | Endpoint                                       | Description          |
| ------ | ---------------------------------------------- | -------------------- |
| POST   | `/api/channel/create-channel`                  | Create new channel   |
| GET    | `/api/channel/get-user-channels`               | Get user's channels  |
| GET    | `/api/channel/get-channel-messages/:channelId` | Get channel messages |

### WebSocket Events

| Event                     | Direction       | Description             |
| ------------------------- | --------------- | ----------------------- |
| `sendMessage`             | Client → Server | Send direct message     |
| `recieveMessage`          | Server → Client | Receive direct message  |
| `send-channel-message`    | Client → Server | Send channel message    |
| `recieve-channel-message` | Server → Client | Receive channel message |

---

## Deployment

### Vercel (Frontend)

1. Connect your GitHub repository to Vercel
2. Set the root directory to `client`
3. Configure environment variables
4. Deploy

### Docker (Backend)

The server includes Docker configuration for containerized deployment:

```bash
cd server
docker-compose up -d --build
```

### SSL/TLS Configuration

NGINX configuration is provided in `server/nginx/` for SSL termination and reverse proxy setup.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

### Code Standards

- Follow ESLint configuration for code style
- Write descriptive commit messages
- Include tests for new features
- Update documentation as needed

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**ComuniQ** - Real-Time Communication, Reimagined
