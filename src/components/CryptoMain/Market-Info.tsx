import React from 'react';
import { Typography, Container, Box } from '@mui/material';

const MarketInfo: React.FC = () => {
  return (
    <Container>
      <Box sx={{ mt: 5, textAlign: 'left' }}>
        <Typography variant="h4" gutterBottom fontFamily={'Roboto, sans-serif'} sx={{ color: '#002060', fontWeight: 'bold' }}>
         Market Information
        </Typography>
        <Typography variant="body1" paragraph fontFamily={'revert'}>
        Unlock the potential of cryptocurrency markets with our advanced data analysis tools, providing real-time insights and trends to help you make informed investment decisions.

Stay ahead of the curve with our comprehensive market information, offering detailed analytics and historical data on various cryptocurrencies.

Our platform leverages cutting-edge technology to deliver precise and actionable cryptocurrency data, empowering traders and investors to navigate the volatile market with confidence.        </Typography>
      </Box>
    </Container>
  );
};

export default MarketInfo;
