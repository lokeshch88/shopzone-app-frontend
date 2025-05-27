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
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
} from "@mui/material";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  const token = localStorage.getItem("authToken");
  const [admin, setAdmin] = useState(null);

  const [searchUser, setSearchUser] = useState("");
  const [searchProduct, setSearchProduct] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isUserDialogOpen, setUserDialogOpen] = useState(false);
  const [isProductDialogOpen, setProductDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("view"); // "add" | "update" | "view"

  useEffect(() => {
    fetchUsers();
    fetchProducts();
    fetchAdminDetails();
  }, []);

  const fetchAdminDetails = () => {
    axios
      .get("http://localhost:8080/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAdmin(res.data))
      .catch((err) => {
        console.error("Failed to load admin info:", err);
      });
  };

  const fetchUsers = () => {
    axios
      .get("http://localhost:8080/user/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("User fetch error:", err));
  };

  const fetchProducts = () => {
    axios
      .get("http://localhost:8080/products/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Product fetch error:", err));
  };

  const handleDeleteUser = (id) => {
    axios
      .delete(`http://localhost:8080/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("User deleted");
        fetchUsers();
      })
      .catch((err) => {
        alert("Failed to delete user");
        console.error(err);
      });
  };

  const handleDeleteProduct = (id) => {
    axios
      .delete(`http://localhost:8080/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Product deleted");
        fetchProducts();
      })
      .catch((err) => {
        alert("Failed to delete product");
        console.error(err);
      });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  return (
    <Container className="admin-container">
      <Dialog
        open={isUserDialogOpen}
        onClose={() => setUserDialogOpen(false)}
        fullWidth
      >
        <DialogTitle>
          {dialogMode === "add"
            ? "Add User"
            : dialogMode === "update"
            ? "Update User"
            : "User Details"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Username"
            fullWidth
            disabled={dialogMode === "view"}
            value={selectedUser?.username || ""}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, username: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            disabled={dialogMode === "view"}
            value={selectedUser?.email || ""}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, email: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialogOpen(false)}>Cancel</Button>
          {dialogMode !== "view" && (
            <Button
              onClick={() => {
                if (dialogMode === "add") {
                  axios
                    .post("http://localhost:8080/user", selectedUser, {
                      headers: { Authorization: `Bearer ${token}` },
                    })
                    .then(() => {
                      fetchUsers();
                      setUserDialogOpen(false);
                    });
                } else if (dialogMode === "update") {
                  axios
                    .put(
                      `http://localhost:8080/user/${selectedUser.id}`,
                      selectedUser,
                      {
                        headers: { Authorization: `Bearer ${token}` },
                      }
                    )
                    .then(() => {
                      fetchUsers();
                      setUserDialogOpen(false);
                    });
                }
              }}
            >
              {dialogMode === "add" ? "Add" : "Update"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
      ;{/* Admin Task Summary */}
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Admin Details
        </Typography>

        {admin ? (
          <>
            <Typography variant="body1">
              <strong>Username:</strong> {admin.username}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {admin.email}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Role:</strong> {admin.role || "Admin"}
            </Typography>

            {/* <Typography variant="h6" sx={{ mt: 2 }}>
              Admin Tasks
            </Typography> */}
            <ul>
              {/* <li>Manage users (Update/Delete)</li> */}
              {/* <li>Manage products (Update/Delete)</li> */}
              {/* <li>Monitor purchase activity</li> */}
              {/* <li>Maintain system roles and security</li> */}
            </ul>
          </>
        ) : (
          <Typography>Loading admin details...</Typography>
        )}
      </Paper>
      <TextField
        label="Search Users"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchUser}
        onChange={(e) => setSearchUser(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setDialogMode("add");
          setSelectedUser(null);
          setUserDialogOpen(true);
        }}
        sx={{ mb: 2 }}
      >
        Add User
      </Button>
      {/* User Management Section */}
      <Typography variant="h5" gutterBottom>
        Users
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="info"
                    sx={{ mr: 1 }}
                    onClick={() => {
                      setDialogMode("view");
                      setSelectedUser(user);
                      setUserDialogOpen(true);
                    }}
                  >
                    View
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={() => {
                      setDialogMode("update");
                      setSelectedUser(user);
                      setUserDialogOpen(true);
                    }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TextField
        label="Search Products"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchProduct}
        onChange={(e) => setSearchProduct(e.target.value)}
      />
      {/* Product Management Section */}
      <Typography variant="h5" gutterBottom>
        Products
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>₹{product.price}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 1, mb: 1 }}
                    onClick={() => alert(`Update logic for ${product.name}`)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminDashboard;
