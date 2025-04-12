/* eslint-disable react/prop-types */
import React from "react";
import { Grid, Card } from "@mui/material";
import { formatTime, safeNumberFormat } from "../utils/formatUtils";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const PerformanceSummaryCard = ({
  selectedCollaborateur,
  overallStatus,
  performanceScore,
  stats,
}) => (
  <Card sx={{ mb: 3 }}>
    <MDBox p={3}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={8}>
          <MDBox>
            <MDTypography variant="h4" fontWeight="medium">
              {selectedCollaborateur?.nom || ""} {selectedCollaborateur?.prenom || ""}
            </MDTypography>
            <MDTypography variant="body2" color="text">
              Performance globale:{" "}
              <span style={{ fontWeight: "bold", color: `var(--${overallStatus.color})` }}>
                {overallStatus.text}
              </span>
            </MDTypography>
            <MDBox mt={1} mb={2}>
              <MDTypography variant="body2" color="text">
                Score: {safeNumberFormat(performanceScore)}/100
              </MDTypography>
            </MDBox>
          </MDBox>
        </Grid>
        <Grid item xs={12} md={4}>
          <MDBox>
            <MDTypography variant="subtitle2" color="text">
              Heures travaillées: <strong>{formatTime(stats?.dailyAvgWorkingHours)}/jour</strong>
            </MDTypography>
          </MDBox>
        </Grid>
      </Grid>
    </MDBox>
  </Card>
);

export default PerformanceSummaryCard;
