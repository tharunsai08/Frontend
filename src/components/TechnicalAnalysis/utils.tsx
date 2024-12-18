// utils.ts
export const getActionColor = (action: string) => {
  if (action === 'Bullish' || action === 'Very Bullish' || action === 'OverSold' || action === 'Less Volatile') {
    return '#136F63'; // Green color
  } else if (action === 'Bearish' || action === 'Very Bearish' || action === 'OverBought' || action === 'Very Volatile'|| action === 'Volatile') {
    return '#F52A4C'; // Orange color
  }
  return '#FFA500'; // Red color for remaining values
};
