/* eslint-disable react/prop-types */
import React from "react";
import { Card, CardContent, CardMedia, Typography, Chip } from "@mui/material";
import { green, red } from "@mui/material/colors";
import { formatTime } from "functions/dateTime";

const EmployeeCard = ({ pointage }) => {
  const isOnTime =
    (pointage.heure_arrivee <= "08:00:00" && pointage.heure_depart >= "17:00:00") ||
    (pointage.heure_arrivee == "08:00:00" && pointage.heure_depart == null);

  return (
    <Card sx={{ maxWidth: 345, margin: 2, boxShadow: 3 }}>
      {/* <CardMedia component="img" height="140" /> */}
      <CardContent>
        <Typography variant="h6" component="div">
          {pointage.collaborateur.nom} {pointage.collaborateur.prenom}
        </Typography>

        <Chip
          label={
            pointage.status === "En poste"
              ? "✅ En poste"
              : pointage.status === "En congé"
              ? "✅ En congé"
              : pointage.status === "Pas encore arrivé"
              ? "⏳ Pas encore arrivé"
              : pointage.status === "Absent"
              ? "🚶‍♂️ Absent"
              : "🚫 A quité"
          }
          color={
            pointage.status === "En poste"
              ? "success"
              : pointage.status === "En congé"
              ? "info"
              : pointage.status === "Pas encore arrivé"
              ? "warning"
              : pointage.status === "Absent"
              ? "error"
              : "info"
          }
          sx={{ marginTop: 1 }}
        />

        {/* Indicateur de pointage */}
        <Typography variant="body2" color={isOnTime ? green[500] : red[500]} sx={{ marginTop: 1 }}>
          {isOnTime
            ? pointage.heure_depart
              ? `🟢 ${formatTime(pointage.heure_arrivee)} - ${formatTime(pointage.heure_depart)}`
              : `🟢 ${formatTime(pointage.heure_arrivee)}`
            : pointage.status === "Pas encore arrivé" ||
              pointage.status === "Absent" ||
              pointage.status === "En congé"
            ? ""
            : pointage.status === "En poste"
            ? `🔴 ${formatTime(pointage.heure_arrivee)}`
            : `🔴 ${formatTime(pointage.heure_arrivee)} - ${formatTime(pointage.heure_depart)}`}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default EmployeeCard;
