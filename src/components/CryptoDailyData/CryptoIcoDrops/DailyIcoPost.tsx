import React, { useState, ChangeEvent, SyntheticEvent, useEffect } from 'react';
import { Button, Tabs, Tab, Box, Typography, Grid, Snackbar, Alert } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import api from 'src/api';

// Define types
type HistoricalData = {
  project: string;
  date: string;
  ticker: string;
  overview: string;
  round: string;
  total_raised: string;
  pre_valuation: string;
  total_rounds: number;
  investors: string;
  ecosystem: string;
  token_type: string;
  categories: string;
  listing_date: string;
  project_website: string;
  whitepaper: string;
  linkedin: string;
  twitter: string;
  telegram_chat: string;
  github: string;
  discord: string;
  reddit: string;
  youtube: string;
  other: string;
  source: string;
  created_at: string;
  updated_at: string;
};

type DuplicateData = {
  date: string;
  project: string;
  ticker: string;
  overview: string;
  round: string;
  investors: string;
  ecosystem: string;
  token_type: string;
  listing_date: string;
};

const DailyIcoPost = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tabValue, setTabValue] = useState<number>(0);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [duplicates, setDuplicates] = useState<DuplicateData[]>([]);
  const [filteredHistoricalData, setFilteredHistoricalData] = useState<HistoricalData[]>([]);
  const [filteredDuplicates, setFilteredDuplicates] = useState<DuplicateData[]>([]);
  const [searchQuery] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Fetch data from the API
  const fetchData = async () => {
    try {
      const response = await api.get(`/crypto-ico-dailypost/`);
      
      // Assuming the response data is structured with historical and duplicate keys
      setHistoricalData(response.data.historical);
      setDuplicates(response.data.duplicate);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Handle file change
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file.type !== 'text/csv') {
        setSnackbarMessage('Please upload a CSV file.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }
      setSelectedFile(file);
      setUploadedFileName(file.name); // Set the uploaded file name immediately
    }
  };

  // Handle file upload
  const handleSubmit = async () => {
    if (!selectedFile) {
      setSnackbarMessage('Please upload a CSV file.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
  
    const formData = new FormData();
    formData.append('csvfile', selectedFile);
  
    try {
      await api.post(`api/upload-csv/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSnackbarMessage('File uploaded successfully.');
      setSnackbarSeverity('success');
    } catch (error) {
      setSnackbarMessage('Error uploading file.');
      setSnackbarSeverity('error');
      console.error(error);
    }
    setSnackbarOpen(true);
  };

  // Handle tab change
  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle search input change
  // const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   const query = event.target.value.toLowerCase();
  //   setSearchQuery(query);

  //   // Filter data based on search query
  //   if (tabValue === 0) {
  //     setFilteredHistoricalData(
  //       historicalData.filter(row =>
  //         row.project && row.project.toLowerCase().includes(query)
  //       )
  //     );
  //   } else {
  //     setFilteredDuplicates(
  //       duplicates.filter(row =>
  //         row.project && row.project.toLowerCase().includes(query)
  //       )
  //     );
  //   }
  // };

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Initial filtering
  useEffect(() => {
    setFilteredHistoricalData(
      historicalData.filter(row =>
        row.project && row.project.toLowerCase().includes(searchQuery)
      )
    );
  }, [historicalData, searchQuery]);

  useEffect(() => {
    setFilteredDuplicates(
      duplicates.filter(row =>
        row.project && row.project.toLowerCase().includes(searchQuery)
      )
    );
  }, [duplicates, searchQuery]);

  // Define columns for the DataGrid
  const historicalColumns: GridColDef[] = [
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'project', headerName: 'Project', width: 150 },
    { field: 'ticker', headerName: 'Ticker', width: 100 },
    { field: 'overview', headerName: 'Overview', width: 300 },
    { field: 'round', headerName: 'Round', width: 150 },
    { field: 'total_raised', headerName: 'Total Raised', width: 150 },
    { field: 'pre_valuation', headerName: 'Pre Valuation', width: 150 },
    { field: 'total_rounds', headerName: 'Total Rounds', width: 150 },
    { field: 'investors', headerName: 'Investors', width: 250 },
    { field: 'ecosystem', headerName: 'Ecosystem', width: 150 },
    { field: 'token_type', headerName: 'Token Type', width: 150 },
    { field: 'categories', headerName: 'Categories', width: 150 },
    { field: 'listing_date', headerName: 'Listing Date', width: 150 },
    { field: 'project_website', headerName: 'Project Website', width: 250 },
    { field: 'whitepaper', headerName: 'Whitepaper', width: 250 },
    { field: 'linkedin', headerName: 'LinkedIn', width: 250 },
    { field: 'twitter', headerName: 'Twitter', width: 250 },
    { field: 'telegram_chat', headerName: 'Telegram Chat', width: 150 },
    { field: 'github', headerName: 'GitHub', width: 150 },
    { field: 'discord', headerName: 'Discord', width: 150 },
    { field: 'reddit', headerName: 'Reddit', width: 150 },
    { field: 'youtube', headerName: 'YouTube', width: 150 },
    { field: 'other', headerName: 'Other', width: 150 },
    { field: 'source', headerName: 'Source', width: 250 },
    { field: 'created_at', headerName: 'Created At', width: 200 },
    { field: 'updated_at', headerName: 'Updated At', width: 200 }
  ];

  const duplicateColumns: GridColDef[] = [
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'project', headerName: 'Project', width: 150 },
    { field: 'ticker', headerName: 'Ticker', width: 100 },
    { field: 'overview', headerName: 'Overview', width: 300 },
    { field: 'round', headerName: 'Round', width: 150 },
    { field: 'investors', headerName: 'Investors', width: 250 },
    { field: 'ecosystem', headerName: 'Ecosystem', width: 150 },
    { field: 'token_type', headerName: 'Token Type', width: 150 },
    { field: 'listing_date', headerName: 'Listing Date', width: 150 }
  ];

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box width="100%" maxWidth="1200px" margin="0 auto" sx={{ p: 2 }}>
      <Grid container spacing={2} marginBottom={'10px'} justifyContent="center">
        <Grid item>
          <Typography variant="h5" gutterBottom color="#012d3f" align="center">
            <strong>Upload ICO Data</strong>
          </Typography>
        </Grid>
      </Grid>
      <Box width="100%" maxWidth="700px" margin="0 auto" padding={'10px'}>
        <Grid container spacing={2} justifyContent="center" padding={'10px'} border={'1px solid #e9e9e9'}>
          <Grid item>
            <CloudUploadIcon color='primary' sx={{ ml: 1, verticalAlign: 'middle', fontSize: '50px' }} />
          </Grid>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <p style={{ color: '#adadad' }}>Drag and drop some files here, or click to select files</p>
            </Grid>
          </Grid>
          <Grid item  >
            <label htmlFor="upload-file">   

            <Button variant="contained" component="span">
             Upload File
            <input
              accept=".csv"
              style={{ display: 'none' }}
              id="upload-file"
              type="file"
              onChange={handleFileChange}
            />
             
              </Button>
              </label>
              {uploadedFileName && (
                <Typography variant="body2" color="textSecondary" marginLeft="10px">
                  {uploadedFileName}
                </Typography>
              )}
        
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={2} marginTop={'10px'} justifyContent="center">
        <Grid item>
          <Button onClick={handleSubmit} variant="contained">Submit</Button>
        </Grid>
      </Grid>
      <Box sx={{ width: '100%', mt: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="tabs">
              <Tab label="Historical Data" />
              <Tab label="Duplicates" />
            </Tabs>
          </Grid>
          {/* <Grid item>
            <TextField
              label="Search Project"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ ml: 2 }}
            />
          </Grid> */}
        </Grid>
        <Box mt={2} sx={{ height: 700, width: '100%' }}>
          {tabValue === 0 && (
            <DataGrid
              rows={filteredHistoricalData}
              columns={historicalColumns}
              getRowId={(row) => row.project}
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "transparent",
                },
                "& .MuiDataGrid-cell": {
                  color: "#676868",
                },
                "& .MuiDataGrid-cell--editing": {
                  border: "none",
                },
                "& .MuiDataGrid-cell:focus": {
                  outline: "none",
                },
                "& .MuiDataGrid-row:nth-of-type(odd)": {
                  backgroundColor: "#F0FCFC",
                },
                "& .MuiDataGrid-row:nth-of-type(even)": {
                  backgroundColor: "#FFFFFF",
                },
              }}

            />
          )}
          {tabValue === 1 && (
            <DataGrid
              rows={filteredDuplicates}
              columns={duplicateColumns}
              getRowId={(row) => row.project}
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "transparent",
                },
                "& .MuiDataGrid-cell": {
                  color: "#676868",
                },
                "& .MuiDataGrid-cell--editing": {
                  border: "none",
                },
                "& .MuiDataGrid-cell:focus": {
                  outline: "none",
                },
                "& .MuiDataGrid-row:nth-of-type(odd)": {
                  backgroundColor: "#F0FCFC",
                },
                "& .MuiDataGrid-row:nth-of-type(even)": {
                  backgroundColor: "#FFFFFF",
                },
              }}

            />
          )}
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DailyIcoPost;
