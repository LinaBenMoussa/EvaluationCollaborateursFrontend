import { useEffect, useMemo, useState } from "react";
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
import { useCongesTableData } from "./data/useCongesTableData";
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
} from "@mui/material";
import { useGetCollaborateursByManagerQuery } from "store/api/userApi";
import AutocompleteField from "layouts/shared/autocompleteField";
import { convertDateFormat, isDateInRange } from "functions/dateTime";
import { exportToExcel } from "functions/exportToExcel";

// Colors for types
const TYPE_COLORS = {
  "Congé annuel": "#4CAF50", // Green
  Autorisation: "#2196F3", // Blue
};

function CongesList() {
  const managerId = useSelector(selectCurrentUser);
  const [collaborateurId, setCollaborateurId] = useState(null);
  const [selectedCollaborateur, setSelectedCollaborateur] = useState(null);
  const [filterType, setFilterType] = useState("Tous");
  const [selectedDateDebut1, setSelectedDateDebut1] = useState("");
  const [selectedDateDebut2, setSelectedDateDebut2] = useState("");
  const [selectedDateFin1, setSelectedDateFin1] = useState("");
  const [selectedDateFin2, setSelectedDateFin2] = useState("");
  const [filterPeriode, setFilterPeriode] = useState("thisMonth");
  const [openFilter, setOpenFilter] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  const { columns: columnsData, rows: rowsData, isLoading } = useCongesTableData(managerId);

  // Calculate date range based on selected period
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

    // Set all date ranges to the calculated dates
    setSelectedDateDebut1(formatDate(startDate));
    setSelectedDateDebut2(formatDate(endDate));
  };

  // Effect to handle period change
  useEffect(() => {
    if (filterPeriode !== "custom") {
      calculateDateRange(filterPeriode);
    }
  }, [filterPeriode]);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (filterType !== "Tous") count++;
    if (collaborateurId !== null) count++;
    if (selectedDateDebut1 || selectedDateDebut2) count++;
    if (selectedDateFin1 || selectedDateFin2) count++;

    setActiveFilters(count);
  }, [
    filterType,
    collaborateurId,
    selectedDateDebut1,
    selectedDateDebut2,
    selectedDateFin1,
    selectedDateFin2,
  ]);

  // Reset all filters
  const handleResetFilters = () => {
    setFilterType("Tous");
    setCollaborateurId(null);
    setSelectedCollaborateur(null);
    setSelectedDateDebut1("");
    setSelectedDateDebut2("");
    setSelectedDateFin1("");
    setSelectedDateFin2("");
    setFilterPeriode("thisMonth");
    calculateDateRange("thisMonth");
  };

  // Filter rows based on selected filters
  const filteredRows = rowsData.filter((row) => {
    const typeMatch = filterType !== "Tous" ? row.type === filterType : true;
    const collaborateurMatch =
      collaborateurId !== null
        ? row.collaborateur === `${selectedCollaborateur?.nom} ${selectedCollaborateur?.prenom}`
        : true;
    return (
      typeMatch &&
      collaborateurMatch &&
      isDateInRange(convertDateFormat(row.dateDebut), selectedDateDebut1, selectedDateDebut2) &&
      isDateInRange(convertDateFormat(row.dateFin), selectedDateFin1, selectedDateFin2)
    );
  });

  // Generate table rows with colors
  const rows = useMemo(() => {
    return filteredRows.map((row) => ({
      ...row,
      type: (
        <Chip
          label={row.type}
          size="small"
          sx={{
            backgroundColor: TYPE_COLORS[row.type] || theme.palette.grey[500],
            color: "#FFF",
            fontWeight: "bold",
            "& .MuiChip-label": { px: 1 },
          }}
        />
      ),
    }));
  }, [filteredRows]);

  // Table columns definition
  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id", align: "left", width: "50px" },
      { Header: "Collaborateur", accessor: "collaborateur", align: "left", width: "200px" },
      { Header: "Type", accessor: "type", align: "center", width: "150px" },
      { Header: "Date début", accessor: "dateDebut", align: "center" },
      { Header: "Date fin", accessor: "dateFin", align: "center" },
      { Header: "Statut", accessor: "statut", align: "center" },
    ],
    []
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
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
                  Liste des Congés
                </MDTypography>
                <MDBox>
                  <Tooltip title="Exporter en Excel">
                    <IconButton
                      color="white"
                      onClick={() => exportToExcel(filteredRows, "Liste_des_Congés")}
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
                      value={filterPeriode}
                      sx={{ width: 110, height: 40 }}
                      onChange={(e) => {
                        setFilterPeriode(e.target.value);
                        if (e.target.value === "custom") {
                          setOpenFilter(true);
                        }
                      }}
                    >
                      <MenuItem value="today">{"Aujourd'hui"}</MenuItem>
                      <MenuItem value="yesterday">Hier</MenuItem>
                      <MenuItem value="thisWeek">Cette semaine</MenuItem>
                      <MenuItem value="thisMonth">Ce mois</MenuItem>
                      <MenuItem value="thisYear">Cette année</MenuItem>
                      <MenuItem value="custom">Personnalisée</MenuItem>
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
                    {filterType !== "Tous" && (
                      <Chip
                        label={`Type: ${filterType}`}
                        onDelete={() => setFilterType("Tous")}
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
                    {(selectedDateDebut1 || selectedDateDebut2) && (
                      <Chip
                        label={`Début: ${selectedDateDebut1 || ""} - ${selectedDateDebut2 || ""}`}
                        onDelete={() => {
                          setSelectedDateDebut1("");
                          setSelectedDateDebut2("");
                        }}
                        size="small"
                        color="primary"
                      />
                    )}
                    {(selectedDateFin1 || selectedDateFin2) && (
                      <Chip
                        label={`Fin: ${selectedDateFin1 || ""} - ${selectedDateFin2 || ""}`}
                        onDelete={() => {
                          setSelectedDateFin1("");
                          setSelectedDateFin2("");
                        }}
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
                    {filteredRows.length > 1 ? "congés trouvés" : "congé trouvé"}
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
                    table={{ columns, rows }}
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

            {/* Type filter */}
            <MDBox>
              <MDTypography variant="subtitle2" fontWeight="medium" mb={1}>
                Type
              </MDTypography>
              <FormControl fullWidth>
                <InputLabel id="type-select-label">Type</InputLabel>
                <Select
                  labelId="type-select-label"
                  sx={{ height: 40 }}
                  label="Type"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <MenuItem value="Tous">Tous les types</MenuItem>
                  {Object.entries(TYPE_COLORS).map(([type, color]) => (
                    <MenuItem key={type} value={type}>
                      <MDBox display="flex" alignItems="center">
                        <MDBox
                          width={12}
                          height={12}
                          borderRadius="50%"
                          mr={1}
                          backgroundColor={color}
                        />
                        {type}
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
                    value={selectedDateDebut1}
                    onChange={(e) => setSelectedDateDebut1(e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="date"
                    label="À"
                    InputLabelProps={{ shrink: true }}
                    value={selectedDateDebut2}
                    onChange={(e) => setSelectedDateDebut2(e.target.value)}
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
                    value={selectedDateFin1}
                    onChange={(e) => setSelectedDateFin1(e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="date"
                    label="À"
                    InputLabelProps={{ shrink: true }}
                    value={selectedDateFin2}
                    onChange={(e) => setSelectedDateFin2(e.target.value)}
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

export default CongesList;
