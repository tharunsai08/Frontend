import React from 'react';
import CryptoDashboard from '../CryptoMain/Crypto-dashboard';
import CryptoOverview from '../CryptoMain/CryptoOverview';
import CryptoGainersLosers from '../CryptoMain/crypto-gainers-loosers';
import MarketInfo from '../CryptoMain/Market-Info';
import CryptoTopCharts from '../CryptoMain/CryptoTopCharts';

const CryptoMain: React.FC = () => {
  return (
    <>
      <CryptoOverview />
      <CryptoTopCharts />
      <CryptoGainersLosers />
      <MarketInfo />
      <CryptoDashboard />
    </>
  );
};

export default CryptoMain;
