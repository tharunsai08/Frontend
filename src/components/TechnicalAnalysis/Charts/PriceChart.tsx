import React, { useState } from 'react';
import { Paper, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';
import { ComposedChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, TooltipProps } from 'recharts';

interface PriceChartProps {
  data: any;
}

interface CustomLegendPayload {
  value: string;
  type: 'line' | 'square';
  color: string;
  id: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  const [visibleLines, setVisibleLines] = useState({
    close: true,
    MA9: true,
    MA26: true,
    MA50: true,
    MA100: true,
    MA200: true,
  });

  const handleLegendClick = (dataKey: string | number | ((obj: any) => any) | undefined) => {
    if (typeof dataKey === 'string') {
      setVisibleLines(prevState => ({
        ...prevState,
        [dataKey]: !prevState[dataKey as keyof typeof prevState]
      }));
    }
  };

  const toggleLineVisibility = (key: keyof typeof visibleLines) => {
    setVisibleLines(prevState => ({
      ...prevState,
      [key]: !prevState[key]
    }));
  };

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

  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper style={{ padding: '10px' }}>
        <Typography variant="body2">{` ${(payload[0].payload.date)}`}</Typography>
        {payload.map((item, index) => (
            <Typography key={index} variant="body2" style={{ color: item.color }}>
              {item.name}: {formatNumber(item.value as number)}
            </Typography>
          ))}
        </Paper>
      );
    }

    return null;
  };

  const formattedData = data.output_ma_prices[0].data.map((item: any, index: number) => ({
    date: item[0],
    open: item[1],
    high: item[2],
    low: item[3],
    close: item[4],
    MA9: data.output_ma_prices[1].data[index][1],
    MA26: data.output_ma_prices[2].data[index][1],
    MA50: data.output_ma_prices[3].data[index][1],
    MA100: data.output_ma_prices[4].data[index][1],
    MA200: data.output_ma_prices[5].data[index][1]
  }));

  const StyledButton = styled(Button)(({ isActive, lineColor }: { isActive: boolean; lineColor: string; }) => ({
    borderBottom: `2px solid ${isActive ? lineColor : 'transparent'}`,
    color: isActive ? lineColor : 'inherit', // Use 'inherit' for default text color
    margin: '0 8px', // Add margin between buttons
  }));

  return (
    <Paper style={{ marginTop: '20px', padding: '20px' }}>
      <Typography variant="h6" align="center" style={{ color: '#002060', fontWeight: 'bold', marginTop: '10px' }}>
        Price and Moving Averages
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
        <StyledButton
          isActive={visibleLines.close}
          onClick={() => toggleLineVisibility('close')}
          lineColor="#413ea0"
        >
          Price
        </StyledButton>
        <StyledButton
          isActive={visibleLines.MA9}
          onClick={() => toggleLineVisibility('MA9')}
          lineColor="#00A878"
        >
          MA9
        </StyledButton>
        <StyledButton
          isActive={visibleLines.MA26}
          onClick={() => toggleLineVisibility('MA26')}
          lineColor="#F633FF"
        >
          MA26
        </StyledButton>
        <StyledButton
          isActive={visibleLines.MA50}
          onClick={() => toggleLineVisibility('MA50')}
          lineColor="#0078FF"
        >
          MA50
        </StyledButton>
        <StyledButton
          isActive={visibleLines.MA100}
          onClick={() => toggleLineVisibility('MA100')}
          lineColor="#FDCA40"
        >
          MA100
        </StyledButton>
        <StyledButton
          isActive={visibleLines.MA200}
          onClick={() => toggleLineVisibility('MA200')}
          lineColor="#FF3339"
        >
          MA200
        </StyledButton>
      </div>
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
            { value: 'Price', type: 'square', color: '#413ea0', id: 'close' },
            { value: 'MA9', type: 'line', color: '#00A878', id: 'MA9' },
            { value: 'MA26', type: 'line', color: '#CACF85', id: 'MA26' },
            { value: 'MA50', type: 'line', color: '#0078FF', id: 'MA50' },
            { value: 'MA100', type: 'line', color: '#FDCA40', id: 'MA100' },
            { value: 'MA200', type: 'line', color: '#F79824', id: 'MA200' },
          ] as CustomLegendPayload[]}
        />
        <CartesianGrid stroke="#f5f5f5" />
        {visibleLines.close && <Line type="monotone" dataKey="close"stroke="#2b0045" name='Price' dot={false} strokeWidth={2} />}
        {visibleLines.MA9 && <Line type="monotone" dataKey="MA9" stroke="#00A878" dot={false} strokeWidth={2} />}
        {visibleLines.MA26 && <Line type="monotone" dataKey="MA26" stroke="#F633FF" dot={false} strokeWidth={2} />}
        {visibleLines.MA50 && <Line type="monotone" dataKey="MA50" stroke="#0078FF" dot={false} strokeWidth={2} />}
        {visibleLines.MA100 && <Line type="monotone" dataKey="MA100" stroke="#FDCA40" dot={false} strokeWidth={2} />}
        {visibleLines.MA200 && <Line type="monotone" dataKey="MA200" stroke="#FF3339" dot={false} strokeWidth={2} />}
      </ComposedChart>
    </Paper>
  );
};

export default PriceChart;
