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

  const updateCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const getItemKey = (item) =>
    `${item.id}_${item.variant?.size || ""}_${item.variant?.color || ""}`;

  const incrementQty = (itemKey) => {
    const updated = cartItems.map((item) =>
      getItemKey(item) === itemKey
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    updateCart(updated);
  };

  const decrementQty = (itemKey) => {
    const updated = cartItems
      .map((item) =>
        getItemKey(item) === itemKey
          ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
          : item
      )
      .filter((item) => item.quantity > 0);
    updateCart(updated);
  };

  const removeFromCart = (itemKey) => {
    const updated = cartItems.filter((item) => getItemKey(item) !== itemKey);
    updateCart(updated);
  };

  const totalAmount = cartItems
    .reduce(
      (sum, item) =>
        sum + (item.variant?.price || item.price || 0) * (item.quantity || 1),
      0
    )
    .toFixed(2);

  const handleCheckout = () => {
    if (!userId) {
      setSnackbar({
        open: true,
        message: "Login to place order!",
        severity: "error",
      });
      return;
    }

    const items = cartItems.map((item) => ({
      productId: item.id,
      size: item.variant?.size || null,
      color: item.variant?.color || null,
      quantity: item.quantity,
      price: item.variant?.price || item.price,
    }));

    axios
      .post(
        `http://localhost:8080/orders/user/${userId}`,
        {
          items,
          totalAmount: parseFloat(totalAmount),
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
          navigate("/order/checkout", {
            state: {
              orderId,
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
            {cartItems.map((item) => {
              const itemKey = getItemKey(item);
              const price = item.variant?.price || item.price || 0;

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={itemKey}>
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
                      <Typography variant="h6">{item.name}</Typography>
                      {item.variant?.size && (
                        <Typography variant="body2">
                          Size: {item.variant.size}
                        </Typography>
                      )}
                      {item.variant?.color && (
                        <Typography variant="body2">
                          Color: {item.variant.color}
                        </Typography>
                      )}
                      <Typography
                        variant="subtitle1"
                        color="primary"
                        sx={{ mt: 1 }}
                      >
                        ₹{price} × {item.quantity} = ₹
                        {(price * item.quantity).toFixed(2)}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        onClick={() => decrementQty(itemKey)}
                      >
                        -
                      </Button>
                      <Typography>{item.quantity}</Typography>
                      <Button
                        size="small"
                        onClick={() => incrementQty(itemKey)}
                      >
                        +
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => removeFromCart(itemKey)}
                      >
                        Remove
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
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
