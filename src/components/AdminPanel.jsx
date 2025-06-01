import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: '', storeId: 1 });

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    await axios.post('/api/auth/register', newUser, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setNewUser({ username: '', password: '', role: '', storeId: 1 });
    fetchUsers();
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          sx={{ mr: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          sx={{ mr: 2 }}
        />
        <TextField
          select
          label="Role"
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          SelectProps={{ native: true }}
          sx={{ mr: 2 }}
        >
          <option value="cashier">Cashier</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </TextField>
        <TextField
          label="Store ID"
          type="number"
          value={newUser.storeId}
          onChange={(e) => setNewUser({ ...newUser, storeId: parseInt(e.target.value) })}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" onClick={handleAddUser}>
          Add User
        </Button>
      </Box>
      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Store ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.storeId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}

export default AdminPanel;