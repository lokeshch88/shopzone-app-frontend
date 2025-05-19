import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('http://localhost:8080/user/all',
        {
             headers: {
    Authorization: `Bearer ${token}`,
  },
        }
    )
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/user/${id}`
        ,
        {
             headers: {
    Authorization: `Bearer ${token}`,
  },
        }
    )
      .then(() => {
        alert('User deleted successfully');
        fetchUsers();
      })
      .catch(error => {
        alert('Failed to delete user');
        console.error(error);
      });
  };

  const handleUpdate = (user) => {
    alert(`Update logic goes here for user: ${user.username}`);
  };

  return (
    <>
      <Container className="admin-container">
        <Typography variant="h4" gutterBottom className="admin-title">
          Admin Dashboard
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead className="admin-table-head">
              <TableRow>
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
                      color="primary"
                      className="admin-btn"
                      onClick={() => handleUpdate(user)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      className="admin-btn"
                      onClick={() => handleDelete(user.id)}
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
      </Container>

      {/* Embedded CSS */}
      <style>
        {`
          .admin-container {
            margin-top: 40px;
          }

          .admin-title {
            margin-bottom: 20px;
          }

          .admin-table-head {
            background-color: #f5f5f5;
          }

          .admin-btn {
            margin-right: 10px;
            margin-top: 5px;
            margin-bottom: 5px;
          }
        `}
      </style>
    </>
  );
};

export default AdminDashboard;
