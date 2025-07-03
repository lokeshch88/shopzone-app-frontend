import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
    duration: 1500,
  });

  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId"); // Assume this is set after login

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/products/all")
      .then((response) => setProducts(response.data.result))
      .catch((error) => {
        console.error("Error loading products:", error);
        setSnackbar({
          open: true,
          message: "Failed to load products.",
          severity: "error",
        });
      });
  }, []);

  const handleAddToCart = (product) => {
    try {
      const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingIndex = existingCart.findIndex(
        (item) => item.id === product.id
      );

      let updatedCart;
      if (existingIndex > -1) {
        // Product already in cart, increment quantity
        updatedCart = existingCart.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // New product
        updatedCart = [...existingCart, { ...product, quantity: 1 }];
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));

      setSnackbar({
        open: true,
        message: "Added to cart!",
        severity: "success",
        duration: 1000,
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      setSnackbar({
        open: true,
        message: "Unable to add to cart. Please try again.",
        severity: "error",
      });
    }
  };

  const handleBuy = async (productId) => {
    try {
      await axios.post(
        `http://localhost:8080/orders/user/2`, // userId as path variable
        {
          productIds: [productId], // or multiple product IDs like [1, 2, 3]
          totalAmount: 500, // calculate dynamically as needed
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSnackbar({
        open: true,
        message: "Product purchased successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Buy failed:", error);
      setSnackbar({
        open: true,
        message: "Purchase failed. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Featured Products
      </Typography>
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardMedia
                component="img"
                image={product.image || "https://via.placeholder.com/300"}
                alt={product.name}
                height="180"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {product.name}
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="body2"
                  sx={{ maxWidth: 200 }}
                >
                  {product.description}
                </Typography>
                <Typography variant="subtitle1" color="primary" sx={{ mt: 1 }}>
                  ₹{product.price}
                </Typography>
              </CardContent>
              <CardActions>
                {/* <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleBuy(product.id)}
                >
                  Buy
                </Button> */}
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {products.length === 0 && (
          <Typography textAlign="center" sx={{ width: "100%", mt: 5 }}>
            No products found.
          </Typography>
        )}
      </Grid>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HomePage;
