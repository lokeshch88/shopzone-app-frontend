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
  Stepper,
  Step,
  StepLabel,
  ListItemButton,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// Define order status flow
const ORDER_FLOW = [
  "PLACED",
  "CONFIRMED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

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

  const currentStep = ORDER_FLOW.indexOf(order.status?.toUpperCase());

  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return "success";
      case "OUT_FOR_DELIVERY":
        return "info";
      case "SHIPPED":
        return "primary";
      case "CONFIRMED":
        return "warning";
      case "PLACED":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        ← Back
      </Button>

      {/* Order Status Stepper */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Order Progress
          </Typography>
          <Stepper activeStep={currentStep} alternativeLabel>
            {ORDER_FLOW.map((label) => (
              <Step key={label}>
                <StepLabel>{label.replace(/_/g, " ")}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">Order Details</Typography>
          <Typography>Order ID: {order.orderId}</Typography>
          <Typography>
            Date: {new Date(order.createdAt).toLocaleDateString()}
          </Typography>
          <Typography>Total: ₹{order.totalAmount}</Typography>
          <Typography>User ID: {order.userId}</Typography>
          <Chip
            label={order.status}
            color={getStatusColor(order.status)}
            sx={{ mt: 1 }}
          />
        </CardContent>
      </Card>

      {/* Order Items */}
      {order.items?.length > 0 ? (
        <List>
          {order.items.map((item, index) => (
            <ListItemButton
              key={index}
              divider
              onClick={() => navigate(`/product/${item.productId}`)}
            >
              <ListItemText
                primary={`Name: ${item.name}`}
                secondary={`Quantity: ${item.quantity}, Price: ₹${
                  item.price ?? "N/A"
                }, Size: ${item.size ?? "-"}, Color: ${item.color ?? "-"}`}
              />
            </ListItemButton>
          ))}
        </List>
      ) : (
        <Typography>No items found in this order.</Typography>
      )}
    </Box>
  );
};

export default OrderDetails;
