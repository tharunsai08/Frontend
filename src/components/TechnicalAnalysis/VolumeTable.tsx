import React from 'react';
import {
  Card,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography
} from '@mui/material';
import { getActionColor } from './utils'; // Import the utility function

interface VolumeTableProps {
  data: any; // Adjust type as per your API response structure
}

const VolumeTable: React.FC<VolumeTableProps> = ({ data }) => {
  return (
    <Card variant="outlined" style={{ marginBottom: '20px', backgroundColor: '#f0f0f0',boxShadow: '0 4px 8px 0 #c6f5e4, 0 6px 20px 0 #c6f5e4' }}>
      <Typography variant="h6" style={{ color: '#002060', fontWeight: 'bold', padding: '10px' }}>Volume Table : <span style={{ color: getActionColor(data.volume_action_count), fontWeight: 'bold' }}>{data.volume_action_count}</span></Typography>
      <Card variant="outlined" style={{ margin: '10px', marginTop: '0', backgroundColor: '#FDFEF7' }}>
        <TableContainer>
          <Table aria-label="Volume Table">
            <TableHead style={{ backgroundColor: '#F1FCEA' }}>
              <TableRow>
                <TableCell style={{ color: '#0078ff', fontWeight: 'bold' }}>Metric</TableCell>
                <TableCell align="right" style={{ color: '#0078ff', fontWeight: 'bold' }}>Value</TableCell>
                <TableCell align="right" style={{ color: '#0078ff', fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.volume_table.map((row: any, index: number) => (
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
  );
};

export default VolumeTable;
