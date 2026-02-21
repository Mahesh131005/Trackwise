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
    <>
      <Sidebar variant="push" className="dark:border-r border-slate-800">
        <SidebarHeader className="bg-[#212A3E] text-white dark:bg-slate-950 transition-colors duration-300"></SidebarHeader>
        <SidebarContent className="bg-[#212A3E] text-white dark:bg-slate-950 transition-colors duration-300">
          <div className="flex"><img src={logo} style={{ height: "50px", width: "auto" }} />
            <h2 className="text-2xl font-bold mb-4">Track Wise</h2>
          </div>
          <SidebarGroup>
            <SidebarMenu className="list-none p-0">
              <SidebarMenuItem>
                <SidebarMenuButton className="text-slate-300 hover:text-white hover:bg-white/10 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => navigate("/home")}
                >
                  <Home className="mr-2 h-4 w-4" />
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-slate-300 hover:text-white hover:bg-white/10 dark:hover:bg-slate-800 transition-colors" onClick={() => navigate("/reports")}>
                  <Inbox className="mr-2 h-4 w-4" />
                  <span>Expenses Report</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-slate-300 hover:text-white hover:bg-white/10 dark:hover:bg-slate-800 transition-colors" onClick={() => navigate("/recurring")}>
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Recurring</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-slate-300 hover:text-white hover:bg-white/10 dark:hover:bg-slate-800 transition-colors" onClick={() => navigate("/contact")}>Contact Us</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-slate-300 hover:text-white hover:bg-white/10 dark:hover:bg-slate-800 transition-colors" onClick={() => handleLogout()}>Logout</SidebarMenuButton>
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
    </>
  )
}
export { AppSidebar }
