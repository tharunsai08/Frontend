import React from 'react';
import {
  Card,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  CardContent
} from '@mui/material';
import { getActionColor } from './utils'; // Import the utility function

interface MovingAverageTableProps {
  data: any; // Adjust type as per your API response structure
}

const MovingAverageTable: React.FC<MovingAverageTableProps> = ({ data }) => {
  return (
    <div>
      <Card variant="outlined" style={{ marginTop: '20px', backgroundColor: '#FDFEF7',boxShadow: '0 4px 8px 0 #c6f5e4, 0 6px 20px 0 #c6f5e4'  }}>
        <CardContent>
          <Typography variant="h6" style={{ color: '#002060', fontWeight: 'bold', padding: '10px' }} gutterBottom>
            Overall Technical Rating for the Coin: <span style={{ color: getActionColor(data.finalRating), fontWeight: 'bold' }}> {data.finalRating}</span>
          </Typography>
        </CardContent>
      </Card>
      <br />
      <Card variant="outlined" style={{ marginBottom: '20px', backgroundColor: '#f0f0f0',boxShadow: '0 4px 8px 0 #c6f5e4, 0 6px 20px 0 #c6f5e4'  }}>
        <Typography variant="h6" style={{ color: '#002060', fontWeight: 'bold', padding: '10px', marginBottom: '10px' }}>Moving Average Table: <span style={{ color: getActionColor(data.moving_action_count), fontWeight: 'bold' }}>{data.moving_action_count}</span></Typography>
        <Card variant="outlined" style={{ margin: '10px', marginTop: '0', backgroundColor: '#FDFEF7' }}>
          <TableContainer>
            <Table aria-label="Moving Average Table">
              <TableHead style={{ backgroundColor: '#F1FCEA' }}>
                <TableRow>
                  <TableCell style={{ color: '#0078ff', fontWeight: 'bold' }}>Metric</TableCell>
                  <TableCell align="right" style={{ color: '#0078ff', fontWeight: 'bold' }}>Value</TableCell>
                  <TableCell align="right" style={{ color: '#0078ff', fontWeight: 'bold' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.moving_avg_table.map((row: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {row.Metric}
                    </TableCell>
                    <TableCell align="right">
                      <span style={{ color: 'purple' }}>
                        {typeof row.Value === 'number' ? row.Value.toFixed(2) : row.Value}
                      </span>
                    </TableCell>
                    <TableCell align="right">
                      <span style={{ color: getActionColor(row.Action), fontWeight: 'bold' }}>
                        {row.Action}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Card>
    </div>
  );
};

export default MovingAverageTable;
