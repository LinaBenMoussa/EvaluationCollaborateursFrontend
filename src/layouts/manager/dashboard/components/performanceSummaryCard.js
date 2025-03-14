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
              <MDBox
                sx={{
                  height: 8,
                  width: "100%",
                  borderRadius: 10,
                  background: "#f0f0f0",
                  mt: 0.5,
                  overflow: "hidden",
                }}
              >
                <MDBox
                  sx={{
                    height: "100%",
                    width: `${performanceScore}%`,
                    borderRadius: 10,
                    background: `var(--${overallStatus.color})`,
                  }}
                />
              </MDBox>
            </MDBox>
          </MDBox>
        </Grid>
        <Grid item xs={12} md={4}>
          <MDBox>
            <MDTypography variant="subtitle2" color="text">
              Heures travaillées: <strong>{formatTime(stats?.dailyAvgWorkingHours)}/jour</strong>
            </MDTypography>
            <MDTypography variant="subtitle2" color="text">
              Complexité moyenne des tâches:{" "}
              <strong>
                {stats?.taskComplexityScore !== null
                  ? safeNumberFormat(stats?.taskComplexityScore) + "/5"
                  : "N/A"}
              </strong>
            </MDTypography>
            <MDTypography variant="subtitle2" color="text">
              Temps moyen de retard: <strong>{formatTime(stats?.tempsMoyenRetard)}</strong>
            </MDTypography>
          </MDBox>
        </Grid>
      </Grid>
    </MDBox>
  </Card>
);

export default PerformanceSummaryCard;
