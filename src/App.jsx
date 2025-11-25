import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppSidebar } from "./app-sidebar.jsx";
import { Home } from "./Home.jsx";
import { Reports } from "./Reports.jsx";
import { Login } from "./Login.jsx";
import Signup from "./signup.jsx";
import PrivateRoute from "./PrivateRouter.jsx";
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { ThemeProvider } from "./components/theme-provider";
import { RecurringExpenses } from "./RecurringExpenses";



function App() {
  return (
    <GoogleOAuthProvider clientId="552525546766-earub2pupqprvpvi7drglvnacqh5l2a0.apps.googleusercontent.com">
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Router>
          <div className="flex">
            <AppSidebar />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/home" element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                } />

                <Route path="/reports" element={
                  <PrivateRoute>
                    <Reports />
                  </PrivateRoute>
                } />
                <Route path="/recurring" element={
                  <PrivateRoute>
                    <RecurringExpenses />
                  </PrivateRoute>
                } />
              </Routes>
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}
export default App;
