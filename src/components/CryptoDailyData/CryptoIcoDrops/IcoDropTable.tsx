import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import api from 'src/api';

export interface IcoData {
  id: number;
  date: string;
  project: string;
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
  linkedin: string | null;
  twitter: string | null;
  telegram_chat: string | null;
  github: string | null;
  discord: string | null;
  reddit: string | null;
  youtube: string | null;
  other: string | null;
  source: string;
  created_at: string;
  updated_at: string;
}

const columns: GridColDef[] = [
  { field: 'project', headerName: 'Project', width: 150 },
  { field: 'round', headerName: 'Round', width: 150 },
  { field: 'total_raised', headerName: 'Total Raised', width: 120 },
  { field: 'pre_valuation', headerName: 'Pre Valuation', width: 150 },
  { field: 'investors', headerName: 'Investors', width: 150 },
  { field: 'ecosystem', headerName: 'Ecosystem', width: 150 },
  { field: 'categories', headerName: 'Categories', width: 150 },
  { field: 'date', headerName: 'Date', width: 120 }
];

const IcoDropTable: React.FC = () => {
  const [icoData, setIcoData] = useState<IcoData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.get(`/api/crypto-ico-data/`)
      .then(response => {
        const allIcos = [...response.data.active, ...response.data.upcoming];
        
        // Log and check the IDs for each row
        allIcos.forEach((ico, index) => {
          if (!ico.id) {
            console.warn(`Missing id for project ${ico.project} at index ${index}`);
          }
        });

        setIcoData(allIcos);
        setLoading(false);
      })
      .catch((error: any) => {
        console.error('There was an error fetching the data!', error);
        setLoading(false);
      });
  }, []);

  const getRowId = (row: IcoData) => {
    // Fallback to generate a unique ID if `id` is missing
    return row.id || `${row.project}-${row.date}`;
  };

  return (
    <Box p={2} display="flex" flexDirection="column" alignItems="center">
      <Box width="100%" maxWidth="1200px" margin="0 auto">
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#002060' }}>
          ICOs Overview ({icoData.length})
        </Typography>
        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={icoData}
            columns={columns}
            loading={loading}
            getRowId={getRowId}
            rowHeight={35}
            // Custom getRowId function with fallback
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "transparent",
              },
              "& .MuiDataGrid-cell": {
                color: "#000000",
              },
              "& .MuiDataGrid-cell--editing": {
                border: "none",
              },
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-row:nth-of-type(odd)": {
                backgroundColor: "#f5f5f5",
              },
              "& .MuiDataGrid-row:nth-of-type(even)": {
                backgroundColor: "#FFFFFF",
              },
            }}
          />
        </div>
      </Box>
    </Box>  
  );
};

export default IcoDropTable;
