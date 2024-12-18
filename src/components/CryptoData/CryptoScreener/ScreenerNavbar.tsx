import React, { useState } from 'react';
import { Tabs, Tab } from '@mui/material';
import './ScreenerNavbar.css';
import FiltersData from './Tabs/FiltersData';
import ScreenerTable, { CryptoData } from './Tabs/ScreenerTable';
import FundamentalTabContent from './Tabs/FundamentalTabContent ';
import QuantitativeTabContent from './Tabs/QuantitativeTabContent ';
import RiskTabContent from './Tabs/RiskTabContent';
import TechnicalTabContent from './Tabs/TechnicalTabContent ';
import api from 'src/api';


const ScreenerNavbar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [responseData, setResponseData] = useState<CryptoData[]>([]);
  
  const [selectedDataset, setSelectedDataset] = useState<{ [tab: string]: { [field: string]: string[] } }>({
    Quantitative: {},
    Fundamental: {},
    Technical: {},
    Risk: {},
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSelectionChange = (tabName: string, fieldName: string, values: string[]) => {
    setSelectedDataset((prevSelectedDataset) => ({
      ...prevSelectedDataset,
      [tabName]: {
        ...prevSelectedDataset[tabName],
        [fieldName]: values,
      },
    }));
  };

  const handleApply = async () => {
    const response = await api.post(
      `/api/crypto-super-screener-filter/`,
      selectedDataset
    );
    console.log(response.data, typeof(response.data), "-------------------------")
    setResponseData(response.data)
  };

  const handleReset = () => {
    window.location.reload();
  };
  

  const tabContainerStyle = {
    backgroundColor: '#000000',
    display: 'flex',
    justifyContent: 'center',
  };

  const tabStyle = {
    color: '#FFFFFF',
    fontWeight: 'bold',
  };

  const activeTabStyle = {
    color: '#FFA500',
    fontWeight: 'bold',
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <QuantitativeTabContent
            onSelectionChange={(fieldName, values) =>
              handleSelectionChange('Quantitative', fieldName, values)
            }
            selectedValues={selectedDataset.Quantitative}
          />
        );
      case 1:
        return (
          <FundamentalTabContent
            onSelectionChange={(fieldName, values) =>
              handleSelectionChange('Fundamental', fieldName, values)
            }
            selectedValues={selectedDataset.Fundamental}
          />
        );
      case 2:
        return (
          <TechnicalTabContent
            onSelectionChange={(fieldName, values) =>
              handleSelectionChange('Technical', fieldName, values)
            }
            selectedValues={selectedDataset.Technical}
          />
        );
      case 3:
        return (
          <RiskTabContent
            onSelectionChange={(fieldName, values) =>
              handleSelectionChange('Risk', fieldName, values)
            }
            selectedValues={selectedDataset.Risk}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className='tabnavbar' style={tabContainerStyle}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Quantitative" style={activeTab === 0 ? activeTabStyle : tabStyle} />
          <Tab label="Fundamental" style={activeTab === 1 ? activeTabStyle : tabStyle} />
          <Tab label="Technical" style={activeTab === 2 ? activeTabStyle : tabStyle} />
          <Tab label="Risk" style={activeTab === 3 ? activeTabStyle : tabStyle} />
        </Tabs>
      </div>
      <div>{renderTabContent()}</div>
      <FiltersData
        filters={selectedDataset[activeTab === 0 ? 'Quantitative' : activeTab === 1 ? 'Fundamental' : activeTab === 2 ? 'Technical' : 'Risk']}
        onApply={handleApply}
        onReset={handleReset}
      />
      <ScreenerTable
        filters={{}}
        data1={responseData}
        onApply={handleApply}
        onReset={handleReset}
      />
    </div>
  );
};

export default ScreenerNavbar;
