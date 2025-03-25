/* eslint-disable react/prop-types */
import React from "react";
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import {
  Feedback as FeedbackIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
} from "@mui/icons-material";

const FeedbackCard = ({ collaborateur, comment, dateTime, isNegative }) => {
  const bgColor = isNegative ? "#fff0f0" : "#f0fff0";
  const borderColor = isNegative ? "#ff6b6b" : "#4caf50";

  return (
    <Card
      sx={{
        backgroundColor: bgColor,
        borderLeft: `8px solid ${borderColor}`,
        boxShadow: 3,
        borderRadius: 3,
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.02)",
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FeedbackIcon color={isNegative ? "error" : "success"} />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {collaborateur}
            </Typography>
          </Box>
          <Chip
            icon={isNegative ? <ThumbDownIcon /> : <ThumbUpIcon />}
            label={isNegative ? "Négatif" : "Positif"}
            color={isNegative ? "error" : "success"}
            size="small"
          />
        </Box>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 1,
            p: 1,
            backgroundColor: "rgba(255,255,255,0.7)",
            borderRadius: 2,
          }}
        >
          {comment}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", textAlign: "right" }}
        >
          {dateTime}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FeedbackCard;
