/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { Grid, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import MDBox from "components/MDBox";
import { formatDate } from "../utils/formatUtils";

const DateFilter = ({
  filterType,
  startDate,
  endDate,
  onFilterChange,
  onStartDateChange,
  onEndDateChange,
}) => {
  const today = new Date();
  const formattedToday = formatDate(today);

  // Calculer le début de la période (pour mois ou année)
  const getStartDate = (periodType) => {
    const currentDate = new Date();
    if (periodType === "month") {
      return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    } else if (periodType === "year") {
      return new Date(currentDate.getFullYear(), 0, 1);
    } else if (periodType === "week") {
      // Obtenir le premier jour de la semaine (lundi)
      const day = currentDate.getDay();
      const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1); // ajuster quand jour = dimanche
      return new Date(currentDate.getFullYear(), currentDate.getMonth(), diff);
    }
    return currentDate;
  };

  // Limiter la fin de la période à aujourd'hui
  const getEndDate = (periodType) => {
    const currentDate = new Date();
    // Toujours limiter la date de fin à aujourd'hui
    return today;
  };

  // Effet pour mettre à jour les dates lorsque le type de filtre change
  useEffect(() => {
    if (filterType === "thisMonth") {
      const monthStart = getStartDate("month");
      const endLimit = getEndDate("month");
      onStartDateChange(monthStart);
      onEndDateChange(endLimit);
    } else if (filterType === "thisWeek") {
      const weekStart = getStartDate("week");
      const endLimit = getEndDate("week");
      onStartDateChange(weekStart);
      onEndDateChange(endLimit);
    } else if (filterType === "thisYear") {
      const yearStart = getStartDate("year");
      const endLimit = getEndDate("year");
      onStartDateChange(yearStart);
      onEndDateChange(endLimit);
    }
  }, [filterType]);

  return (
    <MDBox display="flex" alignItems="center">
      <MDBox>
        <FormControl fullWidth>
          <InputLabel id="filter-type-label">Période</InputLabel>
          <Select
            labelId="filter-type-label"
            label="Période"
            value={filterType}
            onChange={(e) => onFilterChange(e.target.value)}
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
                onChange={(e) => onStartDateChange(new Date(e.target.value))}
                InputLabelProps={{ shrink: true }}
                sx={{ height: "45px", width: "220px", mx: 0.5 }}
                inputProps={{
                  max: formattedToday, // Limite à aujourd'hui
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Date de fin"
                type="date"
                fullWidth
                value={formatDate(endDate)}
                onChange={(e) => onEndDateChange(new Date(e.target.value))}
                InputLabelProps={{ shrink: true }}
                sx={{ height: "45px", width: "220px", mx: 0.5 }}
                inputProps={{
                  max: formattedToday, // Date max = aujourd'hui (jamais au-delà)
                }}
              />
            </Grid>
          </Grid>
        </MDBox>
      )}
    </MDBox>
  );
};

export default DateFilter;
