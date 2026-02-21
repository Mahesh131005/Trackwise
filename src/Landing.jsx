import React from "react";
import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./components/theme-provider";

export default function Landing() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="w-screen h-screen min-h-screen flex flex-col transition-colors duration-300 bg-gradient-to-br from-sky-50 via-white to-slate-50 text-slate-900 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 dark:text-slate-100">
      <header className="w-full px-6 py-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-indigo-600 shadow-lg flex items-center justify-center text-white font-bold">TW</div>
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-white">Track Wise</h1>
        </div>
        <nav className="flex items-center space-x-4">
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title="Toggle dark mode"
          >
            {theme === "light" ? <Moon className="w-5 h-5 text-slate-800" /> : <Sun className="w-5 h-5 text-yellow-400" />}
          </button>
          <Link to="/login" className="px-4 py-2 rounded-md bg-[#ffffff] dark:bg-gray-700 shadow text-sm font-medium hover:shadow-md dark:text-white">Login</Link>
          <Link to="/signup" className="px-4 py-2 rounded-md bg-primary text-white font-medium hover:opacity-95">Sign up</Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col px-0 py-0 justify-center items-center">
        {/* Hero Section */}
        <div className="w-full flex justify-center items-center grow mb-12">
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <section className="p-8 bg-[#ffffff] dark:bg-slate-800 rounded-2xl shadow-lg animate-fadeIn border border-gray-200 dark:border-gray-800">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Know every rupee — Track Wise</h2>
              <p className="text-slate-700 dark:text-slate-200 mb-6">Track Wise helps you log expenses, manage budgets and save smarter. A clean, fast budget manager for people who want real control over their money.</p>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">✓</div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Simple expense tracking</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-200">Quickly add expenses and categorize them for insightful reports.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">⚡</div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Smart budgets</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-200">Set monthly budgets and get alerted when you're close to limits.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">🔒</div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Secure & private</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-200">Your data stays with you — we use industry standard practices for safety.</p>
                  </div>
                </li>
              </ul>

              <div className="flex items-center gap-3">
                <Link to="/signup" className="px-4 py-2 bg-primary text-white rounded-md shadow hover:opacity-95">Get started</Link>
                <Link to="/login" className="px-4 py-2 border border-slate-200 dark:border-gray-600 rounded-md text-sm dark:text-white dark:hover:bg-slate-700">Already have an account?</Link>
              </div>
            </section>

            <section className="p-6 rounded-2xl bg-white/85 dark:bg-slate-800 shadow-lg animate-slideUp border border-gray-200 dark:border-gray-700">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Why Track Wise?</h3>
                <p className="text-sm text-slate-700 dark:text-slate-200">Understand spending patterns, reduce wasteful expenses and reach your saving goals faster.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">25k+</div>
                  <div className="text-xs text-slate-700 dark:text-slate-200">Active users</div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">1.2M</div>
                  <div className="text-xs text-slate-700 dark:text-slate-200">Transactions logged</div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl font-bold text-primary">₹18M</div>
                  <div className="text-xs text-slate-700 dark:text-slate-200">Money tracked</div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">4.8 ⭐</div>
                  <div className="text-xs text-slate-700 dark:text-slate-200">Avg rating</div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-slate-900 dark:text-white">How it helps</h4>
                <p className="text-sm text-slate-600 dark:text-slate-200">From daily coffee to monthly rent, Track Wise gives you a clear picture. Use analytics to make better decisions and save more each month.</p>
              </div>
            </section>
          </div>
        </div>

        {/* Features Section (Scrollable) */}
        <div className="max-w-6xl mx-auto w-full mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#ffffff] dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-lg transform transition-transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 animate-fadeIn">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Smart Analytics</h3>
              <p className="text-slate-700 dark:text-slate-200">Get visual insights into your spending habits with detailed charts and category breakdowns.</p>
            </div>
            <div className="p-6 bg-[#ffffff] dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-lg transform transition-transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 animate-fadeIn" style={{ animationDelay: "0.1s" }}>
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Budget Goals</h3>
              <p className="text-slate-700 dark:text-slate-200">Set spending limits and get real-time alerts when you're approaching your budget thresholds.</p>
            </div>
            <div className="p-6 bg-[#ffffff] dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-lg transform transition-transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 animate-fadeIn" style={{ animationDelay: "0.2s" }}>
              <div className="text-4xl mb-3">🔄</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Recurring Expenses</h3>
              <p className="text-slate-700 dark:text-slate-200">Automatically track monthly subscriptions and recurring bills without manual entry.</p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-6xl mx-auto w-full mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">Why Users Love Track Wise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4 p-6 bg-gradient-to-r from-blue-50 dark:from-slate-800 to-transparent dark:to-slate-900 rounded-xl border border-blue-200 dark:border-blue-900">
              <div className="text-3xl">💰</div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Save More Money</h4>
                <p className="text-sm text-slate-700 dark:text-slate-200">Users report saving 20-30% more per month after using Track Wise.</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-gradient-to-r from-green-50 dark:from-slate-800 to-transparent dark:to-slate-900 rounded-xl border border-green-200 dark:border-green-900">
              <div className="text-3xl">⏱️</div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Save Time</h4>
                <p className="text-sm text-slate-700 dark:text-slate-200">Add expenses in seconds with our quick-add interface.</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-gradient-to-r from-purple-50 dark:from-slate-800 to-transparent dark:to-slate-900 rounded-xl border border-purple-200 dark:border-purple-900">
              <div className="text-3xl">📈</div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Track Progress</h4>
                <p className="text-sm text-slate-700 dark:text-slate-200">Monitor your financial goals and celebrate milestones.</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-gradient-to-r from-orange-50 dark:from-slate-800 to-transparent dark:to-slate-900 rounded-xl border border-orange-200 dark:border-orange-900">
              <div className="text-3xl">🤖</div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">AI Recommendations</h4>
                <p className="text-sm text-slate-700 dark:text-slate-200">Get personalized savings tips based on your spending patterns.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto w-full mb-16">
          <div className="p-12 bg-gradient-to-r from-primary/10 dark:from-slate-800 to-indigo-100 dark:to-slate-900 rounded-2xl text-center border border-primary/20 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Ready to take control of your money?</h2>
            <p className="text-slate-600 dark:text-slate-200 mb-6">Join thousands of users already tracking their expenses smartly.</p>
            <div className="flex justify-center gap-4">
              <Link to="/signup" className="px-6 py-3 bg-primary text-white rounded-md shadow hover:opacity-95 font-medium">Start for Free</Link>
              <Link to="/login" className="px-6 py-3 border-2 border-primary text-primary dark:text-white dark:border-indigo-400 rounded-md font-medium hover:bg-primary/10 dark:hover:bg-primary/20">Sign In</Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full text-center py-8 text-sm text-slate-500 dark:text-slate-300 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-slate-800/50">
        <p>© {new Date().getFullYear()} Track Wise — Know every rupee</p>
        <p className="mt-2 text-xs">Made with ❤️ to help you manage your finances better.</p>
      </footer>
    </div>
  );
}
