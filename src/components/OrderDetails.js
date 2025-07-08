// src/pages/OrderDetails.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token]);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Order not found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        ← Back
      </Button>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">Order Details</Typography>
          <Typography>Order ID: {order.orderId}</Typography>
          <Typography>
            Date: {new Date(order.createdAt).toLocaleDateString()}
          </Typography>
          <Typography>Total: ₹{order.totalAmount}</Typography>
          <Typography>User ID: {order.userId}</Typography>
          <Chip label={order.status} sx={{ mt: 1 }} />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6">Ordered Items</Typography>
          {order.items?.length > 0 ? (
            <List>
              {order.items.map((item, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={`Product ID: ${item.productId}`}
                    secondary={`Quantity: ${item.quantity}, Price: ₹${
                      item.price ?? "N/A"
                    }, Size: ${item.size ?? "-"}, Color: ${item.color ?? "-"}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No items found in this order.</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderDetails;
