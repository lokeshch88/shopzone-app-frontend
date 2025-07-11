import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Divider,
  Card,
  CardContent,
  TextField,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const CheckoutSummaryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("authToken");

  const { userId, items = [], itemCount = 0 } = location.state || {};

  const [cartItems, setCartItems] = useState(items);
  const [totalAmount, setTotalAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [deliveryFee] = useState(50);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // 📌 Calculate total on cartItems change
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const total = cartItems.reduce((sum, item) => {
        const price = item.price || item.variant?.price || 0;
        return sum + price * item.quantity;
      }, 0);
      setTotalAmount(total);
      setFinalAmount(total + deliveryFee - discount);
    }
  }, [cartItems, discount, deliveryFee]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/address/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAddresses(res.data || []);
        if (res.data?.length > 0) {
          setSelectedAddress(res.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch addresses", error);
      }
    };

    fetchAddresses();
  }, [userId, token]);

  useEffect(() => {
    if (selectedAddress?.id) {
      const fetchEstimatedDeliveryDate = async () => {
        try {
          const res = await axios.get(
            `http://localhost:8080/checkout/delivery/estimate/${selectedAddress.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (res.data?.estimatedDate) {
            setDeliveryDate(new Date(res.data.estimatedDate).toDateString());
          }
        } catch (err) {
          console.error("Failed to fetch delivery estimate:", err);
          setDeliveryDate("Unavailable");
        }
      };

      fetchEstimatedDeliveryDate();
    }
  }, [selectedAddress, token]);

  const formatAddress = (addr) => {
    return [
      addr.addressLine,
      addr.city,
      addr.district,
      addr.state,
      addr.country,
      addr.pincode ? `Pincode: ${addr.pincode}` : "",
    ]
      .filter(Boolean)
      .join(", ");
  };

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "SAVE50") {
      const newDiscount = 50;
      setDiscount(newDiscount);
      setFinalAmount(totalAmount + deliveryFee - newDiscount);
    } else {
      alert("Invalid coupon code");
      setDiscount(0);
      setFinalAmount(totalAmount + deliveryFee);
    }
  };

  const handleProceed = () => {
    axios
      .post(
        `http://localhost:8080/orders/user/${userId}`,
        {
          items: cartItems,
          totalAmount,
          addressId: selectedAddress?.id || null, // send selected address ID
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
          // localStorage.removeItem("cart");
          // setCartItems([]);
          navigate("/proceed-payment", {
            state: {
              orderId,
              amount: finalAmount,
              coupon,
              discount,
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

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        Checkout Summary
      </Typography>

      {/* Address Card */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Select Delivery Address
          </Typography>

          <Box
            sx={{
              overflowX: "auto",
              whiteSpace: "nowrap",
              display: "flex",
              gap: 2,
              pb: 5,
            }}
          >
            {addresses.map((addr, index) => (
              <Box
                key={index}
                component="label"
                sx={{
                  display: "inline-block",
                  minWidth: 180,
                  maxWidth: 180,
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="selectedAddress"
                  value={index}
                  checked={selectedAddressIndex === index}
                  onChange={() => {
                    setSelectedAddressIndex(index);
                    setSelectedAddress(addresses[index]);
                  }}
                  style={{ display: "none" }}
                />
                <Card
                  variant="outlined"
                  sx={{
                    p: 1,
                    backgroundColor:
                      selectedAddressIndex === index ? "#e3f2fd" : "#fff",
                    border:
                      selectedAddressIndex === index
                        ? "2px solid #1976d2"
                        : "1px solid #ccc",
                    transition: "all 0.3s",
                    height: "100%",
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold">
                    Address {index + 1}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {formatAddress(addr)}
                  </Typography>
                </Card>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {selectedAddress && (
        <Typography color="text.secondary" sx={{ mt: 1, ml: 1, pb: 2 }}>
          Estimated Delivery:{" "}
          <Box component="span" sx={{ color: "primary.main", fontWeight: 500 }}>
            {deliveryDate}
          </Box>
        </Typography>
      )}

      {/* Coupon Card */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">Apply Coupon</Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
              mt: 2,
            }}
          >
            <TextField
              size="small"
              label="Coupon Code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={applyCoupon}
              disabled={!coupon.trim()}
            >
              Apply
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          <Typography sx={{ mb: 2 }}>Status: Pending</Typography>

          {cartItems.map((item, index) => {
            const price = item.price || item.variant?.price || 0;
            return (
              <Box
                key={index}
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>
                  Product #{item.productId || item.id} × {item.quantity}
                </Typography>
                <Typography>₹{(price * item.quantity).toFixed(2)}</Typography>
              </Box>
            );
          })}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>Total</Typography>
            <Typography>₹{totalAmount.toFixed(2)}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>Delivery Fee</Typography>
            <Typography>₹{deliveryFee}</Typography>
          </Box>

          {discount > 0 && (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Coupon Discount</Typography>
              <Typography color="green">− ₹{discount}</Typography>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Final Amount
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              ₹{finalAmount.toFixed(2)}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ textAlign: "right" }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleProceed}
        >
          Proceed to Payment
        </Button>
      </Box>
    </Container>
  );
};

export default CheckoutSummaryPage;
