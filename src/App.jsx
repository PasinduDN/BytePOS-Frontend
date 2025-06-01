import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
// import Login from './components/Login.jsx';
// import Dashboard from './components/Dashboard.jsx';
// import Checkout from './components/Checkout.jsx';
// import ProductManagement from './components/ProductManagement.jsx';
// import Reports from './components/Reports.jsx';
// import AdminPanel from './components/AdminPanel.jsx';

import Login from '../src/components/Login'
import Dashboard from '../src/components/Dashboard'
import Checkout from '../src/components/Checkout'
import ProductManagement from '../src/components/ProductManagement'
import Reports from '../src/components/Reports'
import AdminPanel from '../src/components/AdminPanel'

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} setRole={setRole} />} />
        <Route path="/dashboard" element={token ? <Dashboard role={role} /> : <Navigate to="/login" />} />
        <Route path="/checkout" element={token && (role === 'cashier' || role === 'manager' || role === 'admin') ? <Checkout /> : <Navigate to="/login" />} />
        <Route path="/products" element={token && (role === 'manager' || role === 'admin') ? <ProductManagement /> : <Navigate to="/login" />} />
        <Route path="/reports" element={token && (role === 'manager' || role === 'admin') ? <Reports /> : <Navigate to="/login" />} />
        <Route path="/admin" element={token && role === 'admin' ? <AdminPanel /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;