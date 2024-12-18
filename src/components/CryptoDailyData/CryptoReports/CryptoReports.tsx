import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  Box,
} from "@mui/material";
import cryptoReportVideo from "../../../asserts/videos/CryptoReportCard.mp4"; // Import the video file
import api from "src/api";

interface Report {
  id: number;
  start_date: string;
  end_date: string;
  title: string;
  quarter: string;
  document: string;
}

const CryptoReports = () => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    api
      .get(`/reports/`)
      .then((response) => response.data)
      .then((data) => setReports(data))
      .catch((error) => console.error("Error fetching reports:", error));
  }, []);

  const handleCardClick = (documentUrl: string) => {
    if (documentUrl) {
      window.open(documentUrl, "_blank");
    } else {
      console.error("Document URL is not available");
    }
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    const start = new Date(startDate).toLocaleDateString(undefined, options);
    const end = new Date(endDate).toLocaleDateString(undefined, options);
    return `${start} to ${end}`;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ maxWidth: 1200, margin: "10px", padding: "16px" }}>
        <Typography
          variant="h5"
          gutterBottom
          fontFamily={"Roboto, sans-serif"}
          sx={{ color: "#002060", fontWeight: "bold", marginBottom: "20px" }}
        >
          {" "}
          Crypto Industry Report
        </Typography>
        <Grid container spacing={2}>
          {reports.map((report) => (
            <Grid item xs={12} sm={6} md={2.4} key={report.id}>
              <Box
                onClick={() => handleCardClick(report.document)}
                sx={{ cursor: "pointer", position: "relative" }}
              >
                <Card
                  sx={{
                    height: "250px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    color: "#fff",
                    position: "relative",
                    overflow: "hidden", // Ensures video does not overflow card
                    padding: 2,
                    marginBottom: '16px', 
                    boxShadow: '0 4px 8px 0 #c6f5e4, 0 6px 20px 0 #c6f5e4' 
                  }}
                >
                  {/* Video Element for Background */}
                  <video
                    src={cryptoReportVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      zIndex: 0, // Ensures the video is behind the content
                    }}
                  />
                  <CardContent
                    sx={{ flexGrow: 1, position: "relative", zIndex: 1 }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ color: "#FFFFFF", fontWeight: "bold" }}
                    >
                      {new Date(report.start_date).toLocaleDateString("en-US", {
                        month: "long",
                      })}{" "}
                      &nbsp;
                      {report.quarter} Report{" "}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#FFFFFF", marginTop: 1 }}
                    ></Typography>
                    <Typography
                      sx={{
                        position: "absolute",
                        bottom: 16,
                        left: 16,
                        color: "#FFFFFF",
                        fontSize: "0.75rem",
                      }}
                    >
                      {formatDateRange(report.start_date, report.end_date)}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default CryptoReports;
