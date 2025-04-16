/* eslint-disable react/prop-types */
import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";
import Chip from "@mui/material/Chip";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import Tooltip from "@mui/material/Tooltip";
import { keyframes } from "@emotion/react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import { useGetBadgeByCollaborateurQuery } from "store/api/badgeApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "store/slices/authSlice";

// Ajout d'animations avec emotion
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const shine = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

function Badge() {
  const collaborateurId = useSelector(selectCurrentUser);

  const { data: badges, isLoading, error } = useGetBadgeByCollaborateurQuery(collaborateurId);

  // Obtenir une icône pour les badges spécifiques
  const getBadgeIcon = (badgeName) => {
    const nameToLower = badgeName.toLowerCase();

    if (nameToLower.includes("heure")) return "🔥";
    if (nameToLower.includes("régulier")) return "🧠";
    if (nameToLower.includes("assidu")) return "⏱️";
    if (nameToLower.includes("objectif")) return "🎯";
    if (nameToLower.includes("employé")) return "🏆";
    return "🏅"; // Badge par défaut
  };

  // Obtenir une couleur pour les badges spécifiques
  const getBadgeColor = (badgeName) => {
    const nameToLower = badgeName.toLowerCase();

    if (nameToLower.includes("heure")) return "error"; // Rouge
    if (nameToLower.includes("régulier")) return "info"; // Bleu
    if (nameToLower.includes("assidu")) return "warning"; // Orange
    if (nameToLower.includes("objectif")) return "success"; // Vert
    if (nameToLower.includes("employé")) return "secondary"; // Violet
    return "primary"; // Couleur par défaut
  };

  // Obtenir un dégradé de couleur pour le badge
  const getBadgeGradient = (badgeName) => {
    const nameToLower = badgeName.toLowerCase();

    if (nameToLower.includes("heure")) return "linear-gradient(135deg, #C9B719FF, #C9B719FF)";
    if (nameToLower.includes("régulier")) return "linear-gradient(135deg, #646567FF, #646567FF)";
    if (nameToLower.includes("assidu")) return "linear-gradient(135deg, #9C7C1CC5, #9C7C1CC5)";
    if (nameToLower.includes("objectif")) return "linear-gradient(135deg, #32DD37FF, #32DD37FF)";
    if (nameToLower.includes("employé")) return "linear-gradient(135deg, #B33AC8FF, #B33AC8FF)";
    return "linear-gradient(135deg, #3f51b5, #1a237e)"; // Dégradé par défaut
  };

  // Formater la date d'attribution
  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  return (
    <Card
      sx={{
        height: "100%",
        boxShadow: "0 15px 30px rgba(0,0,0,0.15), 0 5px 15px rgba(0,0,0,0.08)",
        borderRadius: "20px",
        overflow: "hidden",
        // transition: "transform 0.4s ease, box-shadow 0.4s ease",
        "&:hover": {
          boxShadow: "0 20px 40px rgba(0,0,0,0.2), 0 10px 20px rgba(0,0,0,0.12)",
          // transform: "translateY(-8px)",
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
          background: "linear-gradient(135deg, #6a3093 0%, #a044ff 100%)",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          "&::after": {
            content: '""',
            position: "absolute",
            top: "-50%",
            left: "-60%",
            width: "200%",
            height: "200%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)",
            zIndex: 0,
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "50%",
            height: "100%",
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)",
            animation: `${shine} 6s infinite linear`,
            zIndex: 1,
          },
        }}
      >
        <MDBox display="flex" alignItems="center" sx={{ zIndex: 2 }}>
          <WorkspacePremiumIcon
            sx={{
              fontSize: "2rem",
              mr: 1.5,
              color: "rgba(255,255,255,0.9)",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
            }}
          />
          <MDTypography
            variant="h5"
            fontWeight="bold"
            color="white"
            sx={{
              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
              letterSpacing: "0.5px",
            }}
          >
            Badges & Récompenses
          </MDTypography>
        </MDBox>
        <Chip
          icon={<EmojiEventsIcon />}
          label="Accomplissements"
          size="medium"
          sx={{
            backgroundColor: "rgba(255,255,255,0.15)",
            color: "#fff",
            borderRadius: "12px",
            fontWeight: "bold",
            "& .MuiChip-icon": {
              color: "#fff",
            },
            backdropFilter: "blur(10px)",
            zIndex: 2,
            transition: "all 0.3s ease",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.25)",
              transform: "translateY(-2px)",
            },
          }}
        />
      </MDBox>
      <MDBox p={3}>
        {isLoading ? (
          Array.from(new Array(3)).map((_, index) => (
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
              {index < 2 && (
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
              width: "100%",
              textAlign: "center",
            }}
          >
            <MDTypography
              variant="button"
              color="error"
              sx={{
                maxWidth: "100%",
                wordWrap: "break-word",
                overflow: "hidden",
              }}
            >
              Impossible de charger les données des badges
            </MDTypography>
          </MDBox>
        ) : (
          badges?.map((badgeItem, index) => {
            const { collaborateur, badge, nbrBadge, dateAttribution } = badgeItem;
            const badgeColor = getBadgeColor(badge.name);
            const badgeIcon = getBadgeIcon(badge.name);
            const badgeGradient = getBadgeGradient(badge.name);

            return (
              <MDBox
                key={badgeItem.id}
                py={3}
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
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={12} sm={7}>
                    <MDBox
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        background: badgeGradient,
                        borderRadius: "16px",
                        padding: 2.5,
                        position: "relative",
                        overflow: "hidden",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: "50%",
                          background:
                            "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)",
                          borderRadius: "16px 16px 0 0",
                        },
                      }}
                    >
                      <MDBox
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                          width: "60px",
                          height: "60px",
                          fontSize: "2.2rem",
                          mr: 2.5,
                          backgroundColor: "rgba(255,255,255,0.9)",
                          borderRadius: "50%",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                          animation: `${float} 4s ease-in-out infinite, ${pulse} 2s ease-in-out infinite`,
                          position: "relative",
                          zIndex: 2,
                          border: "3px solid rgba(255,255,255,0.4)",
                        }}
                      >
                        {badgeIcon}
                      </MDBox>

                      <MDBox flexGrow={1} sx={{ zIndex: 2 }}>
                        <MDBox
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={0.5}
                        >
                          <MDTypography
                            variant="h6"
                            fontWeight="bold"
                            color="white"
                            sx={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                          >
                            {badge.name}
                          </MDTypography>
                          <Tooltip
                            title={`Obtenu le ${formatDate(dateAttribution)}`}
                            placement="top"
                          >
                            <Chip
                              label={`${nbrBadge}${nbrBadge > 1 ? " badges" : " badge"}`}
                              size="small"
                              sx={{
                                backgroundColor: "rgba(255,255,255,0.9)",
                                color: `${badgeColor}.dark`,
                                fontWeight: "bold",
                                borderRadius: "10px",
                                ml: 1,
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                border: "1px solid rgba(255,255,255,0.6)",
                                "& .MuiChip-label": {
                                  px: 1.5,
                                },
                              }}
                            />
                          </Tooltip>
                        </MDBox>
                        <MDTypography
                          variant="body2"
                          sx={{
                            lineHeight: 1.4,
                            color: "rgba(255,255,255,0.9)",
                            fontWeight: "regular",
                            textShadow: "0 1px 1px rgba(0,0,0,0.1)",
                          }}
                        >
                          {badge.description}
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                  </Grid>
                </Grid>
                {index < badges.length - 1 && (
                  <MDBox my={2}>
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

export default Badge;
