// Footer.tsx

import React from 'react';
import { Grid, Box, Typography, Divider } from '@mui/material';
import MarkunreadIcon from '@mui/icons-material/Markunread';
import PhoneIcon from '@mui/icons-material/Phone';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

  return (
    <Box bgcolor="#2a2e39" color="#fff" py={4} textAlign="center" mt={4}>
      <Grid container spacing={4}>
        {/* COMPANY column */}
        <Grid item xs={12} sm={4}>
          <Box mb={3}>
            <Typography fontSize="1rem" fontWeight="bold" variant="h6">COMPANY</Typography>
            <Typography component="ul" sx={{ listStyleType: 'none', padding: 3 }}>
              <li><Typography fontSize="0.8rem" component="li" mb={1}>Subscription</Typography></li>
              <li><Typography fontSize="0.8rem" component="li" mb={1}>About Us</Typography></li>
              <li><Typography fontSize="0.8rem" component="li" mb={1}>FAQ</Typography></li>
              <li><Typography fontSize="0.8rem" component="li" mb={1}>Terms of Use</Typography></li>
              <li><Typography fontSize="0.8rem" component="li" mb={1}>Privacy Policy</Typography></li>
            </Typography>
          </Box>
        </Grid>

        {/* RESOURCES column */}
        <Grid item xs={12} sm={4}>
          <Box mb={3}>
            <Typography fontSize="1rem" fontWeight="bold" variant="h6">RESOURCES</Typography>
            <Typography component="ul" sx={{ listStyleType: 'none', padding: 3 }}>
              <li><Typography fontSize="0.8rem" component="li" mb={1}>Blog</Typography></li>
              <li><Typography fontSize="0.8rem" component="li" mb={1}>Site Map</Typography></li>
              <li><Typography fontSize="0.8rem" component="li" mb={1}>Crypto Charts</Typography></li>
              <li><Typography fontSize="0.8rem" component="li" mb={1}>Crypto Lookup</Typography></li>
            </Typography>
          </Box>
        </Grid>

        {/* CONTACT column */}
        <Grid item xs={12} sm={4}>
          <Box mb={3}>
            <Typography fontSize="1rem" fontWeight="bold" variant="h6" display="flex" alignItems="center">CONTACT</Typography>
            <Typography component="ul" sx={{ listStyleType: 'none', padding: 3 }}>
              <li>
                <Typography fontSize="0.8rem" component="li" mb={1} display="flex" alignItems="center">
                  <MarkunreadIcon sx={{ mr: 1 }} />
                  Email: support@72pi.ai
                </Typography>
              </li>
              <li>
                <Typography fontSize="0.8rem" component="li" mb={1} display="flex" alignItems="center">
                  <PhoneIcon sx={{ mr: 1 }} />
                  Phone: +91 891 929 3838
                </Typography>
              </li>
              <li><Typography fontSize="0.8rem" component="li" mb={1} display="flex" alignItems="center">Website Disclaimer</Typography></li>
              <li><Typography fontSize="0.8rem" component="li" mb={1} display="flex" alignItems="center">Contact Us</Typography></li>
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2, borderColor: '#fff' }} />

      <Typography variant="body2" fontSize="0.8rem">
        Golden Hills Capital India Private Limited | Copyright ©{currentYear} All Rights Reserved
      </Typography>
    </Box>
  );
};

export default Footer;
