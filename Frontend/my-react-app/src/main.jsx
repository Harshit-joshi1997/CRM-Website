import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import './index.css'
import AppRoutes from '../routes/routes.tsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <StrictMode>
    <AppRoutes />
  </StrictMode>
  </BrowserRouter>
)
