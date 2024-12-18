import React, { useEffect, useState } from 'react';
import { Autocomplete, Checkbox, TextField, Grid, Box, ListItem, ListItemText, Typography, Tooltip } from '@mui/material';
import { Controller, useForm, FieldValues } from 'react-hook-form';
import useFilters from './useFilters'; // Import the custom hook
import InfoIcon from '@mui/icons-material/Info'; // Import the InfoIcon
import Loading from 'src/components/Loading';

interface RiskTabContentProps {
  onSelectionChange: (fieldName: string, values: string[]) => void;
  selectedValues: { [key: string]: string[] };
}

const RiskTabContent: React.FC<RiskTabContentProps> = ({ onSelectionChange, selectedValues }) => {
  const { filters, loading, error } = useFilters(`${process.env.PUBLIC_URL}/Filters.json`);
  const { control } = useForm<FieldValues>();
  const [riskOptions, setRiskOptions] = useState<{ [key: string]: { options: string[], label: string, description: string } }>({});

  useEffect(() => {
    if (filters.Risk) {
      setRiskOptions(filters.Risk);
    }
  }, [filters]);

  const handleSelectionChange = (fieldName: string, values: string[]) => {
    onSelectionChange(fieldName, values); // Notify parent of selection change
  };

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  const columnsPerRow = 6;

  const formatSelectedTags = (values: string[]) => {
    if (values.length === 0) return [];
    const firstValue = values[0];
    if (values.length === 1) return [firstValue];
    return [firstValue, `+${values.length - 1}`];
  };

  return (
    <Box pl={2} pt={2}>
      <Grid container spacing={2} sx={{ backgroundColor: '#f7f8f8', maxHeight: '370px', overflowY: 'scroll' }}>
        {Object.keys(riskOptions).map((riskCategory) => (
          <Grid item xs={12} sm={6} md={12 / columnsPerRow} key={riskCategory}>
            <Box mb={2} width="100%">
              <Typography style={{ fontSize: '0.75rem', marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
                <span>{riskOptions[riskCategory].label}:</span>
                {riskOptions[riskCategory].description && (
                  <Tooltip title={riskOptions[riskCategory].description} arrow>
                    <InfoIcon sx={{ ml: 1, fontSize: '1rem', color: '#cfcfcf' }} />
                  </Tooltip>
                )}
              </Typography>
              <Controller
                name={riskCategory.toLowerCase().replace(/ /g, '_')}
                control={control}
                defaultValue={selectedValues[riskCategory.toLowerCase().replace(/ /g, '_')] || []}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    options={riskOptions[riskCategory].options}
                    getOptionLabel={(option) => option}
                    disableCloseOnSelect
                    sx={{
                      width: '100%',
                      '& .MuiInputBase-root': {
                        fontSize: '0.75rem',
                        padding: '4px',
                      },
                      '& .MuiCheckbox-root': {
                        padding: '3px',
                        '& .MuiSvgIcon-root': {
                          fontSize: '1rem',
                        },
                      },
                      '& .MuiListItem-root': {
                        fontSize: '0.75rem',
                        padding: '4px',
                      },
                      '& .MuiListItemText-root': {
                        fontSize: '0.75rem',
                      },
                    }}
                    renderInput={(params) => (
                      <TextField {...params} variant="outlined" size="small" fullWidth placeholder="Any" />
                    )}
                    renderTags={(value: string[], getTagProps) => {
                      const formattedTags = formatSelectedTags(value);
                      return formattedTags.map((tag, idx) => (
                        <div
                          key={idx} // Ensure unique key
                          style={{
                            backgroundColor: '#e0e0e0',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            margin: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px', // Space between items
                          }}
                        >
                          {tag}
                        </div>
                      ));
                    }}
                    renderOption={(props, option, { selected }) => (
                      <ListItem {...props} style={{ padding: '4px' }}>
                        <Checkbox
                          checked={selected}
                          sx={{ padding: '4px', '& .MuiSvgIcon-root': { fontSize: '1.25rem' } }}
                        />
                        <ListItemText primary={option} />
                      </ListItem>
                    )}
                    value={field.value || []}
                    onChange={(_, value) => {
                      handleSelectionChange(riskCategory.toLowerCase().replace(/ /g, '_'), value as string[]);
                      field.onChange(value);
                    }}
                  />
                )}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RiskTabContent;
