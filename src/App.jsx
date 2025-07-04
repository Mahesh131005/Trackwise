import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppSidebar } from "./app-sidebar.jsx";
import { Home } from "./Home.jsx";
import { Reports } from "./Reports.jsx";
import { Login } from "./Login.jsx";
import Signup from "./signup.jsx";
import PrivateRoute from "./PrivateRouter.jsx";
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';



function App() {
  return (
    <GoogleOAuthProvider clientId="552525546766-earub2pupqprvpvi7drglvnacqh5l2a0.apps.googleusercontent.com">
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
          </Routes>
        </div>
      </div>
    </Router>
    </GoogleOAuthProvider>
  );
}
export default App;
