/* eslint-disable react/prop-types */
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ReportsPieChart from "examples/Charts/PieChart";
import reportsLineChartData from "./data/reportsLineChartData";
import AutocompleteField from "layouts/shared/autocompleteField";
import { useEffect, useState } from "react";
import {
  useGetCollaborateursByManagerQuery,
  useGetCollaborateursStatsQuery,
} from "store/api/userApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "store/slices/authSlice";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const [collaborateurId, setCollaborateurId] = useState(null);
  const [selectedCollaborateur, setSelectedCollaborateur] = useState(null);
  const [statsHistory, setStatsHistory] = useState([]);

  const [filterType, setFilterType] = useState("thisMonth");
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(new Date());

  const managerId = useSelector(selectCurrentUser);

  const { data: collaborateurs } = useGetCollaborateursByManagerQuery(managerId);
  useEffect(() => {
    if (collaborateurs && collaborateurs.length > 0 && !selectedCollaborateur) {
      setSelectedCollaborateur(collaborateurs[0]);
      setCollaborateurId(collaborateurs[0].id);
    }
  }, [collaborateurs, selectedCollaborateur]);

  const formatDate = (date) => {
    if (!date) return "";
    if (typeof date === "string") return date;
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("-");
  };

  const updateDatesForFilterType = (type) => {
    const now = new Date();
    let newStart, newEnd;
    switch (type) {
      case "thisWeek":
        {
          const day = now.getDay();
          const diff = now.getDay() === 0 ? -6 : 1 - day;
          newStart = new Date(now);
          newStart.setDate(now.getDate() + diff);
          newEnd = new Date(newStart);
          newEnd.setDate(newStart.getDate() + 6);
        }
        break;
      case "thisMonth":
        newStart = new Date(now.getFullYear(), now.getMonth(), 1);
        newEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case "thisYear":
        newStart = new Date(now.getFullYear(), 0, 1);
        newEnd = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        return;
    }
    setStartDate(newStart);
    setEndDate(newEnd);
  };

  useEffect(() => {
    if (filterType !== "custom") {
      updateDatesForFilterType(filterType);
    }
  }, [filterType]);

  const { data: stats, isLoading } = useGetCollaborateursStatsQuery(
    {
      id: collaborateurId,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    },
    { skip: !collaborateurId || !startDate || !endDate }
  );

  useEffect(() => {
    if (stats && collaborateurId) {
      setStatsHistory((prev) => {
        const isNewCollaborateur = !prev.length || prev[0].collaborateurId !== collaborateurId;
        if (isNewCollaborateur) {
          return [{ ...stats, collaborateurId, timestamp: new Date() }];
        }
        return prev;
      });
    }
  }, [stats, collaborateurId]);

  const formatTime = (hours) => {
    if (hours === null || hours === undefined) return "N/A";
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h${m > 0 ? ` ${m}m` : ""}`;
  };

  const safeNumberFormat = (value, decimals = 1) => {
    if (value === null || value === undefined) return "N/A";
    return typeof value === "number" ? value.toFixed(decimals) : "N/A";
  };

  // Données pour les graphiques
  const taskStatusPieChart = {
    labels: ["Complété à temps", "En retard"],
    datasets: {
      label: "Distribution",
      backgroundColors: ["#4CAF50", "#2196F3", "#F44336"],
      data: stats ? [stats.respectEcheanceRate || 0, 100 - stats.respectEcheanceRate || 0] : [0, 0],
    },
  };

  const retardEvolutionData = {
    labels: ["Semaine 1", "Semaine 2", "Semaine 3", "Semaine 4"],
    datasets: {
      label: "Taux de retard (%)",
      data: stats
        ? [
            (stats.retardRate || 0) * 1.2,
            (stats.retardRate || 0) * 0.9,
            (stats.retardRate || 0) * 1.1,
            stats.retardRate || 0,
          ]
        : [40, 38, 35, 33],
    },
  };

  const performanceRadarData = {
    labels: ["Productivité", "Satisfaction", "Respect délais", "Ponctualité", "Complexité tâches"],
    datasets: {
      label: "Performance",
      data: stats
        ? [
            ((stats.productivityScore || 0) / 100) * 10,
            (stats.positiveRate || 0) / 10,
            (stats.respectEcheanceRate || 0) / 10,
            (100 - (stats.retardRate || 0)) / 10,
            (stats.taskComplexityScore || 0) * 2,
          ]
        : [5, 5, 5, 5, 5],
    },
  };

  const taskCompletionData = {
    labels: ["Retard", "À temps", "En avance"],
    datasets: {
      label: "Tâches",
      data: stats
        ? [
            stats.retardRate || 0,
            stats.respectEcheanceRate || 0,
            Math.max(0, 100 - ((stats.retardRate || 0) + (stats.respectEcheanceRate || 0))),
          ]
        : [33.33, 33.33, 33.33],
    },
  };

  const getOverallStatus = () => {
    if (!stats) return { color: "info", text: "Données insuffisantes" };
    const score = stats?.productivityScore;
    if (score >= 80) return { color: "success", text: "Excellent" };
    if (score >= 65) return { color: "info", text: "Bon" };
    if (score >= 50) return { color: "warning", text: "À améliorer" };
    return { color: "error", text: "Préoccupant" };
  };

  const overallStatus = getOverallStatus();
  const performanceScore = stats?.productivityScore;

  const RadarChart = ({ data, title, color }) => (
    <MDBox textAlign="center" p={3}>
      <MDTypography variant="h6" color={color}>
        {title}
      </MDTypography>
      <MDTypography variant="body2" color="text">
        Composant Radar Chart à implémenter
      </MDTypography>
    </MDBox>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox m={3} display="flex" justifyContent="space-between" alignItems="center">
        <MDBox display="flex" alignItems="center">
          <MDBox mr={2} ml={2} sx={{ width: 280 }}>
            <AutocompleteField
              useFetchHook={() => useGetCollaborateursByManagerQuery(managerId)}
              fullWidth
              setSelectedItem={setSelectedCollaborateur}
              setIdItem={setCollaborateurId}
              selectedItem={selectedCollaborateur}
              label="Choisir un collaborateur"
            />
          </MDBox>
          <MDBox>
            <FormControl fullWidth>
              <InputLabel id="filter-type-label">Période</InputLabel>
              <Select
                labelId="filter-type-label"
                label="Période"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                sx={{ height: "45px", width: "220px", mx: 0.5 }}
              >
                <MenuItem value="thisWeek">Cette semaine</MenuItem>
                <MenuItem value="thisMonth">Ce mois</MenuItem>
                <MenuItem value="thisYear">Cette année</MenuItem>
                <MenuItem value="custom">Personnalisée</MenuItem>
              </Select>
            </FormControl>
          </MDBox>
          {filterType === "custom" && (
            <MDBox>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Date de début"
                    type="date"
                    fullWidth
                    value={formatDate(startDate)}
                    onChange={(e) => setStartDate(new Date(e.target.value))}
                    InputLabelProps={{ shrink: true }}
                    sx={{ height: "45px", width: "220px", mx: 0.5 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Date de fin"
                    type="date"
                    fullWidth
                    value={formatDate(endDate)}
                    onChange={(e) => setEndDate(new Date(e.target.value))}
                    InputLabelProps={{ shrink: true }}
                    sx={{ height: "45px", width: "220px", mx: 0.5 }}
                  />
                </Grid>
              </Grid>
            </MDBox>
          )}
        </MDBox>
      </MDBox>

      {!collaborateurId ? (
        <MDBox p={1} textAlign="center">
          Veuillez sélectionner un collaborateur pour afficher ses statistiques
        </MDBox>
      ) : isLoading ? (
        <MDBox p={1} textAlign="center">
          Chargement des données...
        </MDBox>
      ) : (
        <MDBox py={1}>
          {/* Performance Summary Card */}
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
                      Heures travaillées:{" "}
                      <strong>{formatTime(stats?.dailyAvgWorkingHours)}/jour</strong>
                    </MDTypography>
                    <MDTypography variant="subtitle2" color="text">
                      Complexité moyenne des tâches:{" "}
                      <strong>
                        {stats?.taskComplexityScore !== null
                          ? safeNumberFormat(stats.taskComplexityScore) + "/5"
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

          <MDBox mt={4.5}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={4}>
                <MDBox mb={3}>
                  <ReportsPieChart
                    color="info"
                    title="Distribution des tâches"
                    description="Répartition des tâches selon leur statut"
                    date="Mis à jour à l'instant"
                    chart={taskStatusPieChart}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <MDBox mb={3}>
                  <ReportsLineChart
                    color={(stats?.retardRate || 0) > 25 ? "error" : "success"}
                    title="Évolution des retards"
                    description={
                      <>
                        {(stats?.retardRate || 0) > (stats?.respectEcheanceRate || 0) ? (
                          <>
                            <strong>Attention:</strong> Taux de retard élevé
                          </>
                        ) : (
                          <>
                            <strong>Bien:</strong> Taux de retard contrôlé
                          </>
                        )}
                      </>
                    }
                    date="Tendance sur le dernier mois"
                    chart={retardEvolutionData}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <MDBox mb={3}>
                  <ReportsBarChart
                    color="dark"
                    title="Tâches complétées"
                    description="Performance par rapport aux échéances"
                    date="Données mises à jour aujourd'hui"
                    chart={taskCompletionData}
                  />
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>

          <MDBox mt={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <MDBox px={3} pt={3}>
                    <MDTypography variant="h6" fontWeight="medium">
                      Performance globale
                      <Tooltip title="Évaluation sur plusieurs métriques clés combinées">
                        <InfoIcon fontSize="small" sx={{ ml: 1, verticalAlign: "middle" }} />
                      </Tooltip>
                    </MDTypography>
                  </MDBox>
                  <MDBox p={3} height="400px">
                    <RadarChart
                      data={performanceRadarData}
                      title="Profil de performance"
                      color="info"
                    />
                  </MDBox>
                </Card>
              </Grid>
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
                            Temps moyen de complétion
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
                            Heures manquantes
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
                            {"Taux d'utilisation congés"}
                          </MDTypography>
                          <MDTypography variant="h5">
                            {stats?.congeUtilizationRate !== null
                              ? `${safeNumberFormat(stats.congeUtilizationRate)}%`
                              : "N/A"}
                          </MDTypography>
                          <MDTypography variant="body2" color="text">
                            des jours disponibles
                          </MDTypography>
                        </MDBox>
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
      )}
    </DashboardLayout>
  );
}

export default Dashboard;
