import React,{Component} from "react"
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

 class AppSidebar extends Component{
  render() {
    return (
      <div> <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar variant="push" >
            <SidebarHeader style={{backgroundColor:"#4DA8DA",color:"white"}} className="text-white"></SidebarHeader>
          <SidebarContent  style={{backgroundColor:"#4DA8DA",color:"white"}} className="text-white">
            <div className="flex"><img style={{height:"50px",width:"auto"}} src="#"/> <h2 className="text-2xl font-bold mb-4">Track Wise</h2></div>
            <SidebarGroup>
            <SidebarMenu  className="list-none p-0">
              <SidebarMenuItem>
                <SidebarMenuButton style={{backgroundColor:"FFD66B",color:"white"}} >Home</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton style={{backgroundColor:"FFD66B",color:"white"}}>Expenses</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            </SidebarGroup>
            <SidebarFooter/>
          </SidebarContent>
        </Sidebar>
<main>
        <SidebarTrigger className="bg-blue-600 text-white rounded-md p-2 hover:bg-blue-700"/>
      </main>
        <SidebarInset className="p-6">
          <h1 className="text-4xl font-bold text-black">Track Wise</h1>
        </SidebarInset>
      </div>
    </SidebarProvider></div>
    )
  }
}
export {AppSidebar}
