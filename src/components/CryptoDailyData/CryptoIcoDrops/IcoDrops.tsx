import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from 'src/api';

export interface IcoData {
  id: number;
  date: string;
  project: string;
  ticker: string;
  overview: string;
  round: string;
  total_raised: string;
  pre_valuation: string;
  total_rounds: number;
  investors: string;
  ecosystem: string;
  token_type: string;
  categories: string;
  listing_date: string;
  project_website: string;
  whitepaper: string;
  linkedin: string | null;
  twitter: string | null;
  telegram_chat: string | null;
  github: string | null;
  discord: string | null;
  reddit: string | null;
  youtube: string | null;
  other: string | null;
  source: string;
  created_at: string;
  updated_at: string;
}

const IcoDrops: React.FC = () => {
  const [activeIcos, setActiveIcos] = useState<IcoData[]>([]);
  const [alreadyListed, setAlreadyListed] = useState<IcoData[]>([]);
  const [upcomingIcos, setUpcomingIcos] = useState<IcoData[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/api/crypto-ico-data/`)
      .then(response => {
        setActiveIcos(response.data.active);
        setUpcomingIcos(response.data.upcoming);
        setAlreadyListed(response.data.already_listed)
      })
      .catch((error: any) => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  const handleCardClick = (ico: IcoData) => {
    navigate(`/ico-monitor/${ico.project}`, { state: { ico } });
  };

  const renderCard = (ico: IcoData, index: number) => {
    const backgroundColors = [ '#e0f7fa', '#e6ffee','#f9f9f9','#ffece6'];

    return (
      <Grid item xs={12} sm={6} md={3} key={ico.project}>
        <Card
          onClick={() => handleCardClick(ico)}
          sx={{
            cursor: 'pointer',
            backgroundColor: backgroundColors[index % 4],
            boxShadow: 3,
            transition: '0.3s',
            '&:hover': {
              boxShadow: 6,
            },
          }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight="bold" fontSize="1.2rem" color='#270259'>{ico.project}</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">Ticker:</Typography>
                <Typography variant="body2" fontWeight="bold">{ico.ticker}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">Listing Date:</Typography>
                <Typography variant="body2">{ico.listing_date}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">Round:</Typography>
                <Typography variant="body2">{ico.round}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">Total Raised:</Typography>
                <Typography variant="body2">{ico.total_raised}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <Box p={3} display="flex" flexDirection="column" alignItems="center">
      <Box width="100%" maxWidth="1200px" margin="0 auto">
      <Tabs
  value={selectedTab}
  onChange={(e, newValue) => setSelectedTab(newValue)}
  centered
  sx={{
    "& .MuiTab-root": {
      color: "#002060", // Text color for all tabs
    },
    "& .Mui-selected": {
      color: "#002060", // Text color for selected tab
    },
    "& .MuiTabs-indicator": {
      backgroundColor: "#002060", // Indicator color for the selected tab
    },
  }}
>
  <Tab label={`Upcoming (${upcomingIcos.length})`} />
  <Tab label={`Active (${activeIcos.length})`} />
  <Tab label={`Recently Listed (${alreadyListed.length})`} />
</Tabs>


        {selectedTab === 0 && (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {upcomingIcos.map((ico, index) => renderCard(ico, index))}
          </Grid>
        )}

        {selectedTab === 1 && (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {activeIcos.map((ico, index) => renderCard(ico, index))}
          </Grid>
        )}

        {selectedTab === 2 && (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {alreadyListed.map((ico, index) => renderCard(ico, index))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default IcoDrops;
