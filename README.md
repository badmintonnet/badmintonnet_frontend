<div align="center">

# 🏸 BadmintonNet

**A comprehensive platform connecting badminton enthusiasts across Vietnam**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

_Connecting players, clubs, and tournaments with cutting-edge technology_

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Key Features Explained](#-key-features-explained)
- [Authentication](#-authentication)
- [API Integration](#-api-integration)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**BadmintonNet** is a modern, full-featured web application designed to connect badminton players, clubs, and tournaments throughout Vietnam. The platform provides a comprehensive ecosystem for managing clubs, organizing events, tracking player ratings, and facilitating real-time communication within the badminton community.

### Core Purpose

- **For Players**: Find opponents, track progress, participate in tournaments, and connect with the badminton community
- **For Clubs**: Efficiently manage members, organize events, track club activities, and expand membership
- **For Administrators**: Comprehensive management dashboard for users, clubs, events, facilities, and tournaments

---

## ✨ Features

### 🏆 Tournament Management

- Professional tournament organization with automatic bracket generation
- Real-time match tracking and results
- Tournament registration and payment processing
- Comprehensive tournament statistics and analytics

### 👥 Club & Event Management

- Create and manage badminton clubs
- Organize and join playing sessions
- Advanced filtering by location, skill level, and facilities
- Member management and club invitations
- Event scheduling and participant management

### 📊 Player Rating System

- ELO-based rating system for accurate skill assessment
- Player profile with detailed statistics
- Progress tracking and skill level visualization
- Match history and performance analytics

### 💬 Real-Time Communication

- WebSocket-based chat system
- Real-time notifications
- Club and event messaging
- Friend system for connecting players

### 💳 Payment Integration

- VNPay payment gateway integration
- Secure transaction processing
- Payment history and receipts
- Event and tournament fee management

### 🎨 Modern UI/UX

- Responsive design for all devices
- Dark mode support
- Smooth animations and transitions
- Accessible components built with Radix UI
- Beautiful gradient designs and modern aesthetics

### 🔐 Authentication & Security

- Firebase authentication integration
- Google OAuth login
- JWT-based session management
- Automatic token refresh
- Secure cookie-based authentication

### 📱 Admin Dashboard

- User management
- Club and event oversight
- Facility management
- Tournament administration
- Analytics and reporting
- System settings and role management

---

## 🛠 Tech Stack

### Frontend Framework

- **Next.js 15.5.0** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5.0** - Type-safe development

### Styling & UI

- **Tailwind CSS 4.0** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - High-quality component library
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Heroicons** - Additional icon set

### Form Management

- **React Hook Form** - Performant form library
- **Zod** - Schema validation
- **@hookform/resolvers** - Form validation integration

### Rich Text Editing

- **TipTap** - Modern rich text editor
- **TinyMCE** - Alternative rich text editor
- **CKEditor** - Additional editor option

### State & Data Management

- **Next.js Server Components** - Server-side rendering
- **React Context** - Client-side state management
- **Cookie-based sessions** - Secure token storage

### Real-Time Features

- **STOMP.js** - WebSocket protocol implementation
- **SockJS** - WebSocket fallback library
- **@stomp/stompjs** - Modern STOMP client

### Authentication

- **Firebase** - Authentication service
- **JWT** - Token-based authentication
- **jwt-decode** - JWT token decoding

### Payment Processing

- **VNPay Integration** - Payment gateway

### Additional Libraries

- **date-fns** - Date utility library
- **Sonner** - Toast notifications
- **next-themes** - Theme management
- **Ant Design** - UI component library
- **Emoji Picker** - Emoji selection component

### Development Tools

- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Turbopack** - Fast bundler (Next.js)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- **Git** for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd sportsnet_frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_API_ENDPOINT=your_api_endpoint_here
   ```

   For Firebase authentication, you'll also need to configure Firebase credentials in your Firebase project.

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

---

## 📁 Project Structure

```
sportsnet_frontend/
├── public/                 # Static assets
│   ├── logos/             # Brand logos
│   └── aboutUs/           # About us images
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (admin)/      # Admin routes (protected)
│   │   │   ├── admin/    # Admin dashboard pages
│   │   │   └── _components/  # Admin components
│   │   ├── (auth)/       # Authentication routes
│   │   │   ├── login/    # Login page
│   │   │   ├── signup/   # Registration page
│   │   │   └── verify/   # OTP verification
│   │   ├── (main)/       # Main application routes
│   │   │   ├── clubs/    # Club management
│   │   │   ├── events/   # Event management
│   │   │   ├── tournaments/  # Tournament pages
│   │   │   ├── profile/   # User profiles
│   │   │   ├── chat/     # Chat functionality
│   │   │   └── my-clubs/ # User's clubs
│   │   ├── api/          # API routes
│   │   ├── layout.tsx    # Root layout
│   │   └── globals.css   # Global styles
│   ├── apiRequest/       # API client functions
│   │   ├── auth.ts      # Authentication APIs
│   │   ├── club.ts      # Club APIs
│   │   ├── event.ts     # Event APIs
│   │   ├── tournament.ts # Tournament APIs
│   │   └── ...          # Other API modules
│   ├── components/       # Reusable components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── chat/        # Chat components
│   │   └── ...          # Other components
│   ├── lib/             # Utility libraries
│   │   ├── http.ts      # HTTP client
│   │   ├── utils.ts     # Utility functions
│   │   └── firebase.ts  # Firebase config
│   ├── schemaValidations/  # Zod schemas
│   ├── enums/           # TypeScript enums
│   ├── config.ts        # Environment config
│   └── middleware.ts    # Next.js middleware
├── next.config.ts       # Next.js configuration
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── package.json         # Dependencies
```

---

## 🔧 Environment Variables

The application requires the following environment variables:

### Required Variables

| Variable                   | Description          | Example                        |
| -------------------------- | -------------------- | ------------------------------ |
| `NEXT_PUBLIC_API_ENDPOINT` | Backend API base URL | `https://api.badmintonnet.com` |

### Firebase Configuration

For Firebase authentication, configure your Firebase project and add the credentials to your Firebase configuration file (`src/lib/firebase.ts`).

---

## 📜 Available Scripts

| Script          | Description                             |
| --------------- | --------------------------------------- |
| `npm run dev`   | Start development server with Turbopack |
| `npm run build` | Build production bundle with Turbopack  |
| `npm run start` | Start production server                 |
| `npm run lint`  | Run ESLint for code quality checks      |

---

## 🔑 Key Features Explained

### Authentication Flow

1. **Login/Registration**: Users can sign up or log in using email/password or Google OAuth
2. **OTP Verification**: Email verification with OTP for new accounts
3. **Token Management**: Automatic JWT token refresh on expiration
4. **Session Persistence**: Secure cookie-based session management

### Club Management

- **Create Clubs**: Users can create badminton clubs with custom settings
- **Join Clubs**: Browse and join clubs based on location, skill level, and facilities
- **Club Dashboard**: Comprehensive club management interface for owners
- **Member Management**: Invite, manage, and track club members
- **Event Organization**: Create and manage club events

### Event System

- **Event Discovery**: Advanced filtering by date, location, skill level, and price
- **Event Registration**: Join events with payment processing
- **Event Management**: Create, edit, and cancel events
- **Participant Tracking**: Monitor event participants and attendance

### Tournament Features

- **Tournament Creation**: Set up tournaments with custom rules and brackets
- **Automatic Bracket Generation**: Smart bracket creation based on participants
- **Match Management**: Track matches, scores, and results
- **Tournament Analytics**: Comprehensive statistics and leaderboards

### Rating System

- **ELO Rating**: Accurate skill assessment using ELO algorithm
- **Rating History**: Track rating changes over time
- **Skill Matching**: Find opponents with similar skill levels
- **Performance Analytics**: Detailed performance metrics

### Real-Time Chat

- **WebSocket Integration**: Real-time messaging using STOMP protocol
- **Chat Widget**: Persistent chat interface
- **Club Chat**: Group messaging for clubs
- **Event Chat**: Communication for event participants

---

## 🔐 Authentication

The application uses a multi-layered authentication system:

1. **Firebase Authentication**: Primary authentication service
2. **JWT Tokens**: Access and refresh token management
3. **Cookie Storage**: Secure HttpOnly cookies for token storage
4. **Automatic Refresh**: Seamless token refresh on expiration
5. **Device Tracking**: Device ID for enhanced security

### Authentication Routes

- `/login` - User login page
- `/signup` - User registration page
- `/verify` - OTP verification page

---

## 🌐 API Integration

The application communicates with a RESTful backend API. All API requests are handled through the centralized HTTP client (`src/lib/http.ts`).

### API Client Features

- **Automatic Token Injection**: JWT tokens automatically added to requests
- **Token Refresh**: Automatic refresh on 401 errors
- **Error Handling**: Centralized error handling and user feedback
- **Request/Response Interceptors**: Custom request/response processing

### API Modules

- `auth.ts` - Authentication endpoints
- `club.ts` - Club management endpoints
- `event.ts` - Event management endpoints
- `tournament.ts` - Tournament endpoints
- `payment.ts` - Payment processing
- `chat.ts` - Chat functionality
- `rating.ts` - Rating system
- And more...

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

### Deployment Platforms

The application can be deployed on:

- **Vercel** (Recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker** containers
- Any Node.js hosting platform

### Environment Setup for Production

Ensure all environment variables are configured in your deployment platform's environment settings.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use ESLint for code quality
- Write meaningful commit messages
- Add comments for complex logic

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

## 👥 Support

For support, please contact the development team or open an issue in the repository.

---

<div align="center">

**Built with ❤️ for the badminton community**

_Connecting players, one match at a time_

</div>
