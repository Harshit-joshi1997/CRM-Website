import {Routes,Route} from "react-router-dom"
import LoginPage from "@/login/LoginPage"
import App from "@/App"
import Login from "@/login/login"
import Dashboard from "@/components/Dashboard"
import Tasks from "@/components/Tasks"
import Calendar from "@/components/Calendar"
import Employees from "@/components/Employees"
import Holidays from "@/components/Holidays"

export default function AppRoutes(){
    return(
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<LoginPage/>}/>
            <Route path="/forgot-password" element={<LoginPage/>}/>
            <Route path="/reset-password" element={<LoginPage/>}/>
            <Route path="/verify-email" element={<LoginPage/>}/>



            <Route element={<App />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tasks" element={<Tasks/>} />
                <Route path="/calendar" element={<Calendar/>} />
                <Route path="/employees" element={<Employees/>} />
                <Route path="/holidays" element={<Holidays/>} />
            </Route>
        </Routes>
    )
}
