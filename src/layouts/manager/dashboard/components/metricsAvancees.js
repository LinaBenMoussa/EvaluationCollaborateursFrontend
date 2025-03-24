/* eslint-disable react/prop-types */
import { Card, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { formatTime, safeNumberFormat } from "../utils/formatUtils";

export const MetricsAvancees = ({ stats }) => (
  <MDBox mt={3}>
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <MDBox px={3} pt={3}>
            <MDTypography variant="h6" fontWeight="medium">
              Métriques avancées
            </MDTypography>
          </MDBox>
          <MDBox p={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <MDBox mb={2}>
                  <MDTypography variant="subtitle2" color="text" fontWeight="medium">
                    Temps moyen de complétion des tâches
                  </MDTypography>
                  <MDTypography variant="h5">
                    {formatTime(stats?.averageTaskCompletionTime)}
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    par tâche
                  </MDTypography>
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6}>
                <MDBox mb={2}>
                  <MDTypography variant="subtitle2" color="text" fontWeight="medium">
                    Heures de travail non effectuées
                  </MDTypography>
                  <MDTypography
                    variant="h5"
                    color={(stats?.totalHoursMissing || 0) > 1 ? "error" : "text"}
                  >
                    {formatTime(stats?.totalHoursMissing)}
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    total cumulé
                  </MDTypography>
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6}>
                <MDBox mb={2}>
                  <MDTypography variant="subtitle2" color="text" fontWeight="medium">
                    Heures supplémentaires
                  </MDTypography>
                  <MDTypography variant="h5" color="info">
                    {formatTime(stats?.overtimeHours)}
                  </MDTypography>
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6}>
                <MDBox mb={2}>
                  <MDTypography variant="subtitle2" color="text" fontWeight="medium">
                    {"Nombre total de jours de congé utilisés"}
                  </MDTypography>
                  <MDTypography variant="h5">
                    {stats?.congeUtilizationRate !== null
                      ? `${safeNumberFormat(stats?.congeUtilizationRate)} jour`
                      : "N/A"}
                  </MDTypography>
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
        </Card>
      </Grid>
    </Grid>
  </MDBox>
);
