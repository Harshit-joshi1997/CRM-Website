import React from "react";
import {Routes,Route} from "react-router-dom"
import App from "@/App"
import Login from "@/login/login"
import Dashboard from "@/components/Dashboard"
import Tasks from "@/components/Tasks"
import Calendar from "@/components/Calendar"
import Employees from "@/components/Employees"
import Holidays from "@/components/Holidays"
import Claims from "@/components/Claims"
import { Leaves } from "@/components/Leaves"
import { Increment } from "@/components/Increment"
import { useAuth } from "@/Context/AuthContext"
import { Navigate } from "react-router-dom"




export default function AppRoutes(){

  const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
    const { user, token, isLoading } = useAuth();

    if (isLoading) {
      // You can render a loading spinner here while the session is being restored.
      return <div>Loading session...</div>;
    }

    return user && token ? children : <Navigate to="/" replace />;
  };

  return(
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/register" element={<Login/>}/>
      <Route path="/forgot-password" element={<Login/>}/>
      <Route path="/reset-password" element={<Login/>}/>
      <Route path="/verify-email" element={<Login/>}/>

      {/* Protected routes */}
      <Route element={<PrivateRoute><App /></PrivateRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks/>} />
        <Route path="/calendar" element={<Calendar/>} />
        <Route path="/employees" element={<Employees/>} />
        <Route path="/holidays" element={<Holidays/>} />
        <Route path="/claims" element={<Claims/>} />
        <Route path="/leaves" element={<Leaves/>} />
        <Route path="/increment" element={<Increment/>} />
      </Route>
    </Routes>
  )
}
