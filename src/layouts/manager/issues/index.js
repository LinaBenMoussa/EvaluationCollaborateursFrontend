import { useState, useEffect, useMemo } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "store/slices/authSlice";
import {
  TextField,
  MenuItem,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Tooltip,
  Badge,
  Divider,
  useTheme,
} from "@mui/material";
import { useGetCollaborateursByManagerQuery } from "store/api/userApi";
import AutocompleteField from "layouts/shared/autocompleteField";
import { convertDateFormat, isDateInRange } from "functions/dateTime";
import { exportToExcel } from "functions/exportToExcel";
import { useGetIssuesQuery } from "store/api/issueApi";
import { useNavigate } from "react-router-dom";
import { formatDateWithTime } from "functions/dateTime";

// Status colors mapping with better color choices
const STATUS_COLORS = {
  Nouveau: "#2196F3", // Blue
  Résolu: "#4CAF50", // Green
  Fermé: "#607D8B", // Blue Grey
  Réouvert: "#FF9800", // Orange
  Assigné: "#9C27B0", // Purple
  Rejeté: "#F44336", // Red
  Reporté: "#795548", // Brown
  Dupliqué: "#9E9E9E", // Grey
  Ambigu: "#FFEB3B", // Yellow
  "En cours": "#00BCD4", // Cyan
  Ouvert: "#8BC34A", // Light Green
  "Négociation de l'offre": "#673AB7", // Deep Purple
  "Validation de l'offre": "#3F51B5", // Indigo
  "Clôture provisoire": "#E91E63", // Pink
};

// Translation dictionary for statuses
const STATUS_TRANSLATIONS = {
  New: "Nouveau",
  Resolved: "Résolu",
  Closed: "Fermé",
  Reopened: "Réouvert",
  Assigned: "Assigné",
  Rejected: "Rejeté",
  Deffered: "Reporté",
  Duplicate: "Dupliqué",
  Ambiguous: "Ambigu",
  "in progress": "En cours",
  open: "Ouvert",
  "Négociation Offre": "Négociation de l'offre",
  "Validation Offre.": "Validation de l'offre",
  "clôture provisoire": "Clôture provisoire",
};

// Date period options
const PERIOD_OPTIONS = [
  { value: "today", label: "Aujourd'hui" },
  { value: "yesterday", label: "Hier" },
  { value: "thisWeek", label: "Cette semaine" },
  { value: "thisMonth", label: "Ce mois" },
  { value: "thisYear", label: "Cette année" },
  { value: "custom", label: "Personnalisée" },
];

function IssuesList() {
  const theme = useTheme();
  const managerId = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  // State management
  const [collaborateurId, setCollaborateurId] = useState(null);
  const [selectedCollaborateur, setSelectedCollaborateur] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Tous");
  const [filterType, setFilterType] = useState("today");
  const [dateRanges, setDateRanges] = useState({
    debut: { start: "", end: "" },
    fin: { start: "", end: "" },
    echeance: { start: "", end: "" },
  });
  const [openFilter, setOpenFilter] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  // Fetch data
  const { data: issues = [], isLoading } = useGetIssuesQuery(managerId);

  // Calculate date ranges based on selected period
  const calculateDateRange = (period) => {
    const today = new Date();
    let startDate, endDate;

    switch (period) {
      case "today":
        startDate = endDate = new Date(today);
        break;
      case "yesterday":
        startDate = endDate = new Date(today);
        startDate.setDate(today.getDate() - 1);
        endDate.setDate(today.getDate() - 1);
        break;
      case "thisWeek":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay());
        endDate = new Date(today);
        endDate.setDate(today.getDate() + (6 - today.getDay()));
        break;
      case "thisMonth":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "thisYear":
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear(), 11, 31);
        break;
      case "custom":
        setOpenFilter(true);
        return;
      default:
        return;
    }

    // Format dates to YYYY-MM-DD
    const formatDate = (date) => date.toISOString().split("T")[0];

    // Set date ranges
    setDateRanges((prev) => ({
      ...prev,
      debut: {
        start: formatDate(startDate),
        end: formatDate(endDate),
      },
    }));
  };

  // Handle period change
  useEffect(() => {
    if (filterType !== "custom") {
      calculateDateRange(filterType);
    }
  }, [filterType]);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (filterStatus !== "Tous") count++;
    if (collaborateurId !== null) count++;
    if (dateRanges.debut.start || dateRanges.debut.end) count++;
    if (dateRanges.fin.start || dateRanges.fin.end) count++;
    if (dateRanges.echeance.start || dateRanges.echeance.end) count++;

    setActiveFilters(count);
  }, [filterStatus, collaborateurId, dateRanges]);

  // Navigate to details page
  const navigateToSaisie = (id) => navigate(`/saisie/${id}`);

  // Generate table rows
  const rows = useMemo(() => {
    return issues.map((issue) => {
      const translatedStatus = STATUS_TRANSLATIONS[issue.status?.name] || issue.status?.name;

      return {
        id: issue.id,
        sujet: issue.sujet,
        description: issue.description,
        type: issue.type,
        status: (
          <Chip
            label={translatedStatus}
            size="small"
            sx={{
              backgroundColor: STATUS_COLORS[translatedStatus] || theme.palette.grey[500],
              color: "#FFF",
              fontWeight: "bold",
              "& .MuiChip-label": { px: 1 },
            }}
          />
        ),
        date_debut: formatDateWithTime(issue.date_debut),
        date_echeance: formatDateWithTime(issue.date_echeance),
        date_fin: formatDateWithTime(issue.date_fin),
        collaborateur: `${issue.collaborateur.nom} ${issue.collaborateur.prenom}`,
        action: (
          <MDButton
            onClick={() => navigateToSaisie(issue.id)}
            color="info"
            variant="outlined"
            size="small"
          >
            Saisies
          </MDButton>
        ),
      };
    });
  }, [issues, theme.palette.grey]);

  // Table columns definition
  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id", align: "left", width: "50px" },
      { Header: "Sujet", accessor: "sujet", align: "left", width: "200px" },
      { Header: "Description", accessor: "description", align: "left", width: "250px" },
      { Header: "Type", accessor: "type", align: "center", width: "100px" },
      { Header: "Statut", accessor: "status", align: "center", width: "150px" },
      { Header: "Date début", accessor: "date_debut", align: "center" },
      { Header: "Date échéance", accessor: "date_echeance", align: "center" },
      { Header: "Date fin", accessor: "date_fin", align: "center" },
      { Header: "Collaborateur", accessor: "collaborateur", align: "center" },
      { Header: "Action", accessor: "action", align: "center", width: "100px" },
    ],
    []
  );

  // Filter rows based on selected filters
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const statusMatch = filterStatus === "Tous" ? true : row.status.props.label === filterStatus;

      const collaborateurMatch =
        collaborateurId !== null
          ? row.collaborateur === `${selectedCollaborateur?.nom} ${selectedCollaborateur?.prenom}`
          : true;

      const dateDebutMatch = isDateInRange(
        convertDateFormat(row.date_debut),
        dateRanges.debut.start,
        dateRanges.debut.end
      );

      const dateFinMatch =
        dateRanges.fin.start || dateRanges.fin.end
          ? isDateInRange(convertDateFormat(row.date_fin), dateRanges.fin.start, dateRanges.fin.end)
          : true;

      const dateEcheanceMatch =
        dateRanges.echeance.start || dateRanges.echeance.end
          ? isDateInRange(
              convertDateFormat(row.date_echeance),
              dateRanges.echeance.start,
              dateRanges.echeance.end
            )
          : true;

      return (
        statusMatch && collaborateurMatch && dateDebutMatch && dateFinMatch && dateEcheanceMatch
      );
    });
  }, [rows, filterStatus, collaborateurId, selectedCollaborateur, dateRanges]);

  // Handle date range changes
  const handleDateRangeChange = (field, type, value) => {
    setDateRanges((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [type]: value,
      },
    }));

    if (filterType !== "custom") {
      setFilterType("custom");
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilterStatus("Tous");
    setCollaborateurId(null);
    setSelectedCollaborateur(null);
    setDateRanges({
      debut: { start: "", end: "" },
      fin: { start: "", end: "" },
      echeance: { start: "", end: "" },
    });
    setFilterType("today");
    calculateDateRange("today");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)" }}>
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
                <MDTypography variant="h6" color="white">
                  Liste des Tâches
                </MDTypography>
                <MDBox>
                  <Tooltip title="Exporter en Excel">
                    <IconButton
                      color="white"
                      onClick={() => exportToExcel(filteredRows, "Liste_des_Taches")}
                      sx={{ mr: 1 }}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Filtres avancés">
                    <Badge
                      badgeContent={activeFilters}
                      color="secondary"
                      sx={{ "& .MuiBadge-badge": { fontSize: 10 } }}
                    >
                      <IconButton color="white" onClick={() => setOpenFilter(true)}>
                        <FilterListIcon />
                      </IconButton>
                    </Badge>
                  </Tooltip>
                </MDBox>
              </MDBox>

              <MDBox pt={3} pb={2} px={3}>
                {/* Quick filters section */}
                <MDBox display="flex" alignItems="center" mb={2}>
                  <FormControl sx={{ minWidth: 220, mr: 2 }}>
                    <InputLabel id="filter-type-label">Période</InputLabel>
                    <Select
                      labelId="filter-type-label"
                      label="Période"
                      value={filterType}
                      sx={{ width: 110, height: 40 }}
                      onChange={(e) => {
                        setFilterType(e.target.value);
                        if (e.target.value === "custom") {
                          setOpenFilter(true);
                        }
                      }}
                    >
                      {PERIOD_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {activeFilters > 0 && (
                    <MDButton
                      variant="text"
                      color="error"
                      size="small"
                      onClick={handleResetFilters}
                    >
                      Réinitialiser les filtres
                    </MDButton>
                  )}
                </MDBox>

                {/* Active filters display */}
                {activeFilters > 0 && (
                  <MDBox display="flex" flexWrap="wrap" gap={1} mb={3}>
                    {filterStatus !== "Tous" && (
                      <Chip
                        label={`Statut: ${filterStatus}`}
                        onDelete={() => setFilterStatus("Tous")}
                        size="small"
                        color="primary"
                      />
                    )}
                    {collaborateurId !== null && (
                      <Chip
                        label={`Collaborateur: ${selectedCollaborateur?.nom} ${selectedCollaborateur?.prenom}`}
                        onDelete={() => {
                          setCollaborateurId(null);
                          setSelectedCollaborateur(null);
                        }}
                        size="small"
                        color="primary"
                      />
                    )}
                    {(dateRanges.debut.start || dateRanges.debut.end) && (
                      <Chip
                        label={`Début: ${dateRanges.debut.start || ""} - ${
                          dateRanges.debut.end || ""
                        }`}
                        onDelete={() =>
                          setDateRanges((prev) => ({ ...prev, debut: { start: "", end: "" } }))
                        }
                        size="small"
                        color="primary"
                      />
                    )}
                    {(dateRanges.fin.start || dateRanges.fin.end) && (
                      <Chip
                        label={`Fin: ${dateRanges.fin.start || ""} - ${dateRanges.fin.end || ""}`}
                        onDelete={() =>
                          setDateRanges((prev) => ({ ...prev, fin: { start: "", end: "" } }))
                        }
                        size="small"
                        color="primary"
                      />
                    )}
                    {(dateRanges.echeance.start || dateRanges.echeance.end) && (
                      <Chip
                        label={`Échéance: ${dateRanges.echeance.start || ""} - ${
                          dateRanges.echeance.end || ""
                        }`}
                        onDelete={() =>
                          setDateRanges((prev) => ({ ...prev, echeance: { start: "", end: "" } }))
                        }
                        size="small"
                        color="primary"
                      />
                    )}
                  </MDBox>
                )}

                {/* Task count summary */}
                <MDBox mb={2}>
                  <MDTypography variant="button" fontWeight="regular" color="text">
                    {filteredRows.length}{" "}
                    {filteredRows.length > 1 ? "tâches trouvées" : "tâche trouvée"}
                  </MDTypography>
                </MDBox>

                {/* Data table */}
                {isLoading ? (
                  <MDBox
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ minHeight: "300px" }}
                  >
                    <CircularProgress />
                  </MDBox>
                ) : (
                  <DataTable
                    table={{ columns, rows: filteredRows }}
                    isSorted={true}
                    entriesPerPage={{
                      defaultValue: 10,
                      entries: [5, 10, 15, 20, 25],
                    }}
                    showTotalEntries={true}
                    canSearch={true}
                    noEndBorder={true}
                  />
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Filter drawer */}
      <Drawer
        anchor="right"
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: 450 },
            padding: 2,
          },
        }}
      >
        <MDBox p={3} height="100%" display="flex" flexDirection="column">
          <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <MDTypography variant="h5">Filtres avancés</MDTypography>
            <IconButton onClick={() => setOpenFilter(false)}>&times;</IconButton>
          </MDBox>

          <MDBox display="flex" flexDirection="column" gap={3} flex="1" overflow="auto">
            {/* Collaborator filter */}
            <MDBox>
              <MDTypography variant="subtitle2" fontWeight="medium" mb={1}>
                Collaborateur
              </MDTypography>
              <AutocompleteField
                useFetchHook={() => useGetCollaborateursByManagerQuery(managerId)}
                fullWidth
                setSelectedItem={setSelectedCollaborateur}
                setIdItem={setCollaborateurId}
                selectedItem={selectedCollaborateur}
                label="Choisir un collaborateur"
              />
            </MDBox>

            {/* Status filter */}
            <MDBox>
              <MDTypography variant="subtitle2" fontWeight="medium" mb={1}>
                Statut
              </MDTypography>
              <FormControl fullWidth>
                <InputLabel id="status-select-label">Statut</InputLabel>
                <Select
                  labelId="status-select-label"
                  sx={{ height: 40 }}
                  label="Statut"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="Tous">Tous les statuts</MenuItem>
                  {Object.values(STATUS_TRANSLATIONS).map((status) => (
                    <MenuItem key={status} value={status}>
                      <MDBox display="flex" alignItems="center">
                        <MDBox
                          width={12}
                          height={12}
                          borderRadius="50%"
                          mr={1}
                          backgroundColor={STATUS_COLORS[status] || "grey"}
                        />
                        {status}
                      </MDBox>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>

            {/* Date ranges */}
            {/* Start date range */}
            <MDBox>
              <MDTypography variant="subtitle2" fontWeight="medium" mb={1}>
                Date de début
              </MDTypography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    type="date"
                    label="De"
                    InputLabelProps={{ shrink: true }}
                    value={dateRanges.debut.start}
                    onChange={(e) => handleDateRangeChange("debut", "start", e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="date"
                    label="À"
                    InputLabelProps={{ shrink: true }}
                    value={dateRanges.debut.end}
                    onChange={(e) => handleDateRangeChange("debut", "end", e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
              </Grid>
            </MDBox>

            {/* End date range */}
            <MDBox>
              <MDTypography variant="subtitle2" fontWeight="medium" mb={1}>
                Date de fin
              </MDTypography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    type="date"
                    label="De"
                    InputLabelProps={{ shrink: true }}
                    value={dateRanges.fin.start}
                    onChange={(e) => handleDateRangeChange("fin", "start", e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="date"
                    label="À"
                    InputLabelProps={{ shrink: true }}
                    value={dateRanges.fin.end}
                    onChange={(e) => handleDateRangeChange("fin", "end", e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
              </Grid>
            </MDBox>

            {/* Due date range */}
            <MDBox>
              <MDTypography variant="subtitle2" fontWeight="medium" mb={1}>
                {"Date d'échéance"}
              </MDTypography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    type="date"
                    label="De"
                    InputLabelProps={{ shrink: true }}
                    value={dateRanges.echeance.start}
                    onChange={(e) => handleDateRangeChange("echeance", "start", e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="date"
                    label="À"
                    InputLabelProps={{ shrink: true }}
                    value={dateRanges.echeance.end}
                    onChange={(e) => handleDateRangeChange("echeance", "end", e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
              </Grid>
            </MDBox>
          </MDBox>

          {/* Action buttons */}
          <MDBox mt={3} display="flex" justifyContent="space-between">
            <MDButton color="error" onClick={handleResetFilters} variant="outlined">
              Réinitialiser
            </MDButton>
            <MDButton color="info" onClick={() => setOpenFilter(false)}>
              Appliquer
            </MDButton>
          </MDBox>
        </MDBox>
      </Drawer>
    </DashboardLayout>
  );
}

export default IssuesList;
