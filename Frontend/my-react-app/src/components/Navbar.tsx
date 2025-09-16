"use client"

import { useEffect, useState } from "react"
import { LogOut, User, Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface Notification {
  _id: string
  message: string
  createdAt: string
}

export function Navbar() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const handleLogout = () => {
  // Clear auth data (adjust depending on your app)
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
};

interface User {
  name: string;
  // You can add other properties like email, id if needed
}

 const [user, setUser] = useState<User | null>(null);

useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }, []);

  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    const names = name.split(" ").filter(Boolean);
    return names.length > 1
      ? `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };
  const initials = getInitials(user?.name);

  return (
    <header className="flex fixed top-0 right-0 z-45 h-14 items-center justify-between border-b bg-background px-4 shadow-sm w-[calc(100%-16rem)] ml-64">
      {/* Left: Brand / App Name */}
      <div className="font-semibold text-lg">Welcome</div>

      {/* Right: Icons */}
      <div className="flex items-center space-x-4">
        {/* 🔔 Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-6 w-6" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {notifications.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-72">
            {loading ? (
              <DropdownMenuItem>Loading...</DropdownMenuItem>
            ) : notifications.length > 0 ? (
              notifications.map((note) => (
                <DropdownMenuItem key={note._id}>
                  {note.message}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem>No notifications</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 👤 Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                {/* The fallback is only shown if AvatarImage fails to load.
                    Since there's no dynamic user image, we'll just show the fallback. */}
                <AvatarFallback className="bg-blue-600 text-white font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem disabled>
              {user ? `${initials} - ${user.name}` : "Guest"}
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4 text-red-500" />
              <span className="text-red-500">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
