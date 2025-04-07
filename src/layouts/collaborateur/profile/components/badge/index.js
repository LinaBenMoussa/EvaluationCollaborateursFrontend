/* eslint-disable react/prop-types */
import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";
import Chip from "@mui/material/Chip";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import Tooltip from "@mui/material/Tooltip";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import { useGetBadgeByCollaborateurQuery } from "store/api/badgeApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "store/slices/authSlice";

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

  // Formater la date d'attribution
  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
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
          background: "linear-gradient(135deg, #8E44AD 0%, #9B59B6 100%)",
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
            Badges & Récompenses
          </MDTypography>
        </MDBox>
        <Chip
          icon={<EmojiEventsIcon />}
          label="Accomplissements"
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

            return (
              <MDBox
                key={badgeItem.id}
                py={2}
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
                        backgroundColor: `${badgeColor}.light`,
                        borderRadius: "12px",
                        padding: 2,
                        position: "relative",
                        overflow: "hidden",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          right: 0,
                          background: `radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)`,
                        },
                      }}
                    >
                      <MDBox
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                          width: "48px",
                          height: "48px",
                          fontSize: "2rem",
                          mr: 2,
                          backgroundColor: "rgba(255,255,255,0.7)",
                          borderRadius: "50%",
                          boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
                        }}
                      >
                        {badgeIcon}
                      </MDBox>

                      <MDBox flexGrow={1}>
                        <MDBox
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={0.5}
                        >
                          <MDTypography variant="button" fontWeight="bold" color={badgeColor}>
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
                                backgroundColor: "rgba(255,255,255,0.7)",
                                color: `${badgeColor}.main`,
                                fontWeight: "bold",
                                borderRadius: "8px",
                                ml: 1,
                              }}
                            />
                          </Tooltip>
                        </MDBox>
                        <MDTypography
                          variant="caption"
                          color="text.secondary"
                          sx={{ lineHeight: 1.3 }}
                        >
                          {badge.description}
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                  </Grid>
                </Grid>
                {index < badges.length - 1 && (
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

export default Badge;
