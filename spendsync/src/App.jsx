import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import WelcomePage from "./pages/Test/WelcomePage";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Dashboard from "./pages/Dashboard";
import TestToken from "./pages/TestToken";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthNavbar from "./components/navbar/AuthNavbar";
import Navbar from "./components/welcome/Navbar";
import Footer from "./components/welcome/Footer";
import Feed from "./pages/Feed/Feed";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings";


function App() {
return (
	
<BrowserRouter>
<AuthProvider>
<div className="min-h-screen bg-gray-900 text-white">
<Routes>
<Route path="/" element={<PublicOnly><WelcomePage /></PublicOnly>} />
<Route path="/login" element={<PublicOnly><AuthLayout><Login /></AuthLayout></PublicOnly>} />
<Route path="/signup" element={<PublicOnly><AuthLayout><SignUp /></AuthLayout></PublicOnly>} />
<Route path="/test-token" element={<TestToken />} />
<Route path="/dashboard" element={<Protected><DashboardLayout /></Protected>} />
<Route path="/feed" element={<Protected><FeedLayout /></Protected>} />
<Route path="/profile" element={<Protected><ProfileLayout /></Protected>} />
<Route path="/settings" element={<Protected><SettingsLayout /></Protected>} />
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

function PublicOnly({ children }) {
	const { user, loading } = useAuth()
	if (loading) return null
	if (user) return <Navigate to="/dashboard" replace />
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
 <AuthNavbar onAddExpense={() => {
   console.log('🔘 Add Expense button clicked in navbar');
   // This will be handled by the Dashboard component
   const dashboardElement = document.querySelector('[data-dashboard]');
   console.log('🎯 Dispatching addExpense event to:', dashboardElement);
   if (dashboardElement) {
     dashboardElement.dispatchEvent(new CustomEvent('addExpense'));
     console.log('✅ Custom event dispatched');
   } else {
     console.error('❌ Dashboard element not found for event dispatch');
   }
 }} />
 <main className="flex-grow">
 <Dashboard />
 </main>
 <Footer />
 </div>
 )
}

function FeedLayout() {
return (
<div className="min-h-screen bg-gray-900 text-white flex flex-col">
<AuthNavbar />
<main className="flex-grow">
<Feed />
</main>
<Footer />
</div>
)
}

function ProfileLayout() {
return (
<div className="min-h-screen bg-gray-900 text-white flex flex-col">
<AuthNavbar />
<main className="flex-grow">
<Profile />
</main>
<Footer />
</div>
)
}

function SettingsLayout() {
return (
<div className="min-h-screen bg-gray-900 text-white flex flex-col">
<AuthNavbar />
<main className="flex-grow">
<Settings />
</main>
<Footer />
</div>
)
}