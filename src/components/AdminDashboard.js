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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [admin, setAdmin] = useState(null);

  const [searchUser, setSearchUser] = useState("");
  const [searchProduct, setSearchProduct] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isUserDialogOpen, setUserDialogOpen] = useState(false);
  const [isProductDialogOpen, setProductDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("view"); // "add", "update", "view"

  const token = localStorage.getItem("authToken");

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (isProductDialogOpen) {
      axios
        .get("http://localhost:8080/categories", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setCategories(response.data); // assuming response.data is an array
        })
        .catch((err) => {
          console.error("Failed to fetch categories", err);
        });
    }
  }, [isProductDialogOpen]);

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
      .catch((err) => console.error("Failed to load admin info:", err));
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
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmed) {
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
    }
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
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Admin Details
        </Typography>
        {admin ? (
          <>
            <Typography>
              <strong>Username:</strong> {admin.username}
            </Typography>
            <Typography>
              <strong>Email:</strong> {admin.email}
            </Typography>
            <Typography gutterBottom>
              <strong>Role:</strong> {admin.role || "Admin"}
            </Typography>
          </>
        ) : (
          <Typography>Loading admin details...</Typography>
        )}
      </Paper>

      {/* USER MANAGEMENT */}
      <Typography variant="h5">Users</Typography>
      <TextField
        fullWidth
        label="Search Users"
        value={searchUser}
        onChange={(e) => setSearchUser(e.target.value)}
        sx={{ my: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setDialogMode("add");
          setSelectedUser({ username: "", email: "" });
          setUserDialogOpen(true);
        }}
        sx={{ mb: 2 }}
      >
        Add User
      </Button>
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
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button
                    color="info"
                    onClick={() => {
                      setDialogMode("view");
                      setSelectedUser(user);
                      setUserDialogOpen(true);
                    }}
                    sx={{ mr: 1 }}
                  >
                    View
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                      setDialogMode("update");
                      setSelectedUser(user);
                      setUserDialogOpen(true);
                    }}
                    sx={{ mr: 1 }}
                  >
                    Update
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PRODUCT MANAGEMENT */}
      <Typography variant="h5">Products</Typography>
      <TextField
        fullWidth
        label="Search Products"
        value={searchProduct}
        onChange={(e) => setSearchProduct(e.target.value)}
        sx={{ my: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setDialogMode("add");
          setSelectedProduct({ name: "", price: "", description: "" });
          setProductDialogOpen(true);
        }}
        sx={{ mb: 2 }}
      >
        Add Product
      </Button>
      <TableContainer component={Paper}>
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
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>₹{product.price}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>
                  <Button
                    color="info"
                    onClick={() => {
                      setDialogMode("view");
                      setSelectedProduct(product);
                      setProductDialogOpen(true);
                    }}
                    sx={{ mr: 1 }}
                  >
                    View
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                      setDialogMode("update");
                      setSelectedProduct(product);
                      setProductDialogOpen(true);
                    }}
                    sx={{ mr: 1 }}
                  >
                    Update
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* USER DIALOG */}
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
            value={selectedUser?.username || ""}
            disabled={dialogMode === "view"}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, username: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={selectedUser?.email || ""}
            disabled={dialogMode === "view"}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, email: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialogOpen(false)}>Cancel</Button>
          {(dialogMode === "add" || dialogMode === "update") && (
            <Button
              onClick={() => {
                if (!selectedUser.username || !selectedUser.email) {
                  alert("Please fill all fields");
                  return;
                }
                if (dialogMode === "add") {
                  axios
                    .post("http://localhost:8080/user", selectedUser, {
                      headers: { Authorization: `Bearer ${token}` },
                    })
                    .then(() => {
                      alert("User added successfully");
                      setUserDialogOpen(false);
                      fetchUsers();
                    })
                    .catch((err) => {
                      alert("Failed to add user");
                      console.error(err);
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
                      alert("User updated successfully");
                      setUserDialogOpen(false);
                      fetchUsers();
                    })
                    .catch((err) => {
                      alert("Failed to update user");
                      console.error(err);
                    });
                }
              }}
            >
              {dialogMode === "add" ? "Add" : "Update"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* PRODUCT DIALOG */}
      <Dialog
        open={isProductDialogOpen}
        onClose={() => setProductDialogOpen(false)}
        fullWidth
      >
        <DialogTitle>
          {dialogMode === "add"
            ? "Add Product"
            : dialogMode === "update"
            ? "Update Product"
            : "Product Details"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={selectedProduct?.name || ""}
            disabled={dialogMode === "view"}
            onChange={(e) =>
              setSelectedProduct({ ...selectedProduct, name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={selectedProduct?.price || ""}
            disabled={dialogMode === "view"}
            onChange={(e) =>
              setSelectedProduct({ ...selectedProduct, price: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={selectedProduct?.description || ""}
            disabled={dialogMode === "view"}
            onChange={(e) =>
              setSelectedProduct({
                ...selectedProduct,
                description: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            value={selectedProduct?.quantityInStock || ""}
            disabled={dialogMode === "view"}
            onChange={(e) =>
              setSelectedProduct({
                ...selectedProduct,
                quantityInStock: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Brand"
            fullWidth
            value={selectedProduct?.brand || ""}
            disabled={dialogMode === "view"}
            onChange={(e) =>
              setSelectedProduct({ ...selectedProduct, brand: e.target.value })
            }
          />
          {/* <TextField
            margin="dense"
            label="Category"
            fullWidth
            value={selectedProduct?.category || ""}
            disabled={dialogMode === "view"}
            onChange={(e) =>
              setSelectedProduct({
                ...selectedProduct,
                category: e.target.value,
              })
            }
          /> */}
          <FormControl margin="dense" fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedProduct?.category || ""}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  category: e.target.value,
                })
              }
              disabled={dialogMode === "view"}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.name}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            label="SKU"
            fullWidth
            value={selectedProduct?.sku || ""}
            disabled={dialogMode === "view"}
            onChange={(e) =>
              setSelectedProduct({ ...selectedProduct, sku: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="MRP"
            fullWidth
            value={selectedProduct?.mrp || ""}
            disabled={dialogMode === "view"}
            onChange={(e) =>
              setSelectedProduct({ ...selectedProduct, mrp: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Active"
            fullWidth
            value={selectedProduct?.isActive || ""}
            disabled={dialogMode === "view"}
            onChange={(e) =>
              setSelectedProduct({
                ...selectedProduct,
                isActive: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductDialogOpen(false)}>Cancel</Button>
          {(dialogMode === "add" || dialogMode === "update") && (
            <Button
              onClick={() => {
                if (!selectedProduct.name || !selectedProduct.price) {
                  alert("Please fill all required fields");
                  return;
                }
                if (dialogMode === "add") {
                  axios
                    .post(
                      "http://localhost:8080/products/create",
                      selectedProduct,
                      {
                        headers: { Authorization: `Bearer ${token}` },
                      }
                    )
                    .then(() => {
                      alert("Product added successfully");
                      setProductDialogOpen(false);
                      fetchProducts();
                    })
                    .catch((err) => {
                      alert("Failed to add product");
                      console.error(err);
                    });
                } else if (dialogMode === "update") {
                  axios
                    .patch(
                      `http://localhost:8080/products/${selectedProduct.id}`,
                      selectedProduct,
                      {
                        headers: { Authorization: `Bearer ${token}` },
                      }
                    )
                    .then(() => {
                      alert("Product updated successfully");
                      setProductDialogOpen(false);
                      fetchProducts();
                    })
                    .catch((err) => {
                      alert("Failed to update product");
                      console.error(err);
                    });
                }
              }}
            >
              {dialogMode === "add" ? "Add" : "Update"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
