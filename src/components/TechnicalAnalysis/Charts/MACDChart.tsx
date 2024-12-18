// MACDChart.tsx
import React, { useState } from 'react';
import { Paper, Typography } from '@mui/material';
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface MACDChartProps {
  data: any; // Adjust type as per your data structure
}

interface CustomLegendPayload {
  value: string;
  type: 'line' | 'square';
  color: string;
  id: string;
}

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
const formatXAxisDate = (tickItem: string) => {
  const date = new Date(tickItem);
  return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear().toString().slice(-2)}`;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper style={{ padding: '10px' }}>
        <Typography variant="body2">{` ${(payload[0].payload.date)}`}</Typography>
        <Typography variant="body2">{`MACD Line: ${formatNumber(payload[0].payload['MACD Line'])}`}</Typography>
        <Typography variant="body2">{`Signal Line: ${formatNumber(payload[0].payload['Signal Line'])}`}</Typography>
        <Typography variant="body2">{`MACD Histogram: ${formatNumber(payload[0].payload['MACD Histogram'])}`}</Typography>
      </Paper>
    );
  }
  return null;
};

const MACDChart: React.FC<MACDChartProps> = ({ data }) => {
  const [visibleLines, setVisibleLines] = useState({
    'MACD Line': true,
    'Signal Line': true,
    'MACD Histogram': true,
  });

  const handleLegendClick = (dataKey: string | number | ((obj: any) => any) | undefined) => {
    if (typeof dataKey === 'string') {
      setVisibleLines(prevState => ({
        ...prevState,
        [dataKey]: !prevState[dataKey as keyof typeof prevState]
      }));
    }
  };

 
  const formattedData = data.output_macd[0].data.map((item: any, index: number) => ({
    date: item[0],
    'MACD Line': item[1],
    'Signal Line': data.output_macd[1].data[index] ? data.output_macd[1].data[index][1] : null,
    'MACD Histogram': data.output_macd[2].data[index] ? data.output_macd[2].data[index][1] : null,
  }));

  return (
    <Paper style={{ marginTop: '20px', padding: '20px' }}>
      <Typography variant="h6" align="center" style={{ color: '#002060', fontWeight: 'bold', marginTop: '10px' }}>
        MACD 
      </Typography>
      <ComposedChart
        width={700}
        height={400}
        data={formattedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="date" tickFormatter={formatXAxisDate} />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          onClick={(e) => handleLegendClick(e.dataKey)}
          payload={[
            { value: 'MACD Line', type: 'line', color: '#0078FF', id: 'MACD Line' },
            { value: 'Signal Line', type: 'line', color: '#019DA4', id: 'Signal Line' },
            { value: 'MACD Histogram', type: 'square', color: '#D4A3FD', id: 'MACD Histogram' },
          ] as CustomLegendPayload[]}
        />
        <CartesianGrid stroke="#f5f5f5" />
        {visibleLines['MACD Line'] && <Line type="monotone" dataKey="MACD Line" stroke="#0078FF" dot={false} strokeWidth={1.5} />}
        {visibleLines['Signal Line'] && <Line type="monotone" dataKey="Signal Line" stroke="#019DA4" dot={false} strokeWidth={1.5} />}
        {visibleLines['MACD Histogram'] && <Bar dataKey="MACD Histogram" barSize={20} fill="#D4A3FD" />}
      </ComposedChart>
    </Paper>
  );
};

export default MACDChart;
