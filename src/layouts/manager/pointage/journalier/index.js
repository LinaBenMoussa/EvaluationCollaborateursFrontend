import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Card,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Divider,
  Paper,
  IconButton,
  Chip,
  Typography,
  Badge,
  Tooltip,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import TodayIcon from "@mui/icons-material/Today";
import PersonIcon from "@mui/icons-material/Person";
import ClearIcon from "@mui/icons-material/Clear";
import RefreshIcon from "@mui/icons-material/Refresh";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import AutocompleteField from "layouts/shared/autocompleteField";
import { useGetEmployeeCardsQuery } from "store/api/employeeCardApi";
import { selectCurrentUser } from "store/slices/authSlice";
import EmployeeCard from "./employeeCard";
import { useGetCollaborateursByManagerQuery } from "store/api/userApi";

// Status filter options with icons
const statusOptions = [
  { value: "all", label: "Tous les statuts", icon: <FilterAltIcon fontSize="small" /> },
  {
    value: "En poste",
    label: "En poste",
    icon: <AssignmentIndIcon fontSize="small" color="success" />,
  },
  { value: "A quité", label: "A quité", icon: <ClearIcon fontSize="small" color="error" /> },
  {
    value: "Pas encore arrivé",
    label: "Pas encore arrivé",
    icon: <HourglassEmptyIcon fontSize="small" color="warning" />,
  },
  { value: "Absent", label: "Absent", icon: <ClearIcon fontSize="small" color="error" /> },
  {
    value: "En congé",
    label: "En congé",
    icon: <CalendarTodayIcon fontSize="small" color="info" />,
  },
  {
    value: "Autorisation",
    label: "Autorisation",
    icon: <AssignmentIndIcon fontSize="small" color="secondary" />,
  },
];

function Pointage() {
  const [collaborateurId, setCollaborateurId] = useState(null);
  const [selectedCollaborateur, setSelectedCollaborateur] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [filterType, setFilterType] = useState("today");
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const managerId = useSelector(selectCurrentUser);

  const {
    data: employeeCards = [],
    isLoading,
    refetch: refetchEmployeeCards,
  } = useGetEmployeeCardsQuery({ managerId, selectedDate });

  useEffect(() => {
    if (filterType === "today") {
      setSelectedDate(new Date().toISOString().split("T")[0]);
    } else if (filterType === "yesterday") {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      setSelectedDate(yesterday.toISOString().split("T")[0]);
    }
  }, [filterType]);

  useEffect(() => {
    refetchEmployeeCards();
  }, [selectedDate]);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (collaborateurId !== null) count++;
    if (filterStatus !== "all") count++;
    if (filterType !== "today") count++;
    setActiveFiltersCount(count);
  }, [collaborateurId, filterStatus, filterType]);

  const filteredEmployeeCards = useMemo(() => {
    return employeeCards.filter((card) => {
      const matchesCollaborateur =
        collaborateurId === null || card.collaborateurId === collaborateurId;
      const matchesStatus = filterStatus === "all" || filterStatus === card.status;
      return matchesCollaborateur && matchesStatus;
    });
  }, [employeeCards, collaborateurId, filterStatus]);

  // Reset all filters
  const handleResetFilters = () => {
    setCollaborateurId(null);
    setSelectedCollaborateur(null);
    setFilterStatus("all");
    setFilterType("today");
    setSelectedDate(new Date().toISOString().split("T")[0]);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box display="flex" alignItems="center">
                  <TodayIcon sx={{ mr: 1 }} />
                  <MDTypography variant="h6" color="white">
                    Pointage
                  </MDTypography>
                </Box>
                <Badge badgeContent={activeFiltersCount} color="error" sx={{ mr: 1 }}>
                  <Tooltip title={filtersExpanded ? "Réduire les filtres" : "Étendre les filtres"}>
                    <IconButton
                      color="white"
                      size="small"
                      onClick={() => setFiltersExpanded(!filtersExpanded)}
                    >
                      <FilterAltIcon />
                    </IconButton>
                  </Tooltip>
                </Badge>
              </MDBox>

              {filtersExpanded && (
                <Paper
                  elevation={0}
                  sx={{
                    m: 2,
                    p: 2,
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                  }}
                >
                  <Box display="flex" flexWrap="wrap" alignItems="center" gap={2}>
                    <Box display="flex" alignItems="center" sx={{ minWidth: 260 }}>
                      <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />
                      <AutocompleteField
                        useFetchHook={() => useGetCollaborateursByManagerQuery(managerId)}
                        fullWidth
                        setSelectedItem={setSelectedCollaborateur}
                        setIdItem={setCollaborateurId}
                        selectedItem={selectedCollaborateur}
                        label="Choisir un collaborateur"
                        sx={{ backgroundColor: "white", borderRadius: "8px" }}
                      />
                    </Box>

                    <FormControl sx={{ minWidth: 220 }}>
                      <InputLabel id="filter-type-label">Période</InputLabel>
                      <Select
                        labelId="filter-type-label"
                        label="Période"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        sx={{ height: "45px", backgroundColor: "white", borderRadius: "8px" }}
                        startAdornment={
                          <CalendarTodayIcon
                            fontSize="small"
                            sx={{ mr: 1, ml: -0.5, color: "text.secondary" }}
                          />
                        }
                      >
                        <MenuItem value="today">{"Aujourd'hui"}</MenuItem>
                        <MenuItem value="yesterday">Hier</MenuItem>
                        <MenuItem value="custom">Personnalisée</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 220 }}>
                      <InputLabel id="status-label">Status</InputLabel>
                      <Select
                        labelId="status-label"
                        label="Status"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        sx={{ height: "45px", backgroundColor: "white", borderRadius: "8px" }}
                        startAdornment={
                          <Box sx={{ mr: 1, ml: -0.5, color: "text.secondary" }}>
                            {statusOptions.find((option) => option.value === filterStatus)
                              ?.icon || <FilterAltIcon fontSize="small" />}
                          </Box>
                        }
                      >
                        {statusOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            <Box display="flex" alignItems="center">
                              {option.icon}
                              <Box ml={1}>{option.label}</Box>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {filterType === "custom" && (
                      <TextField
                        type="date"
                        label="Date personnalisée"
                        InputLabelProps={{ shrink: true }}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        inputProps={{ max: new Date().toISOString().split("T")[0] }}
                        sx={{ minWidth: 220, backgroundColor: "white", borderRadius: "8px" }}
                      />
                    )}

                    <Tooltip title="Rafraîchir les données">
                      <IconButton
                        onClick={() => refetchEmployeeCards()}
                        sx={{ backgroundColor: "white", boxShadow: 1 }}
                      >
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Réinitialiser les filtres">
                      <IconButton
                        onClick={handleResetFilters}
                        sx={{ backgroundColor: "white", boxShadow: 1 }}
                        disabled={activeFiltersCount === 0}
                      >
                        <ClearIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {activeFiltersCount > 0 && (
                    <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
                      {collaborateurId !== null && (
                        <Chip
                          label={`Collaborateur: ${selectedCollaborateur?.label || "Sélectionné"}`}
                          onDelete={() => {
                            setCollaborateurId(null);
                            setSelectedCollaborateur(null);
                          }}
                          color="primary"
                          variant="outlined"
                          icon={<PersonIcon fontSize="small" />}
                        />
                      )}
                      {filterStatus !== "all" && (
                        <Chip
                          label={`Status: ${
                            statusOptions.find((o) => o.value === filterStatus)?.label ||
                            filterStatus
                          }`}
                          onDelete={() => setFilterStatus("all")}
                          color="primary"
                          variant="outlined"
                          icon={statusOptions.find((o) => o.value === filterStatus)?.icon}
                        />
                      )}
                      {filterType !== "today" && (
                        <Chip
                          label={`Période: ${filterType === "yesterday" ? "Hier" : selectedDate}`}
                          onDelete={() => {
                            setFilterType("today");
                            setSelectedDate(new Date().toISOString().split("T")[0]);
                          }}
                          color="primary"
                          variant="outlined"
                          icon={<CalendarTodayIcon fontSize="small" />}
                        />
                      )}
                    </Box>
                  )}
                </Paper>
              )}

              <Divider />

              <MDBox p={3}>
                {isLoading ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ minHeight: "300px" }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                      <Typography variant="subtitle1">
                        {filteredEmployeeCards.length} collaborateur
                        {filteredEmployeeCards.length !== 1 ? "s" : ""} trouvé
                        {filteredEmployeeCards.length !== 1 ? "s" : ""}
                      </Typography>

                      {/* Summary stats could go here */}
                      <Box display="flex" gap={2}>
                        <Chip
                          label={`${employeeCards.filter((c) => !c.late).length} à l'heure`}
                          color="success"
                          variant="outlined"
                          size="small"
                        />
                        <Chip
                          label={`${employeeCards.filter((c) => c.late).length} en retard`}
                          color="error"
                          variant="outlined"
                          size="small"
                        />
                        <Chip
                          label={`${
                            employeeCards.filter((c) => c.status === "Absent").length
                          } absents`}
                          color="warning"
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                      {filteredEmployeeCards.length > 0 ? (
                        filteredEmployeeCards.map((card, index) => (
                          <EmployeeCard key={index} card={card} />
                        ))
                      ) : (
                        <Box
                          sx={{
                            width: "100%",
                            py: 8,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "text.secondary",
                          }}
                        >
                          <FilterAltIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
                          <Typography variant="h6">Aucun résultat trouvé</Typography>
                          <Typography variant="body2">Essayez de modifier vos filtres</Typography>
                          <IconButton onClick={handleResetFilters} sx={{ mt: 2 }} color="primary">
                            <RefreshIcon />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  </>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Pointage;
