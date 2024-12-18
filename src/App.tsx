import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './components/AppRoutes';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';
import './global.css';

const App: React.FC = () => {

    return (
        <Router>
            <Navbar />
            <div style={{ paddingTop: '100px' }}> </div>
            <AppRoutes />
            <Footer />
            <ScrollToTopButton />
        </Router>
    );
};

export default App;
