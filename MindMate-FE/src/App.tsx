import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "@/pages/LandingPage"
import "./index.css"
// import Dashboard from "@/pages/Dashboard" // Optional future routes
import ProtectedRoute from "@/components/ProtectedRoute" // For private routes
import PublicRoute from "./components/PublicRoute"
import Dashboard from "./pages/Dashboard"

const App = () => {
  return (
    
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        {/* Example Private Route (future use) */}
        {/* 
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        */}
      </Routes>
  
  )
}

export default App
