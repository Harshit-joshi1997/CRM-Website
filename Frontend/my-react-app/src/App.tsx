import './App.css'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Outlet } from "react-router-dom"

export default function App() {
  return (
    <SidebarProvider>
      
      <AppSidebar />

      {/* Main Content */}
      <main>
        {/* Sidebar toggle button */}
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
