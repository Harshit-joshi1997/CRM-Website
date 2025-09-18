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
import PrivateRoute from "@/components/PrivateRoute"


export default function AppRoutes(){
    return(
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/register" element={<Login/>}/>
            <Route path="/forgot-password" element={<Login/>}/>
            <Route path="/reset-password" element={<Login/>}/>
            <Route path="/verify-email" element={<Login/>}/>


            <Route element={<PrivateRoute/>}>
            <Route element={<App />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tasks" element={<Tasks/>} />
                <Route path="/calendar" element={<Calendar/>} />
                <Route path="/employees" element={<Employees/>} />
                <Route path="/holidays" element={<Holidays/>} />
                <Route path="/claims" element={<Claims/>} />
                <Route path="/leaves" element={<Leaves/>} />
                <Route path="/increment" element={<Increment/>} />
            </Route>
            </Route>
        </Routes>
    )
}
