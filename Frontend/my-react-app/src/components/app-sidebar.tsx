import { Calendar, Home, Inbox, Search, Settings, LayoutDashboard ,TagsIcon,DownloadCloud,BellIcon} from "lucide-react"
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
  { title: "Dashboard", url: "#", icon: LayoutDashboard },
  { title: "Tags", url: "#", icon: TagsIcon },
  { title: "Inbox", url: "#", icon: Inbox },
  { title: "Calendar", url: "#", icon: Calendar },
  { title: "Notifications", url: "#", icon: BellIcon },
  { title: "Search", url: "#", icon: Search },
  { title: "Download", url: "#", icon: DownloadCloud },
  { title: "Settings", url: "#", icon: Settings },
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
                    <a
                      href={item.url}
                      className="flex items-center gap-2 text-sm hover:text-yellow-300"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
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
