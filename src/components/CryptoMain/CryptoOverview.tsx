import React from 'react';
import { Typography, Container, Box } from '@mui/material';

const CryptoOverview: React.FC = () => {
  return (
    <Container>
      <Box sx={{ mt: 5, textAlign: 'left' }}>
        <Typography variant="h4" gutterBottom fontFamily={'Roboto, sans-serif'} sx={{ color: '#002060', fontWeight: 'bold' }}>
          Crypto Overview
        </Typography>
        <Typography variant="body1" paragraph fontFamily={'revert'}>
          Cryptocurrency is digital money designed to exchange over the internet to buy goods and services, held as part of investment strategy to trade without any intermediaries like banks, and allows to transact globally 24 X 7 with very low fee. Its main purpose is to eliminate problems caused by the transactions through financial institutions, including long processing time, fraud transactions, and high transaction fees.
        </Typography>
      </Box>
    </Container>
  );
};

export default CryptoOverview;
