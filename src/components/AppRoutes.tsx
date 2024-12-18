import React from "react";
import { Routes, Route } from "react-router-dom";
import Myportfolio from "./CryptoIndicators/Myportfolio";
import CryptoMonitor from "./CryptoData/CryptoMonitor";
import IndexWizard from "./CryptoData/IndexWizard/IndexWizard";
import MyWatchlists from "./CryptoData/MyWatchlists";
import TechnicalAnalysis from "./CryptoData/TechnicalAnalysis";
import ScreenerMain from "./CryptoData/CryptoScreener/ScreenerMain";
import CryptoNewsForm from "./CryptoDailyData/CryptoNews/CryptoNewsForm";
import NewsList from "./CryptoDailyData/CryptoNews/NewsList";
import NewsDetail from "./CryptoDailyData/CryptoNews/NewsDetail";
import Login from "./Login";
import Signup from "./Signup";
import IcoDrops from "./CryptoDailyData/CryptoIcoDrops/IcoDrops";
import ProtectedRoute from "./ProtectedRoute";
import IcoDetail from "./CryptoDailyData/CryptoIcoDrops/IcoDetail";
import DailyIcoPost from "./CryptoDailyData/CryptoIcoDrops/DailyIcoPost";
import PerformanceoOerview from "./CryptoDailyData/PerformanceOverview/PerformanceOverview";
import CryptoReports from "./CryptoDailyData/CryptoReports/CryptoReports";
import DailyReportPost from "./CryptoDailyData/CryptoReports/DailyReportPost";
import FormikComponent from "./CryptoData/IndexWizard/FormikContext";
const AppRoutes: React.FC = () => {

  return (
    <Routes>
      <Route path="/" element={<CryptoMonitor />} />
      <Route path="/latest-news"  element={<NewsList Heading="Latest News" />}/>
      <Route path="/performance-overview" element={<PerformanceoOerview />} />
      <Route path="/screener" element={<ProtectedRoute><ScreenerMain /></ProtectedRoute>}/>
      <Route path="/technical-analysis" element={<TechnicalAnalysis />} />
      <Route path="/index-wizard" element={<ProtectedRoute><FormikComponent> <IndexWizard /></FormikComponent></ProtectedRoute>} />
      <Route path="/my-watchlists" element={<ProtectedRoute><MyWatchlists /></ProtectedRoute>}/>
      <Route path="/portfolios" element={<ProtectedRoute><Myportfolio /></ProtectedRoute>}/>
      <Route path="/dailynews" element={<ProtectedRoute superuserOnly={true}><CryptoNewsForm /></ProtectedRoute>} />
      <Route path="/dailyico" element={<ProtectedRoute superuserOnly={true}><DailyIcoPost /></ProtectedRoute>} />
      <Route path="/dailyreport" element={<ProtectedRoute superuserOnly={true}><DailyReportPost /></ProtectedRoute>} />
      <Route path="/news/:id" element={<NewsDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/IcoMonitor" element={<IcoDrops />} />
      <Route path="/ico-detail/:project" element={<IcoDetail />} />
      <Route path="/ico-monitor/:project" element={<IcoDetail />} />
      <Route path="/publications" element={<CryptoReports />} />


      {/* Add other routes here as needed */}
    </Routes>
  );
};

export default AppRoutes;
