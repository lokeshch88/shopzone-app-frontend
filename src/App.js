import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import LoginPage from "./components/LoginPage";
import DashboardPage from "./components/DashboardPage";
import AdminDashboard from "./components/AdminDashboard";
import HomePage from "./components/Home";
import RegisterPage from "./components/RegisterPage";
import ProfilePage from "./components/ProfilePage";

function App() {
  return (
    <Router>
      <NavBar />
      <div style={{ padding: 20 }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/register-user" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
