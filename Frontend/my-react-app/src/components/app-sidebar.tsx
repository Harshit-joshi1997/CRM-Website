import { Calendar, LayoutDashboard ,TagsIcon,UserRound, SunDim, IndianRupee, Ship, Building2,Globe} from "lucide-react"
import { NavLink } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import  Chatbox  from "./Chatbox";


// Menu items
const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Tasks", url: "/tasks", icon: TagsIcon },
  { title: "Annual Increment", url: "/increment", icon: Building2 },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Leaves", url: "/leaves", icon: Ship },
  { title: "Claims & expenses", url: "/claims", icon: IndianRupee },
  { title: "Employees", url: "/employees", icon: UserRound },
  { title: "Holidays", url: "/holidays", icon: SunDim },
]

export function AppSidebar() {
  return (
    <Sidebar className="bg-gradient-to-b from-gray-100 to-gray-200 text-black border-r border-gray-200 overflow-y-auto fixed  h-full w-64 pt-1">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-bold text-indigo-600"> CongoTech<Globe color="#2626c5ff" /></SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                  <NavLink
                    to={item.url}
                    className={({ isActive }) =>
                      `flex items-center gap-2 text-lg font-medium transition-all duration-200 hover:scale-110 ${isActive ? "text-blue-600" : "text-black"}`
                    }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                  </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Chatbox />
      </SidebarFooter>
    </Sidebar>
  )
}
