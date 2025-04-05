/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { Grid, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import MDBox from "components/MDBox";
import { formatDate } from "../utils/formatUtils";
import { getStartDate } from "functions/startDate";

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

  useEffect(() => {
    if (filterType === "thisMonth") {
      const monthStart = getStartDate("month");
      const endLimit = today;
      onStartDateChange(monthStart);
      onEndDateChange(endLimit);
    } else if (filterType === "thisWeek") {
      const weekStart = getStartDate("week");
      const endLimit = today;
      onStartDateChange(weekStart);
      onEndDateChange(endLimit);
    } else if (filterType === "thisYear") {
      const yearStart = getStartDate("year");
      const endLimit = today;
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
                  max: formattedToday,
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
                  max: formattedToday,
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
