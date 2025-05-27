import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const PaymentResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { paymentStatus, orderId, amount, message } = location.state || {};

  if (!paymentStatus) {
    navigate("/");
    return null;
  }

  const isSuccess = paymentStatus === "success";

  return (
    <Container sx={{ py: 5, textAlign: "center" }}>
      <Box
        sx={{
          border: "1px solid",
          borderColor: isSuccess ? "green" : "red",
          p: 4,
          borderRadius: 2,
          maxWidth: 400,
          margin: "auto",
        }}
      >
        {isSuccess ? (
          <CheckCircleIcon sx={{ fontSize: 80, color: "green", mb: 2 }} />
        ) : (
          <CancelIcon sx={{ fontSize: 80, color: "red", mb: 2 }} />
        )}

        <Typography
          variant="h4"
          gutterBottom
          color={isSuccess ? "green" : "error"}
        >
          {isSuccess ? "Payment Successful!" : "Payment Failed"}
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          {message ||
            (isSuccess
              ? "Thank you for your payment."
              : "Unfortunately, your payment did not go through.")}
        </Typography>

        {orderId && (
          <>
            <Typography variant="subtitle1">Order ID: {orderId}</Typography>
            <Typography variant="subtitle1">
              Amount Paid: ₹{amount?.toFixed(2)}
            </Typography>
          </>
        )}

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default PaymentResultPage;
