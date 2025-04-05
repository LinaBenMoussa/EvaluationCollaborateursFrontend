/* eslint-disable react/prop-types */
import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Button,
  Tabs,
  Tab,
  Divider,
  Typography,
  Box,
  Paper,
  Skeleton,
  Tooltip,
  Chip,
  Grid,
} from "@mui/material";
import html2pdf from "html2pdf.js";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import ArticleIcon from "@mui/icons-material/Article";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

const ReportViewer = ({ open, onClose, reportData, isLoading, employeeName, period, stats }) => {
  const [tabValue, setTabValue] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const pdf_content = useRef();
  const summary_content = useRef();

  // Fonction pour extraire le contenu HTML pur à partir de reportData
  const extractPureHtml = (htmlString) => {
    if (typeof htmlString !== "string") return null;

    let extractedHtml = "";

    if (htmlString.startsWith("```html") && htmlString.endsWith("```")) {
      extractedHtml = htmlString.substring(7, htmlString.length - 3);
    } else if (htmlString.startsWith("```") && htmlString.endsWith("```")) {
      extractedHtml = htmlString.substring(3, htmlString.length - 3);
    } else {
      extractedHtml = htmlString;
    }

    // Ajoute les styles CSS au début du HTML
    const style = `
      <style>
        .avoid-break {
          page-break-inside: avoid;
          break-inside: avoid;
        }
        * {
          break-inside: avoid;
        }
      </style>
    `;

    return style + extractedHtml;
  };

  const handleDownload = () => {
    // Sélectionner le contenu approprié en fonction de l'onglet actif
    const element = tabValue === 0 ? pdf_content.current : summary_content.current;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Rapport_${employeeName}_${new Date().toISOString().slice(0, 10)}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        scrollY: 0, // important pour éviter les scrolls visibles
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    if (element) {
      html2pdf().from(element).set(opt).save();
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Extraction du HTML pur
  const pureHtmlContent = extractPureHtml(reportData);

  // Helper function to determine status color
  const getStatusColor = (score) => {
    if (score >= 80) return "success";
    if (score >= 65) return "info";
    if (score >= 50) return "warning";
    return "error";
  };

  // Helper function to determine status text
  const getStatusText = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 65) return "Bon";
    if (score >= 50) return "À améliorer";
    return "Préoccupant";
  };

  // Use the stats directly if reportData is not available
  const productivityScore = stats?.productivityScore || 0;
  const respectEcheanceRate = stats?.respectEcheanceRate || 0;
  const retardRate = stats?.retardRate || 0;
  const dailyAvgWorkingHours = stats?.dailyAvgWorkingHours || 0;
  const totalHoursMissing = stats?.totalHoursMissing || 0;
  const tasksInLate = stats?.tasksInLate || 0;
  const taskCompletionRate = stats?.taskCompletionRate || 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isFullscreen}
      PaperProps={{
        sx: {
          borderRadius: isFullscreen ? 0 : 2,
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 2,
          bgcolor: "primary.main",
          color: "white",
        }}
      >
        <Box display="flex" alignItems="center">
          <ArticleIcon sx={{ mr: 1 }} />
          <MDTypography variant="h5" fontWeight="medium" color="white">
            {isLoading ? (
              <Skeleton width={200} sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />
            ) : (
              `Rapport de ${employeeName}`
            )}
          </MDTypography>
        </Box>
        <Box>
          <Tooltip title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}>
            <IconButton color="inherit" onClick={toggleFullscreen}>
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Fermer">
            <IconButton color="inherit" onClick={onClose} edge="end">
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ px: 2, bgcolor: "background.paper" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="report viewing options"
        >
          <Tab icon={<PictureAsPdfIcon sx={{ mr: 1 }} />} iconPosition="start" label="Aperçu PDF" />
          <Tab
            icon={<AssessmentIcon sx={{ mr: 1 }} />}
            iconPosition="start"
            label="Résumé analytique"
          />
        </Tabs>
      </Box>

      <Divider />

      <DialogContent sx={{ p: 0, height: isFullscreen ? "calc(100vh - 170px)" : "70vh" }}>
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            flexDirection="column"
          >
            <Skeleton variant="rectangular" width="80%" height="80%" />
            <MDTypography variant="body2" mt={2}>
              Génération du rapport en cours...
            </MDTypography>
          </Box>
        ) : (
          <>
            {tabValue === 0 && (
              <Box
                sx={{
                  height: "100%",
                  overflow: "auto",
                  bgcolor: "#f5f5f5",
                  p: 2,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {pureHtmlContent ? (
                  // Utiliser le HTML pur extrait
                  <div ref={pdf_content} dangerouslySetInnerHTML={{ __html: pureHtmlContent }} />
                ) : (
                  <Paper
                    elevation={3}
                    sx={{
                      width: "210mm",
                      minHeight: "297mm",
                      bgcolor: "white",
                      p: 4,
                      mx: "auto",
                    }}
                  >
                    <Box sx={{ p: 3 }}>
                      <MDTypography variant="h4" textAlign="center" mb={4}>
                        Rapport de Performance
                      </MDTypography>
                      <MDTypography variant="h5" textAlign="center" mb={4}>
                        {employeeName} - {period}
                      </MDTypography>

                      <Divider sx={{ my: 4 }} />

                      <MDTypography variant="h6" mb={2}>
                        Aperçu Général
                      </MDTypography>
                      <Typography paragraph>
                        Score de productivité global:{" "}
                        <strong>{productivityScore.toFixed(1)}/100</strong> -{" "}
                        {getStatusText(productivityScore)}
                      </Typography>
                      <Typography paragraph>
                        Le collaborateur présente un score de productivité{" "}
                        {getStatusText(productivityScore).toLowerCase()}.
                        {productivityScore < 50
                          ? " Des actions d'amélioration sont nécessaires."
                          : productivityScore < 65
                          ? " Des améliorations sont recommandées."
                          : " Les performances sont satisfaisantes."}
                      </Typography>

                      <MDTypography variant="h6" mt={4} mb={2}>
                        Respect des Échéances
                      </MDTypography>
                      <Typography paragraph>
                        Tâches à temps: <strong>{respectEcheanceRate.toFixed(1)}%</strong>
                        <br />
                        Tâches en retard: <strong>{retardRate.toFixed(1)}%</strong>
                        <br />
                        {tasksInLate > 0 ? `Nombre de tâches en retard: ${tasksInLate}` : ""}
                      </Typography>

                      <MDTypography variant="h6" mt={4} mb={2}>
                        Temps de Travail
                      </MDTypography>
                      <Typography paragraph>
                        Temps de travail moyen quotidien:{" "}
                        <strong>{dailyAvgWorkingHours.toFixed(2)} heures</strong>
                        <br />
                        Heures manquantes sur la période:{" "}
                        <strong>{totalHoursMissing.toFixed(1)} heures</strong>
                      </Typography>

                      <Divider sx={{ my: 4 }} />

                      <MDTypography variant="h6" mb={2}>
                        Recommandations
                      </MDTypography>
                      <Typography paragraph>
                        {productivityScore < 50
                          ? "Un suivi rapproché est recommandé pour aider le collaborateur à améliorer sa performance. Des formations ciblées pourraient être bénéfiques."
                          : productivityScore < 65
                          ? "Un accompagnement sur la gestion du temps et l'organisation pourrait aider à améliorer les performances du collaborateur."
                          : "Le collaborateur montre de bonnes performances. Continuer à encourager et à soutenir son développement professionnel."}
                      </Typography>
                    </Box>
                  </Paper>
                )}
              </Box>
            )}

            {tabValue === 1 && (
              <Box sx={{ p: 3, height: "100%", overflow: "auto" }}>
                <div ref={summary_content}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Paper sx={{ p: 3, mb: 3 }}>
                        <Box mb={2} display="flex" alignItems="center">
                          <MDTypography variant="h6" fontWeight="bold" mr={2}>
                            Informations générales
                          </MDTypography>
                          <Chip
                            label={getStatusText(productivityScore)}
                            color={getStatusColor(productivityScore)}
                            size="small"
                          />
                        </Box>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <MDTypography variant="body2" color="text.secondary">
                              Collaborateur
                            </MDTypography>
                            <MDTypography variant="body1">{employeeName}</MDTypography>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <MDTypography variant="body2" color="text.secondary">
                              Période analysée
                            </MDTypography>
                            <MDTypography variant="body1">{period}</MDTypography>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <MDTypography variant="body2" color="text.secondary">
                              Date de génération
                            </MDTypography>
                            <MDTypography variant="body1">
                              {new Date().toLocaleDateString()}
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 3, height: "100%" }}>
                        <MDTypography variant="h6" fontWeight="bold" mb={2}>
                          Performance globale
                        </MDTypography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            my: 3,
                          }}
                        >
                          <Box
                            sx={{
                              width: 150,
                              height: 150,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: `${getStatusColor(productivityScore)}.light`,
                              mb: 2,
                            }}
                          >
                            <MDTypography variant="h2" fontWeight="bold" color="white">
                              {productivityScore.toFixed(1)}
                            </MDTypography>
                          </Box>
                          <MDTypography variant="body2" textAlign="center">
                            Score de productivité global sur 100
                          </MDTypography>
                          <MDTypography variant="body2" textAlign="center" mt={2}>
                            {productivityScore < 30
                              ? "Performance très préoccupante. Des actions correctives immédiates sont recommandées."
                              : productivityScore < 50
                              ? "Performance préoccupante. Un plan d'amélioration doit être mis en place."
                              : productivityScore < 65
                              ? "Performance acceptable mais à améliorer. Des ajustements sont nécessaires."
                              : productivityScore < 80
                              ? "Bonne performance. Quelques points d'amélioration possibles."
                              : "Excellente performance. Continuer à encourager et soutenir."}
                          </MDTypography>
                        </Box>
                        {dailyAvgWorkingHours > 0 && (
                          <Box mt={3}>
                            <MDTypography variant="body2" color="text.secondary">
                              Temps de travail moyen:{" "}
                              <strong>{dailyAvgWorkingHours.toFixed(2)} heures/jour</strong>
                            </MDTypography>
                            {totalHoursMissing > 0 && (
                              <MDTypography variant="body2" color="text.secondary" mt={1}>
                                Heures manquantes:{" "}
                                <strong>{totalHoursMissing.toFixed(1)} heures</strong>
                              </MDTypography>
                            )}
                          </Box>
                        )}
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 3, height: "100%" }}>
                        <MDTypography variant="h6" fontWeight="bold" mb={2}>
                          Respect des échéances
                        </MDTypography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Box
                              sx={{
                                bgcolor: "success.light",
                                p: 2,
                                borderRadius: 2,
                                color: "white",
                                textAlign: "center",
                              }}
                            >
                              <MDTypography variant="h4" fontWeight="bold" color="white">
                                {respectEcheanceRate.toFixed(1)}%
                              </MDTypography>
                              <MDTypography variant="body2" color="white">
                                Tâches à temps
                              </MDTypography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box
                              sx={{
                                bgcolor: "error.light",
                                p: 2,
                                borderRadius: 2,
                                color: "white",
                                textAlign: "center",
                              }}
                            >
                              <MDTypography variant="h4" fontWeight="bold" color="white">
                                {retardRate.toFixed(1)}%
                              </MDTypography>
                              <MDTypography variant="body2" color="white">
                                Tâches en retard
                              </MDTypography>
                            </Box>
                          </Grid>
                        </Grid>
                        <Box mt={3}>
                          <MDTypography variant="body2" color="text.secondary">
                            {respectEcheanceRate >= 90
                              ? "Excellent respect des délais. Performance exemplaire sur la période."
                              : respectEcheanceRate >= 75
                              ? "Bon respect des délais. Quelques retards occasionnels."
                              : respectEcheanceRate >= 60
                              ? "Respect des délais à améliorer. Retards fréquents."
                              : "Problème significatif de respect des délais. Nécessite une attention particulière."}
                          </MDTypography>
                        </Box>
                        {tasksInLate > 0 && (
                          <Box mt={2}>
                            <MDTypography variant="body2" color="error.main">
                              {tasksInLate} {tasksInLate > 1 ? "tâches sont" : "tâche est"}{" "}
                              actuellement en retard.
                            </MDTypography>
                          </Box>
                        )}
                        {taskCompletionRate > 0 && (
                          <Box mt={2}>
                            <MDTypography variant="body2" color="text.secondary">
                              Taux de complétion des tâches:{" "}
                              <strong>{taskCompletionRate.toFixed(1)}%</strong>
                            </MDTypography>
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  </Grid>
                </div>
              </Box>
            )}
          </>
        )}
      </DialogContent>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "background.paper",
          borderTop: 1,
          borderColor: "divider",
          p: 2,
        }}
      >
        <MDTypography variant="caption" color="text.secondary">
          {isLoading
            ? "Génération en cours..."
            : `Rapport généré le ${new Date().toLocaleDateString()} à ${new Date().toLocaleTimeString()}`}
        </MDTypography>

        <Box>
          <MDButton
            variant="contained"
            color="info"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            disabled={isLoading || (!reportData && !stats)}
          >
            Télécharger
          </MDButton>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ReportViewer;
