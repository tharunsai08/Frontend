import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
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
  marketcapitalization: number[];
  volume: number[];
}

const initialFilterData: FilterData = {
  marketcapitalization: [500],
  volume: [25],
};

const QuantFilters: React.FC<Step1ContentPopupProps> = ({ open, onClose }) => {
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
      setFieldValue('Quant', newFilterData); // Update Formik values directly
      return newFilterData;
    });
  };

  const renderNumberInput = (label: string, value: number | string, name: keyof FilterData) => (
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
    setTempFilterData(filterData);
    onClose();
  };

  const handleRefresh = () => {
    setTempFilterData(initialFilterData); // Reset filters to initial state
  };

  return (
    <>
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle sx={{ color:'#350164', backgroundColor: '#f5f5f5', display: 'flex', justifyContent: 'space-between', padding: '10px', alignItems: 'center' }}>
        Quant Filters
        <IconButton onClick={handleRefresh} color="primary" sx={{ color: '#034734' }}>
          <RefreshIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          <Box display="flex" flexDirection="column" flexWrap="wrap">
            {renderNumberInput('Market Cap (in $ M) >', tempFilterData.marketcapitalization[0], 'marketcapitalization')}
            {renderNumberInput('Volume (in $ M) >', tempFilterData.volume[0], 'volume')}
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
            color="primary"
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

export default QuantFilters;
