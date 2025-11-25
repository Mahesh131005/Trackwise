# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Trackwise
1. 🧠 AI-Powered Financial Coaching
Most apps just show you what you spent. TrackWise tells you how to save.

Gemini Integration: We integrated Google’s Gemini AI directly into the dashboard. It analyzes your specific spending patterns, compares them against your budgets, and generates personalized, actionable savings tips in plain English.

Context-Aware: The AI understands your "Food" vs. "Entertainment" spending and offers advice tailored to your actual habits.

2. ⚡ Smart Automation (The "Set & Forget" Engine)
Manual entry is the reason most people stop tracking expenses. TrackWise solves this with a robust backend scheduler.

Recurring Expenses: Add your subscriptions (Netflix, Rent, Gym) once.

Automated Scheduler: A server-side Cron job runs every night. If a bill is due, TrackWise automatically creates the transaction for you and updates the next due date. You never miss logging a fixed expense.

3. 🚨 Proactive Budget Enforcers
We don't just track budgets; we defend them.

Real-Time Alerts: The system monitors your category budgets in real-time.

Email Notifications: The moment you hit 90% or 100% of a specific budget (e.g., "Food"), the backend triggers an automatic email alert to your inbox. It stops overspending before it gets out of hand.

4. 📊 Data Visualization & Reporting
Numbers are hard to read; charts are easy.

Interactive Dashboards: View your financial health at a glance with dynamic Bar Charts (Monthly Trends) and Pie Charts (Category Distribution).

One-Click PDF Reports: Need to share your finances or save a snapshot? Generate a professional, high-resolution PDF report of your entire dashboard with a single click.

CSV Export: For the data nerds, export your entire transaction history to CSV for Excel analysis.

5. 🎨 Modern & Accessible UI
Dark Mode Support: Fully integrated theme toggling (Light/Dark) that saves your preference, making late-night budgeting easy on the eyes.

Responsive Design: Works seamlessly on desktop and mobile thanks to a collapsible sidebar and responsive grid layouts.

6. 🔐 Enterprise-Grade Security
Google OAuth & JWT: Sign up instantly with your Google account or via email. Sessions are secured using JSON Web Tokens.

Row Level Security (RLS): Built on Supabase, TrackWise uses RLS policies. This ensures that user data is cryptographically segregated—users can only see or edit their own data, making it secure by design.

🛠 Under the Hood (Tech Stack)
Frontend: React + Vite + TailwindCSS (Shadcn UI for sleek components).

Backend: Node.js + Express.

Database: Supabase (PostgreSQL).

AI: Google Gemini API.

Services: Nodemailer (Email), Node-cron (Scheduling).

TrackWise turns financial tracking from a chore into an automated, insightful experience. It’s not just about tracking expenses; it’s about mastering them.
