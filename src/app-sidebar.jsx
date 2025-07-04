import React,{Component} from "react"
import { useNavigate } from "react-router-dom";
import logo from './assets/Print_Transparent.svg';

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarGroup,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar.jsx"

 function AppSidebar(){
  const navigate = useNavigate();
  const handleLogout = () => {
  localStorage.removeItem("token"); // remove JWT
  navigate("/"); // redirect to login
};
    return (
      <div> <SidebarProvider style={{backgroundColor: "#F1F6F9"}}>
      <div className="flex min-h-screen">
        <Sidebar variant="push" >
            <SidebarHeader style={{backgroundColor:"#212A3E",color:"white"}} className="text-white"></SidebarHeader>
          <SidebarContent  style={{backgroundColor:"#212A3E",color:"white"}} className="text-white">
            <div className="flex"><img src={logo} style={{height:"50px",width:"auto"}} />
             <h2 className="text-2xl font-bold mb-4">Track Wise</h2>
             </div>
            <SidebarGroup>
            <SidebarMenu  className="list-none p-0">
              <SidebarMenuItem>
                <SidebarMenuButton style={{backgroundColor:"FFD66B",color:"white"}}
              onClick={()=>navigate("/home")}
               >Home</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton style={{backgroundColor:"FFD66B",color:"white"}} onClick={()=>navigate("/reports")}>Expenses Report</SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton style={{backgroundColor:"FFD66B",color:"white"}} onClick={() => alert("Contact us at: mahesh131005@gmail.com")}>Contact Us</SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton style={{backgroundColor:"FFD66B",color:"white"}} onClick={()=>handleLogout()}>Logout</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            </SidebarGroup>
            <SidebarFooter/>
          </SidebarContent>
        </Sidebar>
<main>
        <SidebarTrigger className="bg-blue-600 text-white rounded-md p-2 hover:bg-blue-700"/>
      </main>
        {/* <SidebarInset className="p-6" style={{backgroundColor:"F1FDF3"}}>
          {/* <h1 className="text-4xl font-bold text-black">Track Wise</h1> \
        </SidebarInset> */}
      </div>
    </SidebarProvider></div>
    )
}
export {AppSidebar}
