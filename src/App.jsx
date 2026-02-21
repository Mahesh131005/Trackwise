import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AppSidebar } from "./app-sidebar.jsx";
import { Home } from "./Home.jsx";
import { Reports } from "./Reports.jsx";
import { Login } from "./Login.jsx";
import Signup from "./signup.jsx";
import Landing from "./Landing.jsx";
import PrivateRoute from "./PrivateRouter.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from "./components/theme-provider";
import { RecurringExpenses } from "./RecurringExpenses";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.jsx";
import ContactUs from "./ContactUs.jsx";


function App() {
  return (
    <GoogleOAuthProvider clientId="552525546766-earub2pupqprvpvi7drglvnacqh5l2a0.apps.googleusercontent.com">
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Router>
          <InnerLayout />
        </Router>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}
export default App;

function InnerLayout() {
  const location = useLocation();
  const publicPaths = ["/", "/login", "/signup"];
  const showSidebar = !publicPaths.includes(location.pathname);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
        {showSidebar && <AppSidebar />}
        <div className="flex-1 flex flex-col overflow-hidden">
          {showSidebar && (
            <div className="p-2">
              <SidebarTrigger className="bg-blue-600 text-white rounded-md p-2 hover:bg-blue-700" />
            </div>
          )}
          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/home"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />

              <Route
                path="/reports"
                element={
                  <PrivateRoute>
                    <Reports />
                  </PrivateRoute>
                }
              />
              <Route
                path="/recurring"
                element={
                  <PrivateRoute>
                    <RecurringExpenses />
                  </PrivateRoute>
                }
              />
              <Route
                path="/contact"
                element={
                  <PrivateRoute>
                    <ContactUs />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
