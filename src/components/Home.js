import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from '@mui/material';
import axios from 'axios';

const HomePage = () => {
  const [products, setProducts] = useState([]);

  const token = localStorage.getItem('authToken');
  
  useEffect(() => {
    axios.get('http://localhost:8080/products/all',
        {
             headers: {
    Authorization: `Bearer ${token}`,
  },
        }) // update endpoint as needed
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error loading products:', error));
  }, []);

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Featured Products
      </Typography>
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                image={product.image || 'https://via.placeholder.com/300'}
                alt={product.name}
                height="180"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {product.name}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {product.description}
                </Typography>
                <Typography variant="subtitle1" color="primary" sx={{ mt: 1 }}>
                  ₹{product.price}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" variant="contained">Buy</Button>
                <Button size="small" variant="outlined">Details</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {products.length === 0 && (
          <Typography textAlign="center" sx={{ width: '100%', mt: 5 }}>
            No products found.
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default HomePage;
