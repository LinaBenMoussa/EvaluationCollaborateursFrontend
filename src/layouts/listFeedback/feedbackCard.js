/* eslint-disable react/prop-types */
import React from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";

const FeedbackCard = ({ manager, comment, dateTime, isNegative }) => {
  const bgColor = isNegative ? "#ffdddd" : "#ddffdd";
  const borderColor = isNegative ? "#ff4d4d" : "#4caf50";

  return (
    <Card
      sx={{
        backgroundColor: bgColor,
        borderLeft: `6px solid ${borderColor}`,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {manager}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {dateTime}
          </Typography>
        </Box>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body1" color="text.secondary">
            {comment}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FeedbackCard;
