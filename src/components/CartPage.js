import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Snackbar,
  CardMedia,
  Alert,
} from "@mui/material";
import axios from "axios";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);
  const totalAmount = parseFloat(
    cartItems
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2)
  );

  const productIds = cartItems.flatMap((item) =>
    Array(item.quantity).fill(item.id)
  ); // If backend expects repeated IDs

  const updateCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const incrementQty = (productId) => {
    const updated = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updated);
  };

  const decrementQty = (productId) => {
    const updated = cartItems
      .map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
          : item
      )
      .filter((item) => item.quantity > 0);
    updateCart(updated);
  };

  const removeFromCart = (productId) => {
    const updated = cartItems.filter((item) => item.id !== productId);
    updateCart(updated);
  };

  const handleCheckout = () => {
    if (userId === null) {
      setSnackbar({
        open: true,
        message: "Login to place order!",
        severity: "error",
      });
      return;
    }
    axios
      .post(
        `http://localhost:8080/orders/user/${userId}`,
        {
          productIds,
          totalAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const { status, message, orderId } = response.data;

        if (status === 200 || orderId != null) {
          localStorage.removeItem("cart");
          setCartItems([]);

          // setSnackbar({
          //   open: true,
          //   message: message || "Order placed successfully!",
          //   severity: "success",
          // });

          // 👇 Pass orderId and amount to payment page via state
          navigate("/order/checkout", {
            state: {
              orderId: orderId,
              amount: totalAmount,
            },
          });
        } else {
          setSnackbar({
            open: true,
            message: message || "Order failed. Please try again.",
            severity: "error",
          });
        }
      })
      .catch((error) => {
        console.error("Checkout error:", error);

        setSnackbar({
          open: true,
          message: "Something went wrong. Please try again later.",
          severity: "error",
        });
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Typography>No items in cart.</Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {cartItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={item.image || "https://via.placeholder.com/300"}
                    alt={item.name}
                    height="180"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      {item.description}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      sx={{ mt: 1 }}
                    >
                      ₹{item.price} × {item.quantity} = ₹
                      {item.price * item.quantity}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => decrementQty(item.id)}>
                      -
                    </Button>
                    <Typography>{item.quantity}</Typography>
                    <Button size="small" onClick={() => incrementQty(item.id)}>
                      +
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography variant="h6" sx={{ mt: 3 }}>
            Total: ₹{totalAmount}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleCheckout}
          >
            Checkout
          </Button>
        </>
      )}

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

export default CartPage;
