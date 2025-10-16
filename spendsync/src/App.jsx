import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import WelcomePage from "./pages/Test/WelcomePage";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Dashboard from "./pages/Dashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthNavbar from "./components/navbar/AuthNavbar";
import Navbar from "./components/welcome/Navbar";
import Footer from "./components/welcome/Footer";

function App() {
return (
<BrowserRouter>
<AuthProvider>
<div className="min-h-screen bg-gray-900 text-white">
<Routes>
<Route path="/" element={<WelcomePage />} />
<Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
<Route path="/signup" element={<AuthLayout><SignUp /></AuthLayout>} />
<Route path="/dashboard" element={<DashboardLayout />} />
<Route path="*" element={<Navigate to="/" replace />} />
</Routes>
</div>
</AuthProvider>
</BrowserRouter>
);
}

export default App;

function Protected({ children }) {
const { user, loading } = useAuth()
if (loading) return null
if (!user) return <Navigate to="/login" replace />
return children
}

function AuthLayout({ children }) {
return (
<div className="min-h-screen bg-gray-900 text-white flex flex-col">
<Navbar />
<main className="flex-grow">
{children}
</main>
<Footer />
</div>
)
}

function DashboardLayout() {
return (
<div className="min-h-screen bg-gray-900 text-white flex flex-col">
<AuthNavbar />
<main className="flex-grow">
<Dashboard />
</main>
<Footer />
</div>
)
} 