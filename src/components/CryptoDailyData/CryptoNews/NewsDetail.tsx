import React from "react";
import { Container, Typography, Paper, Box, Button } from "@mui/material";
import { useLocation } from "react-router-dom";
import NewsList from "./NewsList";
import { NewsItem } from "src/types/newsTypes";

const NewsDetail: React.FC = () => {
  const location = useLocation();
  const { newsItem } = location.state as { newsItem: NewsItem };
  const filters = { 'ticker_list': [newsItem.ticker.split('-')[0]] };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 2, boxShadow: 6 }}>
        <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: '#35092e',
          textAlign: 'center',
          mb: 4, // Add margin-bottom for spacing
          borderBottom: 2,
          borderColor: '#f3ead9',
          pb: 1, // Padding-bottom to create space between text and border
        }}
      >
        {newsItem.heading}
      </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography 
            variant="subtitle1" 
            color="textSecondary" 
            sx={{ fontWeight: 'medium' }}
          >
            Posted on <span style={{ fontWeight: 'bold' }}>{newsItem.date}</span>
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 'bold',
              color: '#f91a2b',
              fontSize: '1.1rem',
            }}
          >
            {newsItem.ticker}
          </Typography>
        </Box>
        <Typography 
          variant="body1" 
          component="div" 
          sx={{ 
            mb: 3, 
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap'
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: newsItem.description || "No description available" }} />
        </Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2,fontSize:'11px' ,color:'#fff',backgroundColor:'#333', fontWeight: 'bold'}}
          onClick={() => window.history.back()}
        >
          Back to News List
        </Button>
      </Paper>
      <Box sx={{ mt: 4 }}>
      <NewsList filters={filters}  Heading={`Similar news related to ${newsItem.ticker}`} id={newsItem.id}/>
      </Box>
    </Container>
  );
};

export default NewsDetail;
