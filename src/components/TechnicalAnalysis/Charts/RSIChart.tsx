import React from 'react';
import { Paper, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface RSIChartProps {
  data: any[]; // Adjust type as per your data structure
}

const formatXAxisDate = (tickItem: string) => {
  const date = new Date(tickItem);
  return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear().toString().slice(-2)}`;
};

const formatNumber = (value: number): string => {
  if (value < 1) {
    return value.toExponential(2).replace("e", "e");
  } else {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper style={{ padding: '10px' }}>
        <Typography variant="body2">{` ${(payload[0].payload[0])}`}</Typography>
        <Typography variant="body2">{`RSI: ${formatNumber(payload[0].value)}`}</Typography>
      </Paper>
    );
  }
  return null;
};

const RSIChart: React.FC<RSIChartProps> = ({ data }) => {
  return (
    <Paper style={{ marginTop: '20px', padding: '20px' }}>
      <Typography variant="h6" align="center" style={{ color: '#002060', fontWeight: 'bold', marginTop: '10px' }}>
        RSI
      </Typography>
      <LineChart width={700} height={400} data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="0" tickFormatter={formatXAxisDate} />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line type="monotone" dataKey="1" stroke="#039C0F"  name="RSI"   dot={false} />
      </LineChart>
    </Paper>
  );
};

export default RSIChart;
