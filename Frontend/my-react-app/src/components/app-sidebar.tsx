import { Calendar, Home, Inbox, Search, Settings, LayoutDashboard ,TagsIcon,DownloadCloud,BellIcon,UserRound, SunDim} from "lucide-react"
import { NavLink } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items
const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Tasks", url: "/tasks", icon: TagsIcon },
  { title: "Inbox", url: "#", icon: Inbox },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Notifications", url: "#", icon: BellIcon },
  { title: "Search", url: "#", icon: Search },
  { title: "Employees", url: "/employees", icon: UserRound },
  { title: "Holidays", url: "/holidays", icon: SunDim },
]

export function AppSidebar() {
  return (
    <Sidebar className="bg-gradient-to-b from-gray-100 to-gray-200 text-black border-r border-gray-200">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="   text-xl font-lg font-medium text-black">CongoTech</SidebarGroupLabel>
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
    </Sidebar>
  )
}
