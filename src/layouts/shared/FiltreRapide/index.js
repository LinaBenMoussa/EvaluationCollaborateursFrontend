/* eslint-disable react/prop-types */
import { Paper, Chip } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import CloseIcon from "@mui/icons-material/Close";
import filtreRapideStyles from "./filtreRapideStyle"; // Import styles
import React from "react";

const FiltreRapide = ({
  theme,
  isMobile,
  activeFilters,
  handleResetFilters,
  setFilters,
  children1,
  children2,
}) => {
  const classes = filtreRapideStyles(theme);

  return (
    <Paper elevation={0} sx={classes.paper}>
      <MDBox sx={classes.box(isMobile)}>
        {children1}
        {activeFilters > 0 && (
          <MDButton
            variant="outlined"
            color="error"
            size="small"
            onClick={handleResetFilters}
            sx={classes.button}
            startIcon={<CloseIcon />}
          >
            Réinitialiser les filtres
          </MDButton>
        )}
      </MDBox>

      <MDBox display="flex" flexWrap="wrap" gap={1} mt={2}>
        {children2}
      </MDBox>
    </Paper>
  );
};

export default FiltreRapide;
