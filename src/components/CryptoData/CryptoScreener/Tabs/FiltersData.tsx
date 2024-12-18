import React from 'react';
import { Button, Box } from '@mui/material';

const resetButtonStyle = {
  backgroundColor: 'white',
  color: '#002060',
  border: '1px solid #002060',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
};

const applyButtonStyle = {
  backgroundColor: '#05445e',
  color: 'white',
  '&:hover': {
    backgroundColor: '#05445e',
  },
};

interface FiltersDataProps {
  filters: { [key: string]: string[] };
  onApply: (filters: { [key: string]: string[] }) => void;
  onReset: () => void;
}

const FiltersData: React.FC<FiltersDataProps> = ({ filters, onApply, onReset }) => {
  const handleApply = () => {
    onApply(filters);
  };

  const handleReset = () => {
    onReset();
  };

  return (
    <Box
      pt={2}
      bgcolor={"#f7f8f8"}
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100px"
      sx={{
        mb: 2
      }}
    >
      <Box display="flex" gap={2}>
        <Button variant="contained" sx={applyButtonStyle} onClick={handleApply}>
          Apply
        </Button>
        <Button variant="outlined" sx={resetButtonStyle} onClick={handleReset}>
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default FiltersData;
