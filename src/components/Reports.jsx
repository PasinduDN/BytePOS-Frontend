import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

function Reports() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      const response = await axios.get('/api/reports/sales', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSales(response.data);
    };
    fetchSales();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Sales Report
      </Typography>
      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product ID</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{sale.productId}</TableCell>
                <TableCell>{sale.quantity}</TableCell>
                <TableCell>${sale.totalPrice}</TableCell>
                <TableCell>{sale.paymentMethod}</TableCell>
                <TableCell>{sale.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}

export default Reports;