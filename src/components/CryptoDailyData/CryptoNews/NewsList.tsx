import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Box,
  Pagination,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getNews } from "src/hooks/getNews";
import { NewsItem } from "src/types/newsTypes";
import Loading from "src/components/Loading";

interface NewsListProps {
  filters?: object;
  Heading: string;
  id?: number;
}

const NewsList: React.FC<NewsListProps> = ({ filters = {}, Heading, id }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const theme = useTheme();
  const offset_value = (page - 1) * 10;

  const memoizedFilters = useMemo(() => filters, [JSON.stringify(filters)]);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getNews({
          ...memoizedFilters,
          offset: offset_value,
        });
        setNews(data.news || []);
        setTotalPages(Math.ceil(data.total_count / 10));
      } catch (error) {
        setError("Error fetching news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [memoizedFilters, page]);

  const handleNewsClick = (newsItem: NewsItem) => {
    navigate(`/news/${newsItem.id}`, { state: { newsItem } });
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return new Intl.DateTimeFormat("en-GB", options).format(date);
  };

  if (loading) return <Loading />;
  if (error)
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );

  const filteredNews = news.filter(
    (item) => id === undefined || item.id !== id
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {filteredNews.length > 0 ? (
        <>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              mb: 4,
              fontWeight: "bold",
              color: "#140043",
              textAlign: "center",
            }}
          >
            {Heading}
          </Typography>
          <Grid container spacing={3}>
            {filteredNews
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((item) => (
                <Grid item xs={12} key={item.id}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      cursor: "pointer",
                      width: "100%",
                      borderRadius: 2,
                      boxShadow: 3,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <Typography
                      variant="body1"
                      gutterBottom
                      onClick={() => handleNewsClick(item)}
                      sx={{ color: "#013654", fontWeight: "bold" }}
                    >
                      {item.heading}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        gutterBottom
                      >
                        Posted on {formatDate(item.date)}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color={theme.palette.success.main}
                        gutterBottom
                      >
                        <span style={{ fontWeight: "bold", color: "#5900c1" }}>
                          {item.ticker}
                        </span>
                      </Typography>
                    </Box>
                    <DescriptionWithReadMore
                      description={item.description}
                      onReadMore={() => handleNewsClick(item)}
                    />
                  </Paper>
                </Grid>
              ))}
          </Grid>
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: "50%",
                  border: `1px solid ${theme.palette.divider}`,
                },
                "& .Mui-selected": {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                },
              }}
            />
          </Box>
        </>
      ) : (
        <Typography variant="h6" gutterBottom color="textSecondary">
          No {Heading} available
        </Typography>
      )}
    </Container>
  );
};

interface DescriptionWithReadMoreProps {
  description: string | null;
  onReadMore: () => void;
}

const DescriptionWithReadMore: React.FC<DescriptionWithReadMoreProps> = ({
  description,
  onReadMore,
}) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (descriptionRef.current) {
      setIsOverflowing(
        descriptionRef.current.scrollHeight >
          descriptionRef.current.clientHeight
      );
    }
  }, [description]);

  return (
    <>
      <Box
        ref={descriptionRef}
        sx={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          WebkitLineClamp: 3,
          lineClamp: 3,
          mb: 1,
        }}
      >
        <Typography variant="body2" component="div">
          <div dangerouslySetInnerHTML={{ __html: description || "" }} />
        </Typography>
      </Box>
      {isOverflowing && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            variant="contained"
            onClick={onReadMore}
            sx={{ fontSize: "11px", backgroundColor: "#00855f" }}
          >
            Read more
          </Button>
        </Box>
      )}
    </>
  );
};

export default NewsList;
