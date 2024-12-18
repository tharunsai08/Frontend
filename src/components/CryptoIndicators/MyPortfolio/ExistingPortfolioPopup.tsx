import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";


import api from "src/api";

interface ExistingPortfolioPopupProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  ticker: string;
}

interface Portfolio {
  id: number;
  portfolio_name: string;
}

const ExistingPortfolioPopup: React.FC<ExistingPortfolioPopupProps> = ({
  open,
  onClose,
  // onSave,
  ticker,
}) => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [priceBought, setPriceBought] = useState<string>('');

  useEffect(() => {
    // Fetch the list of portfolios
    api.get(`/api/list-portfolios/`)
      .then((response: { data: React.SetStateAction<Portfolio[]>; }) => setPortfolios(response.data))
      .catch((error: any) => console.error('Error fetching portfolios:', error));
  }, []);

  const handleSave = () => {
    const newRecord = {
      portfolio_name: selectedPortfolio,
      ticker_name: ticker,
      quantity,
      price_bought: priceBought,
    };

    api.post(`/api/create-portfolio-record/`, newRecord)
      .then((response: { data: any; }) => {
        console.log('Record saved:', response.data);
        // onSave();
      })
      .catch((error: any) => console.error('Error saving record:', error));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="subtitle2">
          Add to Existing Portfolio
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 15,
            top: 15,
            color: "#f52a4c",
            border: '1px solid #f52a4c',
            borderRadius: '50%',
            padding: '2px',
            "&:hover": {
              backgroundColor: '#f52a4c',
              color: '#FFFFFF',
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="select-portfolio-label">Select Portfolio</InputLabel>
          <Select
            labelId="select-portfolio-label"
            id="select-portfolio"
            value={selectedPortfolio}
            onChange={(e) => setSelectedPortfolio(e.target.value)}
            label="Select Portfolio"
          >
            {portfolios.map((portfolio) => (
              <MenuItem key={portfolio.id} value={portfolio.portfolio_name}>
                {portfolio.portfolio_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Ticker: {ticker}
        </Typography>
        <TextField
          fullWidth
          label="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          type="number"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Price Bought"
          value={priceBought}
          onChange={(e) => setPriceBought(e.target.value)}
          type="number"
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            color: "#f52a4c",
            borderColor: "#f52a4c",
            backgroundColor: "#FFFFFF",
            "&:hover": {
              backgroundColor: "#FFFFFF",
              borderColor: "#f52a4c",
            },
          }}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          sx={{
            backgroundColor: "#136f63",
            color: "#FFFFFF",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#0b4e44",
            },
          }}
          variant="contained"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExistingPortfolioPopup;
