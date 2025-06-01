import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import JsBarcode from 'jsbarcode';
import html2pdf from 'html2pdf.js';

const stripePromise = loadStripe('your_stripe_publishable_key');

function Checkout() {
  const [barcode, setBarcode] = useState('');
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashTendered, setCashTendered] = useState(0);
  const [customerId, setCustomerId] = useState(null);

  const handleScan = async () => {
    try {
      const response = await axios.get(`/api/products/barcode/${barcode}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const product = response.data;
      setCart([...cart, { ...product, quantity: 1 }]);
      setBarcode('');
    } catch (error) {
      alert('Product not found');
    }
  };

  const handlePayment = async () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (paymentMethod === 'card') {
      const stripe = await stripePromise;
      const { paymentMethod: stripePaymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: { token: 'tok_visa' }, // Replace with actual card element
      });

      try {
        for (const item of cart) {
          await axios.post('/api/sales', {
            productId: item.id,
            quantity: item.quantity,
            paymentMethod,
            stripePaymentMethodId: stripePaymentMethod.id,
            customerId
          }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        }
        generateReceipt();
        setCart([]);
      } catch (error) {
        alert('Payment failed');
      }
    } else {
      if (cashTendered < total) {
        alert('Insufficient cash');
        return;
      }
      for (const item of cart) {
        await axios.post('/api/sales', {
          productId: item.id,
          quantity: item.quantity,
          paymentMethod,
          customerId
        }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      }
      generateReceipt();
      setCart([]);
    }
  };

  const generateReceipt = () => {
    const receiptContent = `
      <div style="font-family: Arial; padding: 20px;">
        <h2>POS System Receipt</h2>
        <p>Date: ${new Date().toLocaleString()}</p>
        <h3>Items:</h3>
        <ul>
          ${cart.map(item => `<li>${item.name} - ${item.quantity} x $${item.price} = $${item.quantity * item.price}</li>`).join('')}
        </ul>
        <p>Total: $${cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}</p>
      </div>
    `;
    html2pdf().from(receiptContent).save('receipt.pdf');
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Scan Barcode"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleScan()}
        />
        <Button variant="contained" onClick={handleScan} sx={{ ml: 2 }}>
          Add Item
        </Button>
      </Box>
      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const newCart = [...cart];
                      newCart[index].quantity = parseInt(e.target.value) || 1;
                      setCart(newCart);
                    }}
                  />
                </TableCell>
                <TableCell>${item.price}</TableCell>
                <TableCell>${item.price * item.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">
          Total: ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
        </Typography>
        <TextField
          select
          label="Payment Method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          SelectProps={{ native: true }}
          sx={{ mt: 2, mr: 2 }}
        >
          <option value="cash">Cash</option>
          <option value="card">Card</option>
        </TextField>
        {paymentMethod === 'cash' && (
          <TextField
            label="Cash Tendered"
            type="number"
            value={cashTendered}
            onChange={(e) => setCashTendered(parseFloat(e.target.value) || 0)}
            sx={{ mt: 2 }}
          />
        )}
        <Button variant="contained" color="primary" onClick={handlePayment} sx={{ mt: 2, ml: 2 }}>
          Process Payment
        </Button>
      </Box>
    </Container>
  );
}

export default Checkout;