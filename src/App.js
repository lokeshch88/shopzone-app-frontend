import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import LoginPage from "./components/LoginPage";
import AdminDashboard from "./components/AdminDashboard";
import HomePage from "./components/Home";
import RegisterPage from "./components/RegisterPage";
import ProfilePage from "./components/ProfilePage";
import CartPage from "./components/CartPage";
import ProductPage from "./components/ProductPage";
import PaymentPage from "./components/paymentPage";
import PaymentResultPage from "./components/PaymentResultPage";
import OrdersPage from "./components/OrderPage";
import UserManagement from "./components/UserManagement";
import ProductManagement from "./components/ProductManagement";
import CategoryManagement from "./components/CategoryManagement";
import OrderManagement from "./components/OrderManagent";

function App() {
  return (
    <Router>
      <NavBar />
      <div style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/register-user" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/proceed-payment" element={<PaymentPage />} />
          <Route path="/payment-result" element={<PaymentResultPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/products" element={<ProductManagement />} />
          <Route path="/admin/categories" element={<CategoryManagement />} />
          <Route path="/admin/orders" element={<OrderManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
