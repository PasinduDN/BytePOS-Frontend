import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Grid, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard({ role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            POS System
          </Typography>
          {role === 'cashier' && <Button color="inherit" component={Link} to="/checkout">Checkout</Button>}
          {(role === 'manager' || role === 'admin') && (
            <>
              <Button color="inherit" component={Link} to="/checkout">Checkout</Button>
              <Button color="inherit" component={Link} to="/products">Products</Button>
              <Button color="inherit" component={Link} to="/reports">Reports</Button>
            </>
          )}
          {role === 'admin' && <Button color="inherit" component={Link} to="/admin">Admin Panel</Button>}
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to the POS System
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Total Sales Today</Typography>
              <Typography variant="h4">$500</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Low Stock Items</Typography>
              <Typography variant="h4">10</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Customers</Typography>
              <Typography variant="h4">25</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default Dashboard;