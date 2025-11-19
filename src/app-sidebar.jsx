import React from "react";
import { useNavigate } from "react-router-dom";
import logo from './assets/Print_Transparent.svg';
import { Calendar, Home, Inbox, Moon, Sun } from "lucide-react";
import { useTheme } from "./components/theme-provider";
import { Button } from "./components/ui/button";

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar.jsx"

function AppSidebar() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove JWT
    navigate("/"); // redirect to login
  };

  return (
    <SidebarProvider style={{ backgroundColor: "#F1F6F9" }}>
      <div className="flex min-h-screen">
        <Sidebar variant="push" >
          <SidebarHeader style={{ backgroundColor: "#212A3E", color: "white" }} className="text-white"></SidebarHeader>
          <SidebarContent style={{ backgroundColor: "#212A3E", color: "white" }} className="text-white">
            <div className="flex"><img src={logo} style={{ height: "50px", width: "auto" }} />
              <h2 className="text-2xl font-bold mb-4">Track Wise</h2>
            </div>
            <SidebarGroup>
              <SidebarMenu className="list-none p-0">
                <SidebarMenuItem>
                  <SidebarMenuButton style={{ backgroundColor: "FFD66B", color: "grey" }}
                    onClick={() => navigate("/home")}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    <span>Home</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton style={{ backgroundColor: "FFD66B", color: "grey" }} onClick={() => navigate("/reports")}>
                    <Inbox className="mr-2 h-4 w-4" />
                    <span>Expenses Report</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton style={{ backgroundColor: "FFD66B", color: "grey" }} onClick={() => navigate("/recurring")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Recurring</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton style={{ backgroundColor: "FFD66B", color: "grey" }} onClick={() => alert("Contact us at: mahesh131005@gmail.com")}>Contact Us</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton style={{ backgroundColor: "FFD66B", color: "grey" }} onClick={() => handleLogout()}>Logout</SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            <SidebarFooter>
              <div className="p-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:text-white hover:bg-gray-700"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                  <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                </Button>
              </div>
            </SidebarFooter>
          </SidebarContent>
        </Sidebar>
        <main>
          <SidebarTrigger className="bg-blue-600 text-grey rounded-md p-2 hover:bg-blue-700" />
        </main>
      </div>
    </SidebarProvider>
  )
}
export { AppSidebar }
