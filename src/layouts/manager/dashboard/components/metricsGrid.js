/* eslint-disable react/prop-types */
import React from "react";
import { Grid } from "@mui/material";
import { formatTime, safeNumberFormat } from "../utils/formatUtils";
import MDBox from "components/MDBox";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

const MetricsGrid = ({ stats }) => (
  <Grid container spacing={3}>
    <Grid item xs={12} md={6} lg={3}>
      <MDBox mb={1.5}>
        <ComplexStatisticsCard
          color={(stats?.retardRate || 0) > 25 ? "error" : "success"}
          icon="timer"
          title="Taux de Retard"
          count={`${safeNumberFormat(stats?.retardRate)}%`}
          percentage={{
            color: (stats?.retardRate || 0) > 25 ? "error" : "success",
            amount: (stats?.retardRate || 0) > 25 ? "↑" : "↓",
            label: "taux de ponctualité",
          }}
        />
      </MDBox>
    </Grid>
    <Grid item xs={12} md={6} lg={3}>
      <MDBox mb={1.5}>
        <ComplexStatisticsCard
          icon="check_circle"
          color="info"
          title="Respect des Échéances"
          count={`${safeNumberFormat(stats?.respectEcheanceRate)}%`}
          percentage={{
            color: (stats?.respectEcheanceRate || 0) >= 75 ? "success" : "warning",
            amount: (stats?.respectEcheanceRate || 0) >= 75 ? "↑" : "↓",
            label: `${stats?.tasksInLate || 0} tâches en retard`,
          }}
        />
      </MDBox>
    </Grid>
    <Grid item xs={12} md={6} lg={3}>
      <MDBox mb={1.5}>
        <ComplexStatisticsCard
          color="success"
          icon="sentiment_satisfied"
          title="Satisfaction"
          count={`${safeNumberFormat(stats?.positiveRate)}%`}
          percentage={{
            color: (stats?.positiveRate || 0) >= 80 ? "success" : "warning",
            amount: "",
            label:
              (stats?.negativeRate || 0) > 0
                ? `${safeNumberFormat(stats?.negativeRate)}% retours négatifs`
                : "Aucun retour négatif",
          }}
        />
      </MDBox>
    </Grid>
    <Grid item xs={12} md={6} lg={3}>
      <MDBox mb={1.5}>
        <ComplexStatisticsCard
          color={
            (stats?.productivityScore || 0) >= 70
              ? "success"
              : (stats?.productivityScore || 0) >= 50
              ? "warning"
              : "error"
          }
          icon="speed"
          title="Productivité"
          count={`${safeNumberFormat(stats?.productivityScore)}/100`}
          percentage={{
            color: "info",
            amount: "",
            label: `Complétion: ${safeNumberFormat(stats?.taskCompletionRate)}%`,
          }}
        />
      </MDBox>
    </Grid>
  </Grid>
);

export default MetricsGrid;
