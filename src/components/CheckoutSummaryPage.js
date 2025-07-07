// CheckoutSummaryPage.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Box,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CheckoutSummaryPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [coupon, setCoupon] = useState("");
  const [giftCard, setGiftCard] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
    const userAddresses =
      JSON.parse(localStorage.getItem("userAddresses")) || [];
    setAddresses(userAddresses);

    const baseTotal = storedCart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalAmount(baseTotal);
    setFinalAmount(baseTotal + 50); // delivery fee default
  }, []);

  useEffect(() => {
    if (selectedAddress) {
      const date = new Date();
      date.setDate(date.getDate() + 4);
      setDeliveryDate(date.toDateString());
    }
  }, [selectedAddress]);

  const applyCoupon = () => {
    if (coupon === "SAVE50") {
      setFinalAmount((prev) => prev - 50);
    }
  };

  const handleProceed = () => {
    if (!selectedAddress) return alert("Please select a delivery address.");

    navigate("/proceed-payment", {
      state: {
        selectedAddress,
        finalAmount,
        coupon,
        giftCard,
      },
    });
  };
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  // const selectedAddress = addresses[selectedAddressIndex];
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
  return (
    <Container sx={{ py: 4 }}>
      {/* Title */}
      <Typography variant="h5" gutterBottom>
        Checkout Summary
      </Typography>

      {/* Address Section */}
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
              overflowY: "hidden", // Prevent vertical scroll
              flexDirection: "row",
              gap: 2,
              pb: 1,
            }}
          >
            {addresses.map((addr, index) => (
              <Box
                key={index}
                component="label"
                sx={{
                  display: "inline-block",
                  minWidth: 260,
                  maxWidth: 260,
                  height: "100%", // Ensures cards are uniform
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="selectedAddress"
                  value={index}
                  checked={selectedAddressIndex === index}
                  onChange={() => setSelectedAddressIndex(index)}
                  style={{ display: "none" }}
                />
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    p: 2,
                    backgroundColor:
                      selectedAddressIndex === index ? "#e3f2fd" : "#fff",
                    border:
                      selectedAddressIndex === index
                        ? "2px solid #1976d2"
                        : "1px solid #ccc",
                    transition: "all 0.3s",
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

      {/* Offers Section */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Apply Offers
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              alignItems: "center",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <TextField
              fullWidth
              size="small"
              label="Coupon Code"
              variant="outlined"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={applyCoupon}
              disabled={!coupon.trim()}
              sx={{ whiteSpace: "nowrap", height: "40px" }} // Aligns with TextField height
            >
              Apply Coupon
            </Button>
          </Box>

          {/* <TextField
            fullWidth
            label="Gift Card Code"
            variant="outlined"
            value={giftCard}
            onChange={(e) => setGiftCard(e.target.value)}
            sx={{ mt: 3 }}
          /> */}
        </CardContent>
      </Card>

      {/* Order Summary Section */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>

          {cartItems.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography>
                {item.name} × {item.quantity}
              </Typography>
              <Typography>₹{item.price * item.quantity}</Typography>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>Total</Typography>
            <Typography>₹{totalAmount}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>Delivery Fee</Typography>
            <Typography>₹50</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Final Amount
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              ₹{finalAmount}
            </Typography>
          </Box>

          {deliveryDate && (
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Estimated Delivery: {deliveryDate}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Proceed Button */}
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
