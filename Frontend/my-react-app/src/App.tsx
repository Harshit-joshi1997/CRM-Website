import './App.css'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Outlet } from "react-router-dom"
import { Navbar } from './components/Navbar'


export default function App() {
  return (
    <SidebarProvider>
      
      <AppSidebar />
      <div className="flex flex-col flex-1">
       <Navbar/>
      {/* Main Content */}
      
        <main className="pt-14 px-4">
        <SidebarTrigger />
        <Outlet />
      </main>
      </div>
    </SidebarProvider>
  )
}
