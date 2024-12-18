import React from "react";
import { Card, CardContent, Grid, Typography } from "@mui/material";

interface CompanyDetailsCardProps {
  data: any;
}

const CompanyDetailsCard: React.FC<CompanyDetailsCardProps> = ({ data }) => {
  const lowPercentage =
    ((data.price - data.number_52_week_low) /
      (data.number_52_week_high - data.number_52_week_low)) *
    100;

  return (
    <div>
      <Card
        variant="outlined"
        style={{ marginBottom: "20px", backgroundColor: "#f0f0f0", 
          boxShadow: '0 4px 8px 0 #c6f5e4, 0 6px 20px 0 #c6f5e4'  }}
      >
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Typography variant="h4" style={{ color: "#002060" }}>
                <strong> {data.security_code}</strong>
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h5" style={{ color: "#002060" }}>
                <strong> {data.company}</strong>
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography
                sx={{
                  textAlign: "center",
                  color: "#000000",
                }}
              >
               <strong>52 Week L/H</strong> 
              </Typography>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                  marginTop: "20px",
                  position: "relative",
                }}
              >
                {/* 52 Week Low Label */}
                <Typography
                  variant="body1"
                  style={{
                    position: "absolute",
                    left: "0",
                    top: "-20px",
                    fontWeight: "bold",
                  }}
                >
                  L
                </Typography>
                <Typography
                  variant="body1"
                  style={{
                    position: "absolute",
                    left: "0",
                    bottom: "-25px",
                    fontWeight: "bold",
                  }}
                >
                  ${data.number_52_week_low.toFixed(1)}
                </Typography>
                <div
                  style={{
                    position: "relative",
                    height: "10px",
                    flexGrow: 1,
                    backgroundColor: "#002060",
                    margin: "0 20px",
                    backgroundImage: "linear-gradient(to right, red, green)",
                  }}
                >
                  {/* Current Price Line */}
                  <div
                    style={{
                      position: "absolute",
                      left: `${lowPercentage}%`,
                      top: "0",
                      height: "100%",
                      width: "5px",
                      backgroundColor: "#3103AB",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: "-25px",
                        left: "-10px",
                        fontWeight: "bold",
                      }}
                    >
                      ${data.price.toFixed(1)}
                    </span>
                  </div>
                </div>
                {/* 52 Week High Label */}
                <Typography
                  variant="body1"
                  style={{
                    position: "absolute",
                    right: "0",
                    top: "-20px",
                    fontWeight: "bold",
                  }}
                >
                  H
                </Typography>
                <Typography
                  variant="body1"
                  style={{
                    position: "absolute",
                    right: "0",
                    bottom: "-25px",
                    fontWeight: "bold",
                  }}
                >
                  ${data.number_52_week_high.toFixed(1)}
                </Typography>
              </div>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1">
                <strong>Price:</strong> $
                {Number(data.price.toFixed(2)).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1">
                <strong>Market Capitalization:</strong> $
                {Number(data.marketcapitalization.toFixed(0)).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1">
                <strong>Market Cap Dominance:</strong>{" "}
                {Number(data.marketcapdominance.toFixed(2)).toLocaleString()}%
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1">
                <strong>Circulating Supply:</strong>{" "}
                {Number(data.circulatingsupply.toFixed(0)).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1">
                <strong>Max Supply:</strong>{" "}
                {Number(
                  data.maxsupply === 0 ? "Not Available" : data.maxsupply
                ).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1">
                <strong>Website URL:</strong>{" "}
                <a href={data.weburl} target="_blank" rel="noopener noreferrer">
                  {data.weburl}
                </a>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};
export default CompanyDetailsCard;
