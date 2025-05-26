import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import { Button, Typography, Container } from "@mui/material";
import axios from "axios";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { orderId, amount } = location.state || {};

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const res = await axios.post(
        "http://localhost:8080/payments/process",
        {
          orderId,
          amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.paymentStatus === "SUCCESS") {
        await axios.patch(
          `http://localhost:8080/orders/${orderId}/status?status=CONFIRMED`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        navigate("/payment-result", {
          state: {
            paymentStatus: "success", // or "fail"
            orderId: orderId,
            amount: amount,
            message: "Your payment was processed successfully!",
          },
        });
      } else {
        navigate("/payment-result", {
          state: {
            paymentStatus: "fail",
            orderId: orderId,
            amount: amount,
            message: "Payment failed due to insufficient funds.",
          },
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      navigate("/payment-failed");
    }
  };

  return (
    <Container sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h5">Proceed to Payment</Typography>
      <Typography sx={{ mt: 2 }}>Amount: ₹{amount?.toFixed(2)}</Typography>
      <Button variant="contained" sx={{ mt: 3 }} onClick={handlePayment}>
        Pay Now
      </Button>
    </Container>
  );
};

export default PaymentPage;
