import {Routes,Route} from "react-router-dom"
import LoginPage from "../src/login/LoginPage"
import App from "@/App"

export default function AppRoutes(){
    return(
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route element={<App />}>
                <Route path="/dashboard" element={<div>Dashboard</div>} />
            </Route>

            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<LoginPage/>}/>
            <Route path="/forgot-password" element={<LoginPage/>}/>
            <Route path="/reset-password" element={<LoginPage/>}/>
            <Route path="/verify-email" element={<LoginPage/>}/>
        </Routes>
    )
}
