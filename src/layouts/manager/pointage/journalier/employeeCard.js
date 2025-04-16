/* eslint-disable react/prop-types */
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Avatar,
  Divider,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { formatTime } from "functions/dateTime";

const EmployeeCard = ({ card }) => {
  // Calculate work hours if both arrival and departure times exist
  const calculateWorkHours = () => {
    if (!card.heureArrivee || !card.heureDepart) return null;

    const arrivalTime = new Date(`2025-01-01T${card.heureArrivee}`);
    const departureTime = new Date(`2025-01-01T${card.heureDepart}`);

    // Calculate difference in hours
    const diffMs = departureTime - arrivalTime;
    const diffHrs = diffMs / (1000 * 60 * 60);

    return diffHrs.toFixed(1);
  };

  const workHours = calculateWorkHours();

  // Calculate progress towards required hours
  const progressPercentage = workHours ? Math.min((workHours / card.requiredHours) * 100, 100) : 0;

  // Determine status color and icon
  const getStatusConfig = () => {
    switch (card.status) {
      case "En poste":
        return { color: "success", icon: "✅", bgColor: "#e8f5e9" };
      case "En congé":
        return { color: "info", icon: "🏖️", bgColor: "#e3f2fd" };
      case "Pas encore arrivé":
        return { color: "warning", icon: "⏳", bgColor: "#fff8e1" };
      case "Absent":
        return { color: "error", icon: "🚶‍♂️", bgColor: "#ffebee" };
      case "A quité":
        return { color: "default", icon: "🚫", bgColor: "#f5f5f5" };
      case "Autorisation":
        return { color: "secondary", icon: "📝", bgColor: "#f3e5f5" };
      default:
        return { color: "default", icon: "", bgColor: "#ffffff" };
    }
  };

  const statusConfig = getStatusConfig();

  // Get first letter of name for avatar
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return (
    <Card
      sx={{
        width: 280,
        margin: 2,
        boxShadow: 3,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 6,
        },
        borderTop: `3px solid ${
          card.late ? "#f44336" : card.completedWorkDay ? "#4caf50" : "#ff9800"
        }`,
        borderRadius: "8px",
        position: "relative",
        overflow: "visible",
      }}
    >
      <Box
        sx={{
          ml: 2,
          backgroundColor: statusConfig.bgColor,
          padding: 2,
          borderRadius: "8px 8px 0 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box display="flex" alignItems="center">
          <Avatar
            sx={{
              bgcolor: card.late ? "#f44336" : "#1976d2",
              width: 40,
              height: 40,
              marginRight: 1,
            }}
          >
            {getInitial(card.collaborateurNom)}
          </Avatar>
          <Typography variant="h6" component="div" fontWeight="bold" sx={{ fontSize: "1rem" }}>
            {card.collaborateurNom}
          </Typography>
        </Box>
        <Chip
          ml={2}
          label={statusConfig.icon + " " + (card.status || "N/A")}
          color={statusConfig.color}
          size="small"
          sx={{ fontWeight: "medium" }}
        />
      </Box>

      <CardContent>
        {!card.status || card.status === "En poste" || card.heureArrivee ? (
          <>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 0.5 }}>
              <Tooltip title="Heure d'arrivée">
                <AccessTimeIcon
                  fontSize="small"
                  sx={{ mr: 1, color: card.late ? "#f44336" : "#4caf50" }}
                />
              </Tooltip>
              <Typography variant="body2">
                {card.heureArrivee ? formatTime(card.heureArrivee) : "N/A"}
                {card.late && (
                  <span style={{ color: "#f44336", marginLeft: "5px" }}>(En retard)</span>
                )}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
              <Tooltip title="Heure de départ">
                <ExitToAppIcon fontSize="small" sx={{ mr: 1, color: "#757575" }} />
              </Tooltip>
              <Typography variant="body2">
                {card.heureDepart ? formatTime(card.heureDepart) : "Pas encore parti"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1.5 }} />

            {workHours && (
              <Box sx={{ mt: 1.5 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                  <Typography variant="body2" color="text.secondary">
                    Heures travaillées: {workHours}h / {card.requiredHours}h
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="medium"
                    color={card.completedWorkDay ? "success.main" : "warning.main"}
                  >
                    {card.completedWorkDay ? "Complété" : "Incomplet"}
                  </Typography>
                </Box>
                <Tooltip title={`${progressPercentage.toFixed(0)}% des heures requises`}>
                  <LinearProgress
                    variant="determinate"
                    value={progressPercentage}
                    sx={{
                      height: 8,
                      borderRadius: 1,
                      backgroundColor: "#e0e0e0",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor:
                          progressPercentage >= 100
                            ? "#4caf50"
                            : progressPercentage >= 80
                            ? "#ff9800"
                            : "#f44336",
                      },
                    }}
                  />
                </Tooltip>
              </Box>
            )}

            {card.dureeAutorisation > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Autorisation: {formatTime(card.deb_Autorisation)} -{" "}
                {formatTime(card.fin_Autorisation)}
              </Typography>
            )}
          </>
        ) : (
          <Box
            sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80px" }}
          >
            <Typography variant="body1" color="text.secondary" textAlign="center">
              {card.status === "En congé"
                ? "En congé aujourd'hui"
                : card.status === "Absent"
                ? "Absent aujourd'hui"
                : "Pas d'informations disponibles"}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeCard;
