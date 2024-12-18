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
  IconButton,  // Import IconButton
  Snackbar,
  Alert
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';  // Import RefreshIcon
import { useFormikContext } from 'formik';

interface Step1ContentPopupProps {
  open: boolean;
  onClose: () => void;
}

interface FilterData {
  transparency: string[];
  vc_funding: string[];
  business_risk_volatility: string[];
  revenue_growth: string[];
  engagement: string[];
}

const initialFilterData: FilterData = {
  transparency: ['Active'],
  vc_funding: ["4", "5"],
  business_risk_volatility: ["1", "2", "3"],
  revenue_growth: ["3", "4", "5"],
  engagement: ["3", "4", "5"],
};

const FundamentalFilters: React.FC<Step1ContentPopupProps> = ({ open, onClose }) => {
  const { setFieldValue } = useFormikContext<any>();
  const [filterData, setFilterData] = useState<FilterData>(initialFilterData);
  const [tempFilterData, setTempFilterData] = useState<FilterData>(initialFilterData);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');


  useEffect(() => {
    setTempFilterData(initialFilterData);
  }, [initialFilterData]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, category: keyof FilterData) => {
    const { value, checked } = event.target;
    setTempFilterData(prevState => {
      const newCategory = checked
        ? [...prevState[category], value]
        : prevState[category].filter(item => item !== value);

      const newFilterData = { ...prevState, [category]: newCategory };
      setFieldValue('Fundamental', newFilterData); // Update Formik values directly

      return newFilterData;
    });
  };

  const renderCheckboxes = (label: keyof FilterData, items: string[], defaultSelected: string[]) => (
    <Box flex={1} margin={1}>
      <Grid container spacing={1}>
        {(items || []).map(item => (
          <Grid item key={item}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={(defaultSelected || []).includes(item)}
                  onChange={(event) => handleCheckboxChange(event, label)}
                  value={item}
                  sx={{ color: '#8f9e8c', '&.Mui-checked': { color: '#8f9e8c' } }} // Custom color
                />
              }
              label={item.toString()} // Label for the checkbox
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const handleApply = () => {
    setFilterData(tempFilterData);
    onClose();
    setSnackbarMessage('Filters saved! Click on Next to apply them.');
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  

  const handleCancel = () => {
    setTempFilterData(filterData); // Reset to the last saved values
    onClose();
  };

  const handleRefresh = () => {
    // Implement the refresh logic here, e.g., resetting filters or re-fetching data.
    setTempFilterData(initialFilterData); // Example: Reset filters to initial state
  };

  // Function to format the filter labels
  const formatLabel = (label: string) => {
    switch (label) {
      case 'transparency':
        return 'Transparency';
      case 'vc_funding':
        return 'VC Funding';
      case 'business_risk_volatility':
        return 'Volatility';
      case 'revenue_growth':
        return 'Revenue Growth';
      case 'engagement':
        return 'Engagement';
      default:
        return label;
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle
          sx={{
            color: '#350164',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px',
            alignItems: 'center',
          }}
        >
          Fundamental Filters
          <IconButton onClick={handleRefresh} color="primary" sx={{ color: '#034734' }}>
            <RefreshIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={0}>
            {(['transparency', 'vc_funding', 'business_risk_volatility', 'revenue_growth', 'engagement'] as (keyof FilterData)[]).map((filterKey) => (
              <Box key={filterKey} display="flex" alignItems="center" gap={1} mb={0}>
                <Typography variant="subtitle1" sx={{ minWidth: '150px' }}>
                  {formatLabel(filterKey)}
                </Typography>
                {renderCheckboxes(
                  filterKey,
                  filterKey === 'transparency' ? ['Active', 'Inactive'] : ['1', '2', '3', '4', '5'],
                  tempFilterData[filterKey]
                )}
              </Box>
            ))}
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
                fontSize: '0.75rem',
                padding: '6px 12px',
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
                fontSize: '0.75rem',
                padding: '6px 12px',
              }}
            >
              Save
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

export default FundamentalFilters;
