// components/TradingViewTickerTape.tsx
import React from 'react';

const TradingViewTickerTape: React.FC = () => {
    React.useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
            // colorTheme: 'dark',
            headline: 'Crypto Ticker',
            symbols: [
                { proName: 'BINANCE:BTCUSDT', title: 'BTC/USDT' },
                { proName: 'BINANCE:ETHUSDT', title: 'ETH/USDT' },
                { proName: 'FOREXCOM:SPXUSD', title: 'S&P 500' },
                { proName: 'FOREXCOM:NSXUSD', title: 'Nasdaq 100' },
                { proName: 'FX_IDC:EURUSD', title: 'EUR/USD' },
                { proName: 'BITSTAMP:BTCUSD', title: 'BTC/USD' },
                { proName: 'CAPITALCOM:UK100', title: 'UK 100' },
                { proName: 'XETR:DAX', title: 'DAX' },
                { proName: 'BSE:SENSEX', title: 'SENSEX' },
                { proName: 'SSE:000062', title: 'SSE' },
            ],
            showSymbolLogo: true,
            colorTheme: 'light',
            isTransparent: false,
            displayMode: 'adaptive',
            locale: 'en',
        });
        document.getElementById('tradingview-ticker-tape')?.appendChild(script);
    }, []);

    return <div id="tradingview-ticker-tape" style={{ width: '100%', height: '50px', position: 'fixed', top: 0, left: 0, zIndex: 1000,overflow:'hidden' }}></div>;
};

export default TradingViewTickerTape;
