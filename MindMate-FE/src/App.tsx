import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "@/pages/LandingPage"
import "./index.css"
// import Dashboard from "@/pages/Dashboard" // Optional future routes
import ProtectedRoute from "@/components/ProtectedRoute" // For private routes
import PublicRoute from "./components/PublicRoute"
import Dashboard from "./pages/Dashboard"
import ChatPage from "./pages/Chat"
import JournalPage from "./pages/Journal"

const App = () => {
  return (
    
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
         <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
         <Route path="/journal" element={<ProtectedRoute><JournalPage /></ProtectedRoute>} />
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
