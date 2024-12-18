import React, { useState } from 'react';
import {
  TextField, Button, Grid, Typography, Container, IconButton,
  MenuItem, Select, InputLabel, FormControl, SelectChangeEvent,
  Snackbar, Alert
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ChangeEvent, FormEvent } from 'react';
import api from 'src/api';



const DailyReportPost = () => {
  const [title, setTitle] = useState<string>('');
  const [start_date, setStartDate] = useState<string>('');
  const [end_date, setEndDate] = useState<string>('');
  const [quarter, setQuarter] = useState<string>('');
  const [document, setDocumentLink] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!document) {
      setError('Please provide a valid link.');
      setSnackbarMessage('Please provide a valid link.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    const formData = {
      title,
      start_date,
      end_date,
      quarter,
      document,
    };

    api.post(`/reports/`, formData)
      .then((response) => response.data)
      .then((data) => {
        console.log('Success:', data);
        setError(null);
        setSnackbarMessage('Uploaded successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        resetForm();
      })
      .catch((error) => {
        console.error('Error:', error);
        setError('An error occurred while submitting the report.');
        setSnackbarMessage('An error occurred while submitting the report.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      });
  };

  const resetForm = () => {
    setTitle('');
    setStartDate('');
    setEndDate('');
    setQuarter('');
    setDocumentLink('');
  };

  const handleReload = () => {
    resetForm(); // Clear form fields on reload
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="md" style={{ padding: '20px', position: 'relative' }}>
      <IconButton
        style={{ position: 'absolute', top: 16, right: 16 }}
        color="primary"
        onClick={handleReload}
      >
        <RefreshIcon />
      </IconButton>
      <Typography variant="h5" gutterBottom color="#012d3f">
        <strong>Upload Daily Report</strong>
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              size="small"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  type="date"
                  label="Report Start Date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={start_date}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  type="date"
                  label="Report End Date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={end_date}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Report Period</InputLabel>
                  <Select
                    value={quarter}
                    onChange={(e: SelectChangeEvent<string>) => setQuarter(e.target.value as string)}
                    label="Report Period"
                    required
                  >
                    <MenuItem value="Month 1st Half">Month 1st Half</MenuItem>
                    <MenuItem value="Month 2nd Half">Month 2nd Half</MenuItem>
                    <MenuItem value="Monthly">Monthly</MenuItem>
                    <MenuItem value="Q1">Q1</MenuItem>
                    <MenuItem value="Q2">Q2</MenuItem>
                    <MenuItem value="Q3">Q3</MenuItem>
                    <MenuItem value="Q4">Q4</MenuItem>
                    <MenuItem value="H1">H1</MenuItem>
                    <MenuItem value="H2">H2</MenuItem>
                    <MenuItem value="Yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Document Link"
              variant="outlined"
              fullWidth
              size="small"
              value={document}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDocumentLink(e.target.value)}
              required
            />
          </Grid>
          <Grid container spacing={2} marginTop={'10px'} justifyContent="center">
            <Grid item>
              <Button type="submit" variant="contained" color="primary" size="small">
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DailyReportPost;
