/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import { motion } from "framer-motion";

export default function LikeDislikeButtons({ type, setType }) {
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    if (type === "") {
      setSelected(null);
    }
  }, [type]);

  return (
    <Box display="flex" justifyContent="center" gap={3} mt={4}>
      <motion.div whileTap={{ scale: 1.2 }}>
        <IconButton
          onClick={() => {
            setType("positif");
            setSelected("positif");
          }}
          sx={{
            color: selected === "positif" ? "green" : "gray",
            transition: "0.3s ease",
          }}
        >
          <ThumbUp fontSize="large" />
        </IconButton>
      </motion.div>

      {/* Bouton Dislike */}
      <motion.div whileTap={{ scale: 1.2 }}>
        <IconButton
          onClick={() => {
            setType("negatif");
            setSelected("negatif");
          }}
          sx={{
            color: selected === "negatif" ? "red" : "gray",
            transition: "0.3s ease",
          }}
        >
          <ThumbDown fontSize="large" />
        </IconButton>
      </motion.div>
    </Box>
  );
}
