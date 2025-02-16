/* eslint-disable react/prop-types */
import React from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";

const FeedbackList = ({ feedbacks }) => {
  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={2}>
        {feedbacks.map((feedback, index) => (
          <Grid item xs={12} sm={6} key={index}>
            {feedback}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeedbackList;
