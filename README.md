# AthleteTrack - Athlete Management and Tracking System
A modern platform for sports clubs and coaches to manage athletes, training, injuries, and performance in one place.

![.NET 9](https://img.shields.io/badge/.NET-9.0-512BD4?logo=dotnet&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![MSSQL](https://img.shields.io/badge/MSSQL-Server-CC2927?logo=microsoftsqlserver&logoColor=white)
![EF Core](https://img.shields.io/badge/EF%20Core-9-6DB33F?logo=.net&logoColor=white)

## 🚀 Technologies Used

- Frontend: React (Vite), TypeScript, Tailwind CSS, shadcn/ui, Recharts

- Backend: .NET 9 Web API, Entity Framework Core

- Database: MS SQL Server

## Database Diagram

![Database Diagram](./docs/db_diagram.png)

## Screenshots

![Landing Page](./docs/landing.png)

![Login Page](./docs/login.png)

![Dashboard Page](./docs/dashboard.png)

![Account Page](./docs/account.png)

## 🛠️ Getting Started

Follow the steps below to run the project on your machine:

### 1. Database Setup

- Open SQL Server Management Studio (SSMS).

- Open and run `API/Scripts/DatabaseBackup.sql` (or use the `Update-Database` command).

- Make sure the `"Server"` value in `API/appsettings.json` matches your local environment.

### 2. Start the Backend

- Go to the API folder in your terminal: `cd API`

- Run the command: `dotnet watch run`

- The server will run at http://localhost:5028.

### 3. Start the Frontend

- Open a new terminal and go to the Client folder: `cd Client`

- Install packages (first time only): `npm install`

- Run the command: `npm run dev`

- Open the generated link in your browser (e.g., http://localhost:5173).

🔑 Login Credentials (Test Account)

- Email: kerem@athletetrack.com

- Password: 123456

- (Note: Hashing is enabled in the system, so this password is stored in encrypted form in the database.)

### 🌟 Key Features

- Role-Based Access: Only corporate accounts with the `@athletetrack.com` domain can sign in.

- Advanced Dashboard: Real-time data analysis and visual reporting.

- Relational Database: 11 tables designed according to 3NF normalization rules.

- Security: Password hashing (BCrypt), temporary password warnings, and Soft Delete architecture.
