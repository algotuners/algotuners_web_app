import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate, useNavigate} from "react-router-dom";
import PhoneNumberLogin from "./pages/login/PhoneNumberLogin";
import Dashboard from "./pages/dashboard/Dashboard";
import {AuthProvider, useAuth} from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

function AppContent() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<PhoneNumberLogin />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
