import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";
import Chip from "@mui/material/Chip";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";
import { useGetTop5Query } from "store/api/apiTop5";

function TopCollaborators() {
  const { data: topCollaborators, isLoading, error } = useGetTop5Query();

  // Générer les initiales à partir du nom
  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  // Générer la couleur en fonction du score (score plus élevé = plus vert)
  const getScoreColor = (score) => {
    if (score >= 40) return "success";
    if (score >= 35) return "info";
    if (score >= 30) return "warning";
    return "error";
  };

  // Formater le libellé du score
  const getScoreLabel = (score) => {
    if (score >= 40) return "Excellent";
    if (score >= 35) return "Très bon";
    if (score >= 30) return "Bon";
    return "À améliorer";
  };

  // Récupérer l'icône de médaille en fonction du rang
  const getMedalIcon = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  return (
    <Card
      sx={{
        height: "100%",
        boxShadow: "0 10px 20px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)",
        borderRadius: "16px",
        overflow: "hidden",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          boxShadow: "0 12px 24px rgba(0,0,0,0.15), 0 6px 12px rgba(0,0,0,0.08)",
          transform: "translateY(-5px)",
        },
      }}
    >
      <MDBox
        pt={3}
        px={3}
        pb={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          background: "linear-gradient(135deg, #49a3f1 0%, #0c66c2 100%)",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          "&::after": {
            content: '""',
            position: "absolute",
            top: "50%",
            right: "-50px",
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            zIndex: 0,
          },
        }}
      >
        <MDBox display="flex" alignItems="center">
          <WorkspacePremiumIcon
            sx={{
              fontSize: "1.75rem",
              mr: 1.5,
              color: "rgba(255,255,255,0.9)",
            }}
          />
          <MDTypography variant="h6" fontWeight="bold" color="white">
            Top Performers du Mois
          </MDTypography>
        </MDBox>
        <Chip
          icon={<TrendingUpIcon />}
          label="Performance"
          size="small"
          sx={{
            backgroundColor: "rgba(255,255,255,0.2)",
            color: "#fff",
            borderRadius: "8px",
            fontWeight: "medium",
            "& .MuiChip-icon": {
              color: "#fff",
            },
            backdropFilter: "blur(10px)",
            zIndex: 1,
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.3)",
            },
          }}
        />
      </MDBox>
      <MDBox p={3}>
        {isLoading ? (
          Array.from(new Array(5)).map((_, index) => (
            <MDBox key={index} py={1.5}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={1}>
                  <Skeleton variant="circular" width={32} height={32} />
                </Grid>
                <Grid item xs={5}>
                  <Skeleton variant="text" width="90%" height={20} />
                  <Skeleton variant="text" width="60%" height={16} />
                </Grid>
                <Grid item xs={3}>
                  <Skeleton variant="text" width="80%" height={16} />
                </Grid>
                <Grid item xs={3}>
                  <Skeleton variant="rounded" width="100%" height={16} />
                </Grid>
              </Grid>
              {index < 4 && (
                <MDBox my={1.5}>
                  <hr style={{ opacity: 0.1 }} />
                </MDBox>
              )}
            </MDBox>
          ))
        ) : error ? (
          <MDBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="200px"
            sx={{
              backgroundColor: "rgba(255,0,0,0.05)",
              borderRadius: "12px",
              border: "1px dashed rgba(255,0,0,0.3)",
              padding: 2,
            }}
          >
            <MDTypography variant="button" color="error">
              Impossible de charger les données des collaborateurs
            </MDTypography>
          </MDBox>
        ) : (
          topCollaborators?.map((item, index) => {
            const collaborateur = item.collaborateur;
            const scoreColor = getScoreColor(item.score);
            const medalIcon = getMedalIcon(item.rang);

            return (
              <MDBox
                key={item.id}
                py={1.5}
                sx={{
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateX(5px)",
                    backgroundColor: "rgba(0,0,0,0.02)",
                    borderRadius: "8px",
                  },
                  position: "relative",
                }}
              >
                <Grid container alignItems="center" spacing={1}>
                  <Grid item xs={1}>
                    {medalIcon ? (
                      <Tooltip title={`Rang ${item.rang}`} placement="top">
                        <MDBox
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          sx={{
                            width: "32px",
                            height: "32px",
                            fontSize: "1.25rem",
                          }}
                        >
                          {medalIcon}
                        </MDBox>
                      </Tooltip>
                    ) : (
                      <MDBox
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: "rgba(0,0,0,0.05)",
                          color: "text.secondary",
                          fontWeight: "bold",
                          fontSize: "0.8rem",
                        }}
                      >
                        {item.rang}
                      </MDBox>
                    )}
                  </Grid>
                  <Grid item xs={5}>
                    <MDBox display="flex" alignItems="center">
                      <MDBox mr={2}>
                        <MDAvatar
                          bgColor={scoreColor}
                          size="sm"
                          sx={{
                            boxShadow: `0 4px 8px rgba(0,0,0,0.15)`,
                            border: "2px solid #fff",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              transform: "scale(1.1)",
                            },
                          }}
                        >
                          {getInitials(collaborateur.prenom, collaborateur.nom)}
                        </MDAvatar>
                      </MDBox>
                      <MDBox display="flex" flexDirection="column">
                        <MDTypography variant="button" fontWeight="bold">
                          {collaborateur.prenom} {collaborateur.nom}
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                  </Grid>
                  <Grid item xs={6}>
                    <MDBox>
                      <MDBox
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={0.5}
                      >
                        <MDTypography variant="caption" color="text" fontWeight="medium">
                          {getScoreLabel(item.score)}
                        </MDTypography>
                        <Tooltip title={`Score: ${item.score}/50`} placement="top">
                          <MDTypography variant="button" fontWeight="bold" color={scoreColor}>
                            {item.score}
                          </MDTypography>
                        </Tooltip>
                      </MDBox>
                      <Box position="relative">
                        <MDProgress
                          variant="gradient"
                          color={scoreColor}
                          value={item.score}
                          label={false}
                          sx={{
                            height: "8px",
                            borderRadius: "4px",
                            background: "rgba(0,0,0,0.05)",
                          }}
                        />
                      </Box>
                    </MDBox>
                  </Grid>
                </Grid>
                {index < topCollaborators.length - 1 && (
                  <MDBox my={1.5}>
                    <hr style={{ opacity: 0.07 }} />
                  </MDBox>
                )}
              </MDBox>
            );
          })
        )}
      </MDBox>
    </Card>
  );
}

export default TopCollaborators;
