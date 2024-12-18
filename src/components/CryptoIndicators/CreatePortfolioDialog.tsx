import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, TextField, Button, Typography, Box, Grid, SelectChangeEvent, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import api from 'src/api';

interface CreatePortfolioDialogProps {
  open: boolean;
  portfolio_name: string | null;
  onClose: () => void;
  onPortfolioCreated: (portfolioName: string) => void;
}
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const CreatePortfolioDialog: React.FC<CreatePortfolioDialogProps> = ({ open, portfolio_name, onClose, onPortfolioCreated }) => {
  const [tickers, setTickers] = useState<string[]>([]);
  const [selectedTicker, setSelectedTicker] = useState<string>('');
  const [purchasePrice, setPurchasePrice] = useState<number>(1);
  const [quantity, setQuantity] = useState<number>(1);
  const [dateOfPurchase, setDateOfPurchase] = useState<string>(getCurrentDate());
  const [investedValue, setInvestedValue] = useState<number>(1);
  const [portfolioName, setPortfolioName] = useState<string>(portfolio_name || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (portfolio_name !== null) {
      setPortfolioName(portfolio_name);
    }
  }, [portfolio_name]);

  useEffect(() => {
    // Fetch tickers
    api.get(`/api/ticker-list/`)
      .then((response: { data: React.SetStateAction<string[]>; }) => setTickers(response.data))
      .catch((error: any) => console.error('Error fetching tickers:', error));
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Inline the reset logic here
    setTickers([]);
    setSelectedTicker('');
    setPurchasePrice(1);
    setQuantity(1);
    setDateOfPurchase(getCurrentDate());
    setInvestedValue(1);
  }, []); // Empty dependency array



  const handleTickerChange = (event: SelectChangeEvent<string>) => {
    setSelectedTicker(event.target.value);
    setErrors(prev => ({ ...prev, ticker: '' })); // Clear error for ticker
  };

  const handlePurchasePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const price = parseFloat(event.target.value);
    setPurchasePrice(price);
    setInvestedValue(price * quantity);
    setErrors(prev => ({ ...prev, purchasePrice: '' })); // Clear error for purchase price
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const qty = parseFloat(event.target.value);
    setQuantity(qty);
    setInvestedValue(purchasePrice * qty);
    setErrors(prev => ({ ...prev, quantity: '' })); // Clear error for quantity
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateOfPurchase(event.target.value);
    setErrors(prev => ({ ...prev, dateOfPurchase: '' })); // Clear error for date
  };

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!portfolioName) newErrors.portfolioName = 'Portfolio name is required';
    if (!selectedTicker) newErrors.ticker = 'Ticker is required';
    if (purchasePrice <= 0) newErrors.purchasePrice = 'Purchase price must be greater than 0';
    if (quantity <= 0) newErrors.quantity = 'Quantity must be greater than 0';
    if (!dateOfPurchase) newErrors.dateOfPurchase = 'Date of purchase is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateFields()) {
      // Save the new portfolio
      api.post(`/api/create-portfolio/`, {
        portfolio_name: portfolioName,
        ticker_name: `${selectedTicker}-USD`,
        purchase_price: purchasePrice,
        quantity: quantity,
        purchase_date: dateOfPurchase,
        total_value: investedValue
      })
        .then((response: { data: any; }) => {
          console.log('Portfolio created successfully:', response.data);
          onPortfolioCreated(portfolioName);
          onClose();
        })
        .catch((error: any) => console.error('Error creating portfolio:', error))
        .finally(() => handleReset()); // Reset fields after saving
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleReset = () => {
    setPortfolioName(portfolio_name || '');
    setSelectedTicker('');
    setPurchasePrice(1);
    setQuantity(1);
    setDateOfPurchase(getCurrentDate());
    setInvestedValue(1);
    setErrors({});
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Create New Portfolio
        <IconButton
          onClick={handleReset}
          sx={{ position: 'absolute', top: 8, right: 8 }}
          color="primary"
        >
          <RefreshIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ padding: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Portfolio Name"
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
                fullWidth
                disabled={!!portfolio_name}
                size="small" // Decreased size
                required
                error={!!errors.portfolioName}
                helperText={errors.portfolioName}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel id="ticker-select-label">Select Ticker</InputLabel>
                <Select
                  labelId="ticker-select-label"
                  value={selectedTicker}
                  onChange={handleTickerChange}
                  fullWidth
                  size="small" // Decreased size
                  required
                  error={!!errors.ticker}
                  displayEmpty
                >
                  {tickers.map((ticker) => (
                    <MenuItem key={ticker} value={ticker}>
                      {ticker}
                    </MenuItem>
                  ))}
                </Select>
                <Typography color="error" variant="caption">{errors.ticker}</Typography>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Purchase Price"
                type="number"
                value={purchasePrice}
                onChange={handlePurchasePriceChange}
                fullWidth
                size="small" // Decreased size
                required
                error={!!errors.purchasePrice}
                helperText={errors.purchasePrice}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Quantity"
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                fullWidth
                size="small" // Decreased size
                required
                error={!!errors.quantity}
                helperText={errors.quantity}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date of Purchase"
                type="date"
                value={dateOfPurchase}
                onChange={handleDateChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                size="small" // Decreased size
                required
                error={!!errors.dateOfPurchase}
                helperText={errors.dateOfPurchase}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">
                Invested Value: ${investedValue.toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCancel}
          sx={{
            backgroundColor: '#b60249',
            color: 'white',
            '&:hover': {
              backgroundColor: '#920237', // Optional: slightly darker color on hover
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          sx={{
            backgroundColor: '#177b5e',
            color: 'white',
            '&:hover': {
              backgroundColor: '#0f6146', // Optional: slightly darker color on hover
            }
          }}
        >
          Save
        </Button>
      </DialogActions>

    </Dialog>
  );
};

export default CreatePortfolioDialog;
