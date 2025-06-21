// AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, Button, Grid, Box } from "@mui/material";
import {
  People,
  Inventory,
  Category,
  ShoppingCart,
  Dashboard,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "../utils/AxiosInstance";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalCategories: 0,
  });

  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    //fetchAdminDetails();
    fetchStats();
  }, []);

  const fetchAdminDetails = () => {
    axios
      .get("http://localhost:8080/user/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAdmin(res.data))
      .catch((err) => console.error("Failed to load admin info:", err));
  };

  const fetchStats = async () => {
    try {
      const [usersRes, productsRes, categoriesRes, totalOrdersRes] =
        await Promise.all([
          axios.get("http://localhost:8080/user/all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8080/products/all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8080/category/get-all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8080/orders/all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

      setStats({
        totalUsers: usersRes.data.length,
        totalProducts: productsRes.data.length,
        totalCategories: categoriesRes.data.length,
        totalOrders: totalOrdersRes.data.length,
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const navigationCards = [
    {
      title: "User Management",
      description: "Manage users, view profiles, and handle user operations",
      icon: <People sx={{ fontSize: 40 }} />,
      color: "#1976d2",
      route: "users",
      count: stats.totalUsers,
    },
    {
      title: "Product Management",
      description: "Add, edit, and manage product inventory",
      icon: <Inventory sx={{ fontSize: 40 }} />,
      color: "#388e3c",
      route: "products",
      count: stats.totalProducts,
    },
    {
      title: "Category Management",
      description: "Organize products with categories",
      icon: <Category sx={{ fontSize: 40 }} />,
      color: "#f57c00",
      route: "categories",
      count: stats.totalCategories,
    },
    {
      title: "Order Management",
      description: "Track and manage customer orders",
      icon: <ShoppingCart sx={{ fontSize: 40 }} />,
      color: "#7b1fa2",
      route: "orders",
      count: stats.totalOrders,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Dashboard sx={{ mr: 2 }} />
          Admin Dashboard
        </Typography>
      </Box>

      {/* Admin Info */}
      {/* <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Admin Information
        </Typography>
        {admin ? (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography>
                <strong>Username:</strong> {admin.username}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography>
                <strong>Email:</strong> {admin.email}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography>
                <strong>Role:</strong> {admin.role || "Admin"}
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <Typography>Loading admin details...</Typography>
        )}
      </Paper> */}

      {/* Navigation Cards */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Management Sections
      </Typography>

      <Grid container spacing={3}>
        {navigationCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.route}>
            <Paper
              sx={{
                p: 3,
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                flexDirection: "column",
                height: 300,
                border: `2px solid ${card.color}20`,
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
              onClick={() => navigate(`/admin/${card.route}`)}
            >
              <Box sx={{ flexGrow: 1, textAlign: "center", mb: 2 }}>
                <Box sx={{ color: card.color, mb: 1 }}>{card.icon}</Box>
                <Typography variant="h6" gutterBottom>
                  {card.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {card.description}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ color: card.color, fontWeight: "bold" }}
                >
                  {card.count}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: card.color,
                  "&:hover": {
                    backgroundColor: card.color,
                    filter: "brightness(0.9)",
                  },
                }}
              >
                Manage
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate("/admin/users")}
              startIcon={<People />}
            >
              Add New User
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate("/admin/products")}
              startIcon={<Inventory />}
            >
              Add New Product
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate("/admin/categories")}
              startIcon={<Category />}
            >
              Add Category
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate("/admin/orders")}
              startIcon={<ShoppingCart />}
            >
              View Orders
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
