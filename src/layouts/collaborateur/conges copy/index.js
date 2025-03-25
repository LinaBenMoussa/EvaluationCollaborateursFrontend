import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
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
  TablePagination,
} from "@mui/material";
import { exportToExcel } from "functions/exportToExcel";

// Options pour les périodes
const PERIOD_OPTIONS = [
  { value: "today", label: "Aujourd'hui" },
  { value: "yesterday", label: "Hier" },
  { value: "thisWeek", label: "Cette semaine" },
  { value: "thisMonth", label: "Ce mois" },
  { value: "thisYear", label: "Cette année" },
  { value: "custom", label: "Personnalisée" },
];

// Options pour les types de congés
const TYPE_OPTIONS = [
  { value: "Tous", label: "Tous les types" },
  { value: "A", label: "Autorisation" },
  { value: "C", label: "Congé annuel" },
];

function CongesList() {
  const collaborateurId = useSelector(selectCurrentUser);

  // State management
  const [filterType, setFilterType] = useState("Tous");
  const [filterPeriode, setFilterPeriode] = useState("thisMonth");
  const [dateRanges, setDateRanges] = useState({
    debut: { start: "", end: "" },
    fin: { start: "", end: "" },
  });
  const [openFilter, setOpenFilter] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch data with API filters and pagination
  const { columns, rows, isLoading, total } = useCongesTableData(collaborateurId, {
    startDateDebut: dateRanges.debut.start,
    endDateDebut: dateRanges.debut.end,
    startDateFin: dateRanges.fin.start,
    endDateFin: dateRanges.fin.end,
    type: filterType,
    page,
    pageSize: rowsPerPage,
  });

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
      default:
        return;
    }

    // Format dates to YYYY-MM-DD
    const formatDate = (date) => date.toISOString().split("T")[0];

    setDateRanges({
      debut: {
        start: formatDate(startDate),
        end: formatDate(endDate),
      },
      fin: { start: "", end: "" },
    });
  };

  // Handle period change
  useEffect(() => {
    if (filterPeriode !== "custom") {
      calculateDateRange(filterPeriode);
      setPage(0);
    }
  }, [filterPeriode]);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (filterType !== "Tous") count++;
    if (dateRanges.debut.start || dateRanges.debut.end) count++;
    if (dateRanges.fin.start || dateRanges.fin.end) count++;
    setActiveFilters(count);
  }, [filterType, dateRanges]);

  // Handle date range changes
  const handleDateRangeChange = (field, type, value) => {
    setDateRanges((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [type]: value,
      },
    }));
    setFilterPeriode("custom");
    setPage(0);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilterType("Tous");
    setDateRanges({
      debut: { start: "", end: "" },
      fin: { start: "", end: "" },
    });
    setFilterPeriode("thisMonth");
    calculateDateRange("thisMonth");
    setPage(0);
  };

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Apply filters when drawer is closed
  const handleApplyFilters = () => {
    setPage(0);
    setOpenFilter(false);
  };

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
                      onClick={() => exportToExcel(rows, "Liste_des_Congés")}
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
                      sx={{ height: 40 }}
                      onChange={(e) => {
                        setFilterPeriode(e.target.value);
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
                    {filterType !== "Tous" && (
                      <Chip
                        label={`Type: ${TYPE_OPTIONS.find((t) => t.value === filterType)?.label}`}
                        onDelete={() => setFilterType("Tous")}
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
                  </MDBox>
                )}

                {/* Task count summary */}
                <MDBox mb={2}>
                  <MDTypography variant="button" fontWeight="regular" color="text">
                    {total} {total > 1 ? "congés trouvés" : "congé trouvé"}
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
                  <>
                    <DataTable
                      table={{ columns, rows }}
                      isSorted={true}
                      entriesPerPage={false}
                      showTotalEntries={false}
                      canSearch={true}
                      noEndBorder={true}
                    />
                    <TablePagination
                      component="div"
                      count={total}
                      page={page}
                      onPageChange={handlePageChange}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={handleRowsPerPageChange}
                      rowsPerPageOptions={[5, 10, 25, 50]}
                      labelRowsPerPage="Lignes par page:"
                      labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
                      }
                    />
                  </>
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
            <IconButton onClick={() => setOpenFilter(false)}>
              <CloseIcon />
            </IconButton>
          </MDBox>

          <MDBox display="flex" flexDirection="column" gap={3} flex="1" overflow="auto">
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
                  {TYPE_OPTIONS.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>

            {/* Date ranges */}
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
          </MDBox>

          {/* Action buttons */}
          <MDBox mt={3} display="flex" justifyContent="space-between">
            <MDButton color="error" onClick={handleResetFilters} variant="outlined">
              Réinitialiser
            </MDButton>
            <MDButton color="info" onClick={handleApplyFilters}>
              Appliquer
            </MDButton>
          </MDBox>
        </MDBox>
      </Drawer>
    </DashboardLayout>
  );
}

export default CongesList;
