import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8080/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch product", error);
        setSnackbar({
          open: true,
          message: "Failed to load product details.",
          severity: "error",
        });
      });
  }, [id]);

  const handleAddToCart = () => {
    try {
      const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
      const index = existingCart.findIndex((item) => item.id === product.id);

      let updatedCart;
      if (index > -1) {
        updatedCart = existingCart.map((item, i) =>
          i === index ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedCart = [...existingCart, { ...product, quantity: 1 }];
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setSnackbar({
        open: true,
        message: "Added to cart!",
        severity: "success",
      });
    } catch (error) {
      console.error("Add to cart failed:", error);
      setSnackbar({
        open: true,
        message: "Failed to add to cart.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (!product) {
    return (
      <Container sx={{ py: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 5 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <img
            src={product.image || "https://via.placeholder.com/500"}
            alt={product.name}
            style={{ width: "100%", borderRadius: 8 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            ₹{product.price.toFixed(2)}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {product.description}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
          <Button variant="outlined" onClick={() => navigate("/cart")}>
            Go to Cart
          </Button>
        </Grid>
      </Grid>

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

export default ProductPage;
