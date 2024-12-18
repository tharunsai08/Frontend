import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
  TextField,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useFormikContext } from 'formik';

interface Step1ContentPopupProps {
  open: boolean;
  onClose: () => void;
}

interface FilterData {
  rsi_value: number[];
  price: number[];
  ma9_ma20_value: string[];
}

const initialFilterData: FilterData = {
  rsi_value: [30],
  price: [30],
  ma9_ma20_value: ["Yes"],
};

const TechnicalFilters: React.FC<Step1ContentPopupProps> = ({ open, onClose }) => {
  const { setFieldValue } = useFormikContext<any>();
  const [filterData, setFilterData] = useState<FilterData>(initialFilterData);
  const [tempFilterData, setTempFilterData] = useState<FilterData>(initialFilterData);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    setTempFilterData(initialFilterData);
  }, [initialFilterData]);

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    const numberValue = value === '' ? '' : parseInt(value, 10);

    setTempFilterData(prevState => {
      const newFilterData = { ...prevState, [name]: [numberValue] };
      setFieldValue('Technical', newFilterData); // Update Formik values directly
      return newFilterData;
    });
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, category: keyof FilterData) => {
    const { value, checked } = event.target;
    setTempFilterData(prevState => {
      const currentCategory = prevState[category] as string[];
      const newCategory = checked
        ? Array.from(new Set([...currentCategory, value]))
        : currentCategory.filter(item => item !== value);
      const newFilterData = { ...prevState, [category]: newCategory };
      setFieldValue('Technical', newFilterData); // Update Formik values directly
      return newFilterData;
    });
  };

  const renderNumberInput = (label: string, value: number | string, name: keyof FilterData, text: string) => (
    <Box display="flex" alignItems="center" margin={1}>
      <Typography variant="subtitle1" sx={{ width: '250px' }}>{label}</Typography>
      <TextField
        type="number"
        name={name} // Correctly set name to match with FilterData keys
        value={value}
        onChange={handleNumberChange}
        InputProps={{
          inputProps: { min: 0 },
          style: { height: '32px', width: '80px' } // Decrease height and width
        }}
        sx={{
          fontSize: '0.75rem', // Adjust font size
        }}
      />
      <Typography variant="body2" sx={{ marginLeft: '8px' }}>{text}</Typography>
    </Box>
  );

  const renderCheckboxes = (label: string, items: string[], defaultSelected: string[]) => (
    <Box display="flex" alignItems="center" margin={1} sx={{ justifyContent: 'space-between' }}>
      <Typography variant="subtitle1" sx={{ width: '250px' }}>{label}</Typography>
      <Grid container spacing={1} sx={{ justifyContent: 'center' }}>
        {items.map(item => (
          <Grid item key={item}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={defaultSelected.includes(item)}
                  onChange={(event) => handleCheckboxChange(event, 'ma9_ma20_value')}
                  value={item}
                  sx={{ color: '#8f9e8c', '&.Mui-checked': { color: '#8f9e8c' } }} // Custom color
                />
              }
              label={item}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const handleApply = () => {
    setFilterData(tempFilterData);
    setSnackbarMessage('Filters saved! Click on Next to apply them.');
    onClose();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleCancel = () => {
    setTempFilterData(filterData); // Reset to the last saved values
    onClose();
  };

  const handleRefresh = () => {
    setTempFilterData(initialFilterData); // Reset filters to initial state
  };

  return (
    <>
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle sx={{ color: '#350164', backgroundColor: '#f5f5f5', display: 'flex', justifyContent: 'space-between', padding: '10px', alignItems: 'center' }}>
        Technical Filters
        <IconButton onClick={handleRefresh} color="primary" sx={{ color: '#034734' }}>
          <RefreshIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          <Box display="flex" flexDirection="column" flexWrap="wrap">
            {renderNumberInput('Relative Strength Index (RSI) >=', tempFilterData.rsi_value[0], 'rsi_value', '')}
            {renderNumberInput('Current Price >', tempFilterData.price[0], 'price', ' (% of 52 week high)')}
            {renderCheckboxes('MA9 > MA20 Value', ["Yes", "No"], tempFilterData.ma9_ma20_value)}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: '#e0e0e0', padding: '8px' }}>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Button
            onClick={handleCancel}
            sx={{
              color: '#fff',
              backgroundColor: '#99033c',
              '&:hover': { backgroundColor: '#c62f50' },
              fontSize: '0.75rem', // Decrease font size
              padding: '6px 12px', // Decrease padding
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            sx={{
              color: '#fff',
              backgroundColor: '#00947e',
              '&:hover': { backgroundColor: '#034734' },
              fontSize: '0.75rem', // Decrease font size
              padding: '6px 12px', // Decrease padding
            }}
          >
            Apply
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
    <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
    <Alert onClose={handleSnackbarClose} severity="info">
      {snackbarMessage}
    </Alert>
  </Snackbar>
  </>
  );
};

export default TechnicalFilters;
