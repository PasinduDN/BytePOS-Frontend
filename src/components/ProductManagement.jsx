import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from '@mui/material';
import axios from 'axios';
import JsBarcode from 'jsbarcode';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', barcode: '', price: 0, stockQuantity: 0 });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await axios.get('/api/products', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setProducts(response.data);
  };

  const handleAddProduct = async () => {
    await axios.post('/api/products', { ...newProduct, storeId: 1 }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    JsBarcode("#barcode", newProduct.barcode);
    fetchProducts();
    setNewProduct({ name: '', barcode: '', price: 0, stockQuantity: 0 });
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/products/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    fetchProducts();
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Product Management
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          sx={{ mr: 2 }}
        />
        <TextField
          label="Barcode"
          value={newProduct.barcode}
          onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
          sx={{ mr: 2 }}
        />
        <TextField
          label="Price"
          type="number"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
          sx={{ mr: 2 }}
        />
        <TextField
          label="Stock Quantity"
          type="number"
          value={newProduct.stockQuantity}
          onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: parseInt(e.target.value) })}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" onClick={handleAddProduct}>
          Add Product
        </Button>
      </Box>
      <canvas id="barcode" style={{ display: 'none' }}></canvas>
      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Barcode</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.barcode}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.stockQuantity}</TableCell>
                <TableCell>
                  <Button color="secondary" onClick={() => handleDelete(product.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}

export default ProductManagement;