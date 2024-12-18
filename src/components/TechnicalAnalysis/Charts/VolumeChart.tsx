import React, { useState } from 'react';
import { Paper, Typography } from '@mui/material';
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface VolumeChartProps {
  data: any; // Adjust type as per your data structure
}

interface CustomLegendPayload {
  value: string;
  type: 'line' | 'square';
  color: string;
  id: string;
}

const VolumeChart: React.FC<VolumeChartProps> = ({ data }) => {
  const [visibleLines, setVisibleLines] = useState({
    Volume: true,
    '20-Day Volume': true,
  });

  const handleLegendClick = (dataKey: string | number | ((obj: any) => any) | undefined) => {
    if (typeof dataKey === 'string') {
      setVisibleLines(prevState => ({
        ...prevState,
        [dataKey]: !prevState[dataKey as keyof typeof prevState],
      }));
    }
  };

  const formatXAxisDate = (tickItem: string) => {
    const date = new Date(tickItem);
    return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear().toString().slice(-2)}`;
  };

  const formatYAxisNumber = (value: number) => {
    if (value >= 1000000000) {
      return `${Math.round(value / 1000000000)}B`;
    } else if (value >= 1000000) {
      return `${Math.round(value / 1000000)}M`;
    }
    return Math.round(value).toString();
  };

  const formattedData = data.output_volume[0].data.map((item: any, index: number) => ({
    date: item[0],
    Volume: Math.round(item[1]), // Round Volume to 0 decimal places
    '20-Day Volume': data.output_volume[1].data[index] ? Math.round(data.output_volume[1].data[index][1]) : null, // Round 20-Day Volume to 0 decimal places
  }));

  return (
    <Paper style={{ marginTop: '20px', padding: '20px' }}>
      <Typography variant="h6" align="center" style={{ color: '#002060', fontWeight: 'bold', marginTop: '10px' }}>
        Volume and 20-Day Volume
      </Typography>
      <ComposedChart
        width={750}
        height={400}
        data={formattedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="date" tickFormatter={formatXAxisDate} />
        <YAxis tickFormatter={formatYAxisNumber} />
        <Tooltip formatter={(value: number) => formatYAxisNumber(value)} />
        <Legend
          onClick={(e) => handleLegendClick(e.dataKey)}
          payload={[
            { value: 'Volume', type: 'square', color: '#FA8A5D', id: 'Volume' },
            { value: '20-Day Volume', type: 'line', color: '#002060', id: '20-Day Volume' },
          ] as CustomLegendPayload[]}
        />
        <CartesianGrid stroke="#f5f5f5" />
        {visibleLines.Volume && <Bar dataKey="Volume" barSize={20} fill="#FA8A5D" />}
        {visibleLines['20-Day Volume'] && <Line type="monotone" dataKey="20-Day Volume" stroke="#002060" dot={false} strokeWidth={2} />}
      </ComposedChart>
    </Paper>
  );
};

export default VolumeChart;
