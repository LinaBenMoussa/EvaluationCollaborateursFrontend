import { useState, useEffect, useMemo } from "react";
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
  IconButton,
  Chip,
  Typography,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import TodayIcon from "@mui/icons-material/Today";
import PersonIcon from "@mui/icons-material/Person";
import ClearIcon from "@mui/icons-material/Clear";
import RefreshIcon from "@mui/icons-material/Refresh";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import AutocompleteField from "layouts/shared/autocompleteField";
import { useGetEmployeeCardsQuery } from "store/api/employeeCardApi";
import { selectCurrentUser } from "store/slices/authSlice";
import EmployeeCard from "./employeeCard";
import { useGetCollaborateursByManagerQuery } from "store/api/userApi";
import { Header } from "layouts/shared/Header";
import FiltreRapide from "layouts/shared/FiltreRapide";
import { FiltreAvancee } from "layouts/shared/FiltreAvancee";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [collaborateurId, setCollaborateurId] = useState(null);
  const [selectedCollaborateur, setSelectedCollaborateur] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [filterType, setFilterType] = useState("today");
  const [openFilter, setOpenFilter] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const managerId = useSelector(selectCurrentUser);

  const {
    data: employeeCards = [],
    isLoading,
    refetch: refetchEmployeeCards,
  } = useGetEmployeeCardsQuery({
    managerId,
    selectedDate,
  });

  useEffect(() => {
    if (filterType === "today") {
      setSelectedDate(new Date().toISOString().split("T")[0]);
    } else if (filterType === "yesterday") {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      setSelectedDate(yesterday.toISOString().split("T")[0]);
    } else {
      setOpenFilter(true);
    }
  }, [filterType]);

  useEffect(() => {
    refetchEmployeeCards();
  }, [selectedDate]);
  useEffect(() => {
    refetchEmployeeCards();
  }, [collaborateurId]);

  // Handle date change in the advanced filter
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);

    // Change filter type to custom when date is manually selected
    if (newDate !== new Date().toISOString().split("T")[0]) {
      setFilterType("custom");
    }
  };

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
        collaborateurId === null ||
        card.collaborateurNom === selectedCollaborateur.nom + " " + selectedCollaborateur.prenom;
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

  // Apply filters when drawer is closed
  const handleApplyFilters = () => {
    setOpenFilter(false);
    refetchEmployeeCards();
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={3} pb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card
              sx={{
                borderRadius: "15px",
                boxShadow: "0 8px 24px 0 rgba(0,0,0,0.08)",
                overflow: "hidden",
              }}
            >
              <Header
                rows={filteredEmployeeCards}
                activeFilters={activeFiltersCount}
                setOpenFilter={setOpenFilter}
                theme={theme}
                title={"Pointage"}
                fileName={"pointage"}
                filtreExiste
                icon={<TodayIcon />}
              />

              <MDBox pt={3} pb={2} px={3}>
                <FiltreRapide
                  activeFilters={activeFiltersCount}
                  handleResetFilters={handleResetFilters}
                  theme={theme}
                  fields={
                    <>
                      <FormControl sx={{ minWidth: 220, mr: 2 }}>
                        <InputLabel id="filter-type-label">Période</InputLabel>
                        <Select
                          labelId="filter-type-label"
                          label="Période"
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                          sx={{ height: 40 }}
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
                    </>
                  }
                  chip={
                    activeFiltersCount > 0 && (
                      <MDBox display="flex" flexWrap="wrap" gap={1} mb={3}>
                        {collaborateurId !== null && (
                          <Chip
                            label={`Collaborateur: ${
                              selectedCollaborateur?.nom + " " + selectedCollaborateur?.prenom ||
                              "Sélectionné"
                            }`}
                            onDelete={() => {
                              setCollaborateurId(null);
                              setSelectedCollaborateur(null);
                            }}
                            size="small"
                            color="primary"
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
                            size="small"
                            color="primary"
                            icon={statusOptions.find((o) => o.value === filterStatus)?.icon}
                          />
                        )}
                        {filterType !== "today" && (
                          <Chip
                            label={`Période: ${
                              filterType === "yesterday"
                                ? "Hier"
                                : "Date personnalisée: " + selectedDate
                            }`}
                            onDelete={() => {
                              setFilterType("today");
                              setSelectedDate(new Date().toISOString().split("T")[0]);
                            }}
                            size="small"
                            color="primary"
                            icon={<CalendarTodayIcon fontSize="small" />}
                          />
                        )}
                      </MDBox>
                    )
                  }
                />

                <Divider sx={{ my: 2 }} />

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

                      {/* Summary stats */}
                      <Box display="flex" gap={2}>
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

      <FiltreAvancee
        openFilter={openFilter}
        setOpenFilter={setOpenFilter}
        isMobile={isMobile}
        theme={theme}
        handleApplyFilters={handleApplyFilters}
        handleResetFilters={handleResetFilters}
        alpha={alpha}
      >
        <MDBox>
          <MDTypography variant="subtitle1" fontWeight="medium" mb={1} color="text">
            Collaborateur
          </MDTypography>
          <AutocompleteField
            useFetchHook={() => useGetCollaborateursByManagerQuery(managerId)}
            fullWidth
            setSelectedItem={setSelectedCollaborateur}
            setIdItem={setCollaborateurId}
            selectedItem={selectedCollaborateur}
            label="Choisir un collaborateur"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
        </MDBox>
        <MDBox>
          <MDTypography variant="subtitle1" fontWeight="medium" mb={1} color="text">
            Status
          </MDTypography>
          <FormControl fullWidth>
            <InputLabel id="status-advanced-label">Status</InputLabel>
            <Select
              labelId="status-advanced-label"
              label="Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              sx={{ height: 45 }}
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
        </MDBox>
        <MDBox>
          <MDTypography variant="subtitle1" fontWeight="medium" mb={1} color="text">
            Date
          </MDTypography>
          <TextField
            type="date"
            label="Date personnalisée"
            InputLabelProps={{ shrink: true }}
            value={selectedDate}
            onChange={handleDateChange}
            inputProps={{ max: new Date().toISOString().split("T")[0] }}
            fullWidth
            sx={{ height: 45 }}
          />
        </MDBox>
      </FiltreAvancee>
    </DashboardLayout>
  );
}

export default Pointage;
