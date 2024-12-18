import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Divider, Link, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import  { IcoData } from './IcoDrops';
import IcoDropTable from './IcoDropTable';

// Utility function to extract the domain name from a URL
const getDomainName = (url: string) => {
  try {
    const { hostname } = new URL(url);
    const domainParts = hostname.split('.').slice(-2);
    return domainParts.join('.');
  } catch (error) {
    console.error('Invalid URL:', url);
    return url;
  }
};

const IcoDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { ico } = location.state as { ico: IcoData };

  // Debugging: Check the value of ico
  console.log('ICO Data:', ico);

  if (!ico) {
    return <Typography variant="h6" color="error">No ICO data found.</Typography>;
  }

  // Prepare rows for DataGrid
  const rows = [
    { id: 11, field: 'Listing Date', value: ico.listing_date },
    { id: 2, field: 'Ticker', value: ico.ticker },
    { id: 3, field: 'Round', value: ico.round },
    { id: 4, field: 'Total Raised', value: ico.total_raised },
    { id: 5, field: 'Pre-Valuation', value: ico.pre_valuation },
    { id: 6, field: 'Total Rounds', value: ico.total_rounds },
    { id: 7, field: 'Investors', value: ico.investors },
    { id: 8, field: 'Ecosystem', value: ico.ecosystem },
    { id: 9, field: 'Token Type', value: ico.token_type },
    { id: 10, field: 'Categories', value: ico.categories }

  ];

  const handleClick = () => {
    navigate('/IcoMonitor');
  };

  return (
    <Box p={3} maxWidth="1200px" margin="auto">
      <Button variant="contained" color="secondary" onClick={handleClick} style={{marginBottom:'10px',backgroundColor:'#016d73'}}>
        {ico.project}
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card variant="outlined" sx={{ 
  marginBottom: '16px', 
  boxShadow: '0 4px 8px 0 #c6f5e4, 0 6px 20px 0 #c6f5e4' 
}}>
            <CardContent>
              <Typography variant="body1" gutterBottom fontWeight="bold" color='#af014e'>
                ICO Overview : <span style={{ fontSize: '15px', fontWeight: '400', color: '#000000' }}>{ico.overview}</span>
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold" color='#320240'>Details</Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                {rows.map(row => (
                  <Grid item xs={12} sm={6} key={row.id}>
                    <Typography variant="body2">
                      <strong>{row.field}:</strong> {row.value}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold" color='#1e354f'>
                Links
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                {ico.project_website && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body2">
                      <strong>Project Website:</strong>{' '}
                      <Link href={ico.project_website} target="_blank" rel="noopener noreferrer">
                        {getDomainName(ico.project_website)}
                      </Link>
                    </Typography>
                  </Grid>
                )}
                {ico.whitepaper && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body2">
                      <strong>Whitepaper:</strong>{' '}
                      <Link href={ico.whitepaper} target="_blank" rel="noopener noreferrer">
                        {getDomainName(ico.whitepaper)}
                      </Link>
                    </Typography>
                  </Grid>
                )}
                {ico.linkedin && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body2">
                      <strong>LinkedIn:</strong>{' '}
                      <Link href={ico.linkedin} target="_blank" rel="noopener noreferrer">
                        {getDomainName(ico.linkedin)}
                      </Link>
                    </Typography>
                  </Grid>
                )}
                {ico.twitter && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body2">
                      <strong>Twitter:</strong>{' '}
                      <Link href={ico.twitter} target="_blank" rel="noopener noreferrer">
                        {getDomainName(ico.twitter)}
                      </Link>
                    </Typography>
                  </Grid>
                )}
                {ico.telegram_chat && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body2">
                      <strong>Telegram Chat:</strong>{' '}
                      <Link href={ico.telegram_chat} target="_blank" rel="noopener noreferrer">
                        {getDomainName(ico.telegram_chat)}
                      </Link>
                    </Typography>
                  </Grid>
                )}
                {ico.github && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body2">
                      <strong>GitHub:</strong>{' '}
                      <Link href={ico.github} target="_blank" rel="noopener noreferrer">
                        {getDomainName(ico.github)}
                      </Link>
                    </Typography>
                  </Grid>
                )}
                {ico.discord && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body2">
                      <strong>Discord:</strong>{' '}
                      <Link href={ico.discord} target="_blank" rel="noopener noreferrer">
                        {getDomainName(ico.discord)}
                      </Link>
                    </Typography>
                  </Grid>
                )}
                {ico.reddit && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body2">
                      <strong>Reddit:</strong>{' '}
                      <Link href={ico.reddit} target="_blank" rel="noopener noreferrer">
                        {getDomainName(ico.reddit)}
                      </Link>
                    </Typography>
                  </Grid>
                )}
                {ico.youtube && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body2">
                      <strong>YouTube:</strong>{' '}
                      <Link href={ico.youtube} target="_blank" rel="noopener noreferrer">
                        {getDomainName(ico.youtube)}
                      </Link>
                    </Typography>
                  </Grid>
                )}
                {ico.other && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body2">
                      <strong>Other:</strong>{' '}
                      <Link href={ico.other} target="_blank" rel="noopener noreferrer">
                        {getDomainName(ico.other)}
                      </Link>
                    </Typography>
                  </Grid>
                )}
                {ico.source && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body2">
                      <strong>Source:</strong>{' '}
                      <Link href={ico.source} target="_blank" rel="noopener noreferrer">
                        {getDomainName(ico.source)}
                      </Link>
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <IcoDropTable />
    </Box>
  );
};

export default IcoDetail;
