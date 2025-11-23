Employee Management Web App

The Employee Management Web App is a modern, responsive application built using React, TypeScript, Tailwind CSS, and Supabase.
It allows organizations to efficiently manage employee records with real-time database updates, secure authentication, and a clean UI.

🚀 Features
📋 Employee Management

Add new employees

Update existing employee details

Delete employee records

View full employee list with clean UI

🔄 Real-Time Database (Supabase)

Auto-syncs employee data across sessions

Instant reflection of updates without page refresh

Secure backend with role-based policies

🔐 Authentication

User signup & login using Supabase Auth

Secure session handling

Protected routes for dashboard access

📊 Reporting

View employee summaries

Quick filtering/search options

Responsive layouts for easy data viewing

📱 Fully Responsive Design

Works seamlessly across desktop, tablet, and mobile

🎨 Modern UI

Styled using Tailwind CSS

Clean, minimal, and intuitive interface

🛠️ Tech Stack

React + TypeScript — Component-driven, type-safe UI

Supabase — Realtime DB + authentication

Tailwind CSS — Utility-first styling

Vite — Fast dev environment

ESLint — Linting for clean code

📂 Project Structure
src/components/     → Reusable UI components
src/pages/          → Dashboard, Login, Employee List, Add/Edit Pages
src/hooks/          → Custom hooks for fetching/updating employees
src/lib/            → Supabase client setup
public/             → Static assets
package.json        → Scripts + dependencies

▶️ How to Run Locally
npm install
npm run dev
