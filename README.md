# TaskHub Dashboard

![Dashboard Screenshot](https://via.placeholder.com/1200x600?text=Dashboard+Screenshot) <!-- Replace with actual screenshot -->

A modern, full-stack project management and collaboration dashboard built with React, Java Spring Boot, and PostgreSQL. It features a comprehensive dashboard, interactive calendar, project management, team organization, and robust user authentication.

## ✨ Features

-   **Interactive Dashboard**: Real-time overview of key metrics, upcoming events, and project progress.
-   **Dynamic Calendar**: Manage events, meetings, and deadlines with FullCalendar integration. Supports multiple views (Month, Week, Day) and event categorization.
-   **Project Management**: Create, track, and manage projects with status updates, progress bars (based on event completion), and team assignments.
-   **Team Organization**: Organize and manage teams, view members, and assign responsibilities.
-   **User Authentication**: Secure login and registration with traditional email/password and Google Sign-in via Firebase Authentication.
-   **Role-Based Permissions**: Define and manage user roles (Admin, Manager, Member) with a detailed permission matrix.
-   **User Profiles**: Personalized user profiles with system preferences.
-   **Internationalization (i18n)**: Multi-language support (Portuguese, English, Spanish).
-   **Theme Toggling**: Light and Dark mode support for enhanced user experience.
-   **Responsive Design**: Optimized for various screen sizes using Tailwind CSS.

## 🚀 Tech Stack

### Frontend
-   **React**: A JavaScript library for building user interfaces.
-   **Vite**: A fast build tool for modern web projects.
-   **TypeScript**: Strongly typed JavaScript.
-   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
-   **React Router**: For declarative routing.
-   **FullCalendar**: A JavaScript event calendar.
-   **ApexCharts**: For interactive data visualizations.
-   **Firebase Authentication**: For Google Sign-in.

### Backend
-   **Java**: The core programming language.
-   **Spring Boot**: Framework for building robust, production-ready applications.
-   **Spring Data JPA**: For easy database interaction.
-   **PostgreSQL**: A powerful, open-source relational database.
-   **Lombok**: To reduce boilerplate code in Java models.
-   **Maven**: For project build automation.

## 🛠️ Setup and Installation

Follow these steps to get your development environment running.

### Prerequisites

-   Node.js (LTS recommended) & npm/Yarn
-   Java Development Kit (JDK 17 or higher)
-   Apache Maven
-   PostgreSQL database server

### 1. Database Setup

1.  Ensure your PostgreSQL server is running.
2.  Create a new database named `dashboard_db`.
3.  Connect to `dashboard_db` and run the following SQL script to create the necessary tables:

    ```sql
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL,
      avatar VARCHAR(255), -- Added for user avatar
      team_id UUID, -- Added for team relationship
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE teams (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL,
      description TEXT, -- Added for team description
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE projects (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL,
      description TEXT,
      status VARCHAR(50) DEFAULT 'Em Andamento', -- Added status
      team VARCHAR(100), -- Added team name for display
      due_date DATE, -- Added due date
      owner_id UUID REFERENCES users(id),
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE events (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR(100) NOT NULL,
      start_time TIMESTAMP NOT NULL,
      end_time TIMESTAMP,
      all_day BOOLEAN DEFAULT FALSE, -- Added all_day
      category VARCHAR(50), -- Added category
      description TEXT, -- Added description
      status VARCHAR(20) DEFAULT 'pending', -- Added status
      project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
      created_by UUID REFERENCES users(id),
      created_at TIMESTAMP DEFAULT NOW()
    );
    ```
    *Note: The `team_id` in `users` and `team` in `projects` are currently placeholders for future full relationships.*

### 2. Backend Setup (Java Spring Boot)

1.  Navigate to the `server` directory:
    ```bash
    cd server
    ```
2.  Configure your database connection in `server/src/main/resources/application.properties`:
    ```properties
    spring.datasource.url=jdbc:postgresql://localhost:5432/dashboard_db
    spring.datasource.username=postgres
    spring.datasource.password=your_db_password_here
    ```
    **Important:** Replace `your_db_password_here` with your actual PostgreSQL password.
3.  Run the backend application:
    ```bash
    mvn spring-boot:run
    ```
    The backend should start on `http://localhost:3001`.

### 3. Frontend Setup (React)

1.  Navigate back to the project root directory:
    ```bash
    cd ..
    ```
2.  Install frontend dependencies:
    ```bash
    npm install
    # or yarn install
    ```
3.  **Firebase Configuration:**
    *   Create a Firebase project and enable Google Sign-in in Firebase Authentication.
    *   Register a web app and get your Firebase configuration keys.
    *   Create a file named `.env.local` in the **root directory** of your project and add your Firebase keys:
        ```
        VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
        VITE_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
        VITE_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
        VITE_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
        VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
        VITE_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
        ```
    *   Also, define your backend API URL (for local development):
        ```
        VITE_API_URL=http://localhost:3001/api
        ```
4.  Run the frontend application:
    ```bash
    npm run dev
    # or yarn dev
    ```
    The frontend should start on `http://localhost:5173` (or another port).

## 🚀 Usage

1.  Ensure both your Backend (Java) and Frontend (React) servers are running.
2.  Open your browser to `http://localhost:5173`.
3.  Use the Sign In/Sign Up page. For initial testing, you can register a new user or use the mock user `admin@empresa.com` with password `123456` (if you manually add it to your `users` table).
4.  Explore the Dashboard, Calendar, Projects, Teams, and Permissions features.

## 🌐 Deployment

This project is designed for a modern deployment strategy:

-   **Frontend (React)**: Can be deployed on platforms like [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/). Remember to configure your `VITE_API_URL` environment variable on the chosen platform to point to your deployed backend.
-   **Backend (Java Spring Boot)**: Can be deployed on cloud providers like [Render](https://render.com/), [Railway](https://railway.app/), AWS, or Google Cloud.
-   **Database (PostgreSQL)**: Can be hosted on managed services like [Supabase Database](https://supabase.com/database), [Neon.tech](https://neon.tech/), or provided by your cloud backend provider.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE). <!-- Ensure you have a LICENSE file -->
