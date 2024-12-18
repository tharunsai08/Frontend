import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box } from '@mui/material';
import api from 'src/api';
import Loading from 'src/components/Loading';
import PerformanceWizard from 'src/components/CryptoData/IndexWizard/PerformanceWizard';

const formatNumber = (value: number, decimals: number = 2): string => {
  if (value < 1) {
    return value.toExponential(decimals).replace("e", "e");
  } else {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }
};

const PerformanceOverview = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get(`api/crypto-analysis/`)
      .then((response: { data: any; }) => setData(response.data))
      .catch((error: any) => console.error('Error fetching data:', error));
  }, []);

  if (!data) {
    return <Loading />;
  }

  const renderTable = (title: string, rows: any[], columns: string[], color: string) => (
<Card sx={{ 
  marginBottom: '16px', 
  boxShadow: '0 4px 8px 0 #c6f5e4, 0 6px 20px 0 #c6f5e4' 
}}>      <CardContent>
        <Typography variant="h6" align="center" gutterBottom style={{ fontSize: '16px', color: '#025453', fontWeight: 'bold' }}>
          {title}
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
            <TableRow style={{ backgroundColor: '#f2f6d1' }}>
              {columns.map((col, index) => (
                <TableCell key={index} style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000' }}>
                  {col === 'Return' ? `${col} (%)` : col}
                </TableCell>
              ))}
            </TableRow>

            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#F5F5F5' : '#ffffff' }}>
                  {columns.map((col, colIndex) => (
                    <TableCell key={colIndex} style={{ fontSize: '14px' }}>
                      {typeof row[col] === 'number' 
                        ? col === 'Volume' || 'Volume Change'
                          ? formatNumber(row[col], 0)
                          : formatNumber(row[col])
                        : row[col]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: '16px' }}>
      <Box display="flex"  justifyContent="center" sx={{ width: '100%', marginBottom: "10px" }}>
        <Typography
          variant="h5"
          gutterBottom
          fontFamily={"Roboto, sans-serif"}
          sx={{ color: "#002060", fontWeight: "bold" }}
        >
          Performance Overview
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          {renderTable('Top 10 Gainers', data.top_10_gainers, ["Ticker", "Start Price", "End Price", "Return", "Volume"], '#0dd943')}
        </Grid>
        <Grid item xs={12} sm={6}>
          {renderTable('Top 10 Losers', data.top_10_losers, ["Ticker", "Start Price", "End Price", "Return", "Volume"], '#e02c1f')}
        </Grid>
        <Grid item xs={12} sm={6}>
          {renderTable('Top 10 Volume', data.top_10_volume, ["Ticker", "Price", "Return", "Volume Change"], '#8785d6')}
        </Grid>
        <Grid item xs={12} sm={6}>
          {renderTable('50MA Cross', data['50ma_cross'], ["Ticker", "Volume", "Price", "Return", "50 Day MA"], '#8785d6')}
        </Grid>
      </Grid>
      <PerformanceWizard ticker_list={[]} />
    </Box>
  );
}

export default PerformanceOverview;
