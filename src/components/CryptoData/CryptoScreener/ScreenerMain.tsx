import { Container, Typography } from '@mui/material';
import React from 'react'
import ScreenerNavbar from './ScreenerNavbar';

const ScreenerMain = () => {
  return (
    <Container sx={{ mt: 5, textAlign: 'left' }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#002060', fontWeight: 'bold' }}>
          Crypto Screener
        
        </Typography>

       <ScreenerNavbar />

      <br></br>
       
    </Container>
);
}

export default ScreenerMain