import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "@/pages/LandingPage"
import "./index.css"
// import Dashboard from "@/pages/Dashboard" // Optional future routes
// import ProtectedRoute from "@/components/ProtectedRoute" // For private routes

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />

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
    </Router>
  )
}

export default App
