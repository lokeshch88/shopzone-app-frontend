import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { ArrowBack, Search, Visibility } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const orderStatuses = [
    { value: "PENDING", label: "Pending", color: "warning" },
    { value: "CONFIRMED", label: "Confirmed", color: "info" },
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/orders/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const transformed = res.data.map((o, idx) => ({
        ...o,
        id: o.orderId || `temp-${idx}`,
      }));
      setOrders(transformed);
    } catch (err) {
      console.error("Error loading orders:", err);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(
        "http://localhost:8080/orders/",
        { orderId, status: newStatus, userId: 0 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Status updated");
      fetchOrders();
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const filtered = orders.filter((o) => {
    const matchText = searchTerm
      ? o.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.userId?.toString().includes(searchTerm)
      : true;
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchText && matchStatus;
  });

  const paginatedOrders = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => navigate("/admin-dashboard")} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4">Order Management</Typography>
      </Box>

      <Paper
        sx={{
          p: 2,
          mb: 3,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <TextField
          label="Search Order ID / User ID"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          InputProps={{ startAdornment: <Search sx={{ mr: 1 }} /> }}
          sx={{ flexGrow: 1, minWidth: 200 }}
        />
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            label="Status Filter"
          >
            <MenuItem value="all">All</MenuItem>
            {orderStatuses.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#eee" }}>
              <TableCell>
                <strong>Order ID</strong>
              </TableCell>
              <TableCell>
                <strong>User ID</strong>
              </TableCell>
              <TableCell>
                <strong>Total Amount</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Product Count</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedOrders.map((o) => (
              <TableRow key={o.id} hover>
                <TableCell>{o.orderId || o.id}</TableCell>
                <TableCell>{o.userId}</TableCell>
                <TableCell>₹{o.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={o.status}
                    color={
                      orderStatuses.find((s) => s.value === o.status)?.color ||
                      "default"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {Array.isArray(o.items) ? o.items.length : 0}
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Visibility />}
                    onClick={() => {
                      setSelectedOrder(o);
                      setDialogOpen(true);
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {paginatedOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[]}
        />
      </TableContainer>

      <Dialog
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Order Details - {selectedOrder?.orderId || selectedOrder?.id}
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ mt: 2 }}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography>
                        <strong>User ID:</strong> {selectedOrder.userId}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography>
                        <strong>Total:</strong> ₹
                        {selectedOrder.totalAmount.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography>
                        <strong>Products Count:</strong>{" "}
                        {selectedOrder.items?.length || 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography>
                        <strong>Status:</strong> {selectedOrder.status}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={selectedOrder.status}
                      onChange={(e) => {
                        if (
                          window.confirm(`Change status to ${e.target.value}?`)
                        ) {
                          updateOrderStatus(selectedOrder.id, e.target.value);
                        }
                      }}
                    >
                      {orderStatuses.map((s) => (
                        <MenuItem key={s.value} value={s.value}>
                          {s.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>

              {/* Items table */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Ordered Items
                  </Typography>
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Product ID</TableCell>
                            <TableCell>Size</TableCell>
                            <TableCell>Color</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Quantity</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedOrder.items.map((item, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{idx + 1}</TableCell>
                              <TableCell>{item.productId}</TableCell>
                              <TableCell>{item.size || "-"}</TableCell>
                              <TableCell>{item.color || "-"}</TableCell>
                              <TableCell>
                                ₹
                                {item.price !== null && item.price !== undefined
                                  ? item.price
                                  : "-"}
                              </TableCell>
                              <TableCell>{item.quantity}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography>No item details available</Typography>
                  )}
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrderManagement;
