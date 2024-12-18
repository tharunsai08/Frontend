import React, { useEffect, useState } from 'react';
import { Autocomplete, Checkbox, TextField, Grid, Box, ListItem, ListItemText, Typography, Tooltip } from '@mui/material';
import { Controller, useForm, FieldValues } from 'react-hook-form';
import useFilters from './useFilters';
import InfoIcon from '@mui/icons-material/Info'; // Import InfoIcon
import Loading from 'src/components/Loading';

interface FundamentalTabContentProps {
  onSelectionChange: (fieldName: string, values: string[]) => void;
  selectedValues: { [key: string]: string[] };
}

const FundamentalTabContent: React.FC<FundamentalTabContentProps> = ({ onSelectionChange, selectedValues }) => {
  const { filters, loading, error } = useFilters(`${process.env.PUBLIC_URL}/Filters.json`);
  const { control } = useForm<FieldValues>();
  const [fundamentalOptions, setFundamentalOptions] = useState<{ [key: string]: { options: string[], label: string, description: string } }>({});

  useEffect(() => {
    if (filters.Fundamental) {
      setFundamentalOptions(filters.Fundamental);
    }
  }, [filters]);

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
        {Object.keys(fundamentalOptions).map((column) => (
          <Grid item xs={12} sm={6} md={12 / columnsPerRow} key={column}>
            <Box mb={2} width="100%">
              <Typography style={{ fontSize: '0.75rem', marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
                <span>{fundamentalOptions[column].label}:</span>
                {fundamentalOptions[column].description && (
                  <Tooltip title={fundamentalOptions[column].description} arrow>
                    <InfoIcon sx={{ ml: 1, fontSize: '1rem', color: '#cfcfcf' }} />
                  </Tooltip>
                )}
              </Typography>
              <Controller
                name={column.toLowerCase().replace(/ /g, '_')}
                control={control}
                defaultValue={selectedValues[column.toLowerCase().replace(/ /g, '_')] || []}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    options={fundamentalOptions[column].options}
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
                      const fieldName = column.toLowerCase().replace(/ /g, '_');
                      onSelectionChange(fieldName, value as string[]);
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

export default FundamentalTabContent;
