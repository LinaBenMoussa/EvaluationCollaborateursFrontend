/* eslint-disable react/prop-types */
import React from "react";
import { Box, Grid, Fade } from "@mui/material";

const FeedbackList = ({ feedbacks }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {feedbacks.map((feedback, index) => (
          <Fade key={index} in={true} timeout={500 * (index + 1)}>
            <Grid item xs={12} sm={6} md={4}>
              {feedback}
            </Grid>
          </Fade>
        ))}
      </Grid>
      {feedbacks.length === 0 && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={300}
          color="text.secondary"
        >
          Aucun feedback trouvé
        </Box>
      )}
    </Box>
  );
};

export default FeedbackList;
