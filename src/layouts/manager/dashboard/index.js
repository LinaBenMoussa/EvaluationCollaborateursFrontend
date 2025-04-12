import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  useGetCollaborateursByManagerQuery,
  useGetCollaborateursStatsQuery,
} from "store/api/userApi";
import { selectCurrentUser } from "store/slices/authSlice";
import { Grid, Card, Select, MenuItem, CircularProgress } from "@mui/material";
import html2pdf from "html2pdf.js";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ReportsPieChart from "examples/Charts/PieChart";
import { formatDate } from "./utils/formatUtils";
import PerformanceSummaryCard from "./components/performanceSummaryCard";
import MetricsGrid from "./components/metricsGrid";
import AutocompleteField from "layouts/shared/autocompleteField";
import DateFilter from "./components/dateFilter";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { MetricsAvancees } from "./components/metricsAvancees";
import { useGetReportMutation } from "store/api/reportApi";
import ReportViewer from "./components/ReportViewer";
import TopCollaborators from "./components/topCollaborateur";

const Dashboard = () => {
  const [collaborateurId, setCollaborateurId] = useState(null);
  const [selectedCollaborateur, setSelectedCollaborateur] = useState(null);
  const [filterType, setFilterType] = useState("thisMonth");
  const [filterTypeCourbe, setFilterTypeCourbe] = useState("month");
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportData, setReportData] = useState(null);

  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(new Date());

  const managerId = useSelector(selectCurrentUser);
  const { data: collaborateurs, refetch } = useGetCollaborateursByManagerQuery(managerId);
  useEffect(() => {
    refetch();
  }, []);
  const {
    data: stats,
    isLoading,
    isError,
  } = useGetCollaborateursStatsQuery(
    {
      id: collaborateurId,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      type: filterTypeCourbe,
    },
    { skip: !collaborateurId || !startDate || !endDate }
  );

  useEffect(() => {
    if (collaborateurs && collaborateurs.length > 0 && !selectedCollaborateur) {
      setSelectedCollaborateur(collaborateurs[0]);
      setCollaborateurId(collaborateurs[0].id);
    }
  }, [collaborateurs, selectedCollaborateur]);

  const getPeriodText = () => {
    return `${formatDate(startDate, "dd MMMM yyyy")} - ${formatDate(endDate, "dd MMMM yyyy")}`;
  };

  const taskStatusPieChart = useMemo(
    () => ({
      labels: ["Complété à temps", "En retard"],
      datasets: {
        label: "Distribution",
        backgroundColors: ["#4CAF50", "#F44336"],
        data: [stats?.respectEcheanceRate || 0, 100 - stats?.respectEcheanceRate || 0],
      },
    }),
    [stats]
  );

  const overallStatus = useMemo(() => {
    if (!stats) return { color: "info", text: "Données insuffisantes" };
    const score = stats?.productivityScore;
    if (score >= 80) return { color: "success", text: "Excellent" };
    if (score >= 65) return { color: "info", text: "Bon" };
    if (score >= 50) return { color: "warning", text: "À améliorer" };
    return { color: "error", text: "Préoccupant" };
  }, [stats]);

  const handleFilterChange = useCallback((type) => {
    setFilterType(type);
    if (type !== "custom") {
      const now = new Date();
      let newStart, newEnd;
      switch (type) {
        case "thisWeek":
          const day = now.getDay();
          const diff = now.getDay() === 0 ? -6 : 1 - day;
          newStart = new Date(now);
          newStart.setDate(now.getDate() + diff);
          newEnd = new Date(newStart);
          newEnd.setDate(newStart.getDate() + 6);
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
    }
  }, []);

  const [getReport, { isLoading: isGeneratingReport }] = useGetReportMutation();

  const handleGenerateReport = async () => {
    if (!stats || !selectedCollaborateur) return;

    const reportPayload = {
      employeeName: selectedCollaborateur.nom + " " + selectedCollaborateur.prenom,
      period: getPeriodText(),
      productivityScore: stats.productivityScore,
      respectEcheanceRate: stats.respectEcheanceRate,
      retardRate: 100 - stats.respectEcheanceRate,
    };

    try {
      const result = await getReport(reportPayload).unwrap();
      setReportData(result);
      console.log("Rapport généré :", result);
      setReportDialogOpen(true);
    } catch (error) {
      console.error("Erreur lors de la génération du rapport :", error);
    }
  };

  const renderContent = () => {
    if (!collaborateurId) {
      return (
        <MDBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ minHeight: "300px" }}
        >
          <CircularProgress />
        </MDBox>
      );
    }
    if (isLoading) {
      return (
        <MDBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ minHeight: "300px" }}
        >
          <CircularProgress />
        </MDBox>
      );
    }
    if (isError) {
      return (
        <MDBox p={1} textAlign="center">
          {"Une erreur s'est produite lors du chargement des données."}
        </MDBox>
      );
    }
    return (
      <MDBox py={1}>
        <PerformanceSummaryCard
          selectedCollaborateur={selectedCollaborateur}
          overallStatus={overallStatus}
          performanceScore={stats?.productivityScore}
          stats={stats}
        />
        <MetricsGrid stats={stats} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <ReportsPieChart
              color="info"
              title="Distribution des tâches"
              description="Répartition des tâches selon leur statut"
              date="Mis à jour à l'instant"
              chart={taskStatusPieChart}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <MDBox px={3} pt={3}>
                <MDTypography variant="h6" fontWeight="medium">
                  Courbe de Productivité
                </MDTypography>
              </MDBox>
              <MDBox p={1}>
                <MDBox mb={3} ml={5}>
                  <Select
                    labelId="filter-type-label"
                    label="Période"
                    value={filterTypeCourbe}
                    onChange={(e) => setFilterTypeCourbe(e.target.value)}
                    sx={{ width: "100px" }}
                  >
                    <MenuItem value="month">Par Mois</MenuItem>
                    <MenuItem value="week">Par Semaine</MenuItem>
                  </Select>
                </MDBox>
                <MDBox m={2}>
                  <ReportsLineChart
                    color="info"
                    title="Productivité"
                    description="Évolution de la productivité sur la période sélectionnée"
                    date="Mis à jour à l'instant"
                    chart={{
                      labels: JSON.parse(stats.periodLabels) || [],
                      datasets: {
                        label: "Productivité",
                        data: JSON.parse(stats.productivityScores) || [],
                      },
                    }}
                  />
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TopCollaborators />
          </Grid>
          <Grid item xs={12} md={6}>
            <MetricsAvancees stats={stats} />
          </Grid>
        </Grid>

        {/* Bouton pour générer le rapport */}
        <MDBox mt={3} display="flex" justifyContent="flex-end">
          <MDButton
            variant="contained"
            color="info"
            startIcon={<AssessmentIcon />}
            onClick={handleGenerateReport}
            disabled={isGeneratingReport || !stats}
          >
            {isGeneratingReport ? "Génération en cours..." : "Générer un rapport"}
          </MDButton>
        </MDBox>

        <ReportViewer
          open={reportDialogOpen}
          onClose={() => setReportDialogOpen(false)}
          reportData={reportData}
          isLoading={isGeneratingReport}
          employeeName={selectedCollaborateur?.nom + " " + selectedCollaborateur?.prenom}
          period={getPeriodText()}
          stats={stats}
        />
      </MDBox>
    );
  };

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
          <DateFilter
            filterType={filterType}
            startDate={startDate}
            endDate={endDate}
            onFilterChange={handleFilterChange}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </MDBox>
      </MDBox>
      {renderContent()}
    </DashboardLayout>
  );
};

export default Dashboard;
