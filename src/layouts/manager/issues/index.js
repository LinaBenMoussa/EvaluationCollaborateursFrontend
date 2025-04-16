import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import {
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  useTheme,
  alpha,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "store/slices/authSlice";
import { useGetCollaborateursByManagerQuery } from "store/api/userApi";
import AutocompleteField from "layouts/shared/autocompleteField";
import { useIssuesTableData } from "./data/useIssuesTableData";
import { Header } from "layouts/shared/Header";
import FiltreRapide from "layouts/shared/FiltreRapide";
import Table from "layouts/shared/Table";
import { FiltreAvancee } from "layouts/shared/FiltreAvancee";
import { convertDateFormat } from "functions/dateTime";
import { formatDate } from "functions/dateTime";
import { getStartDate } from "functions/startDate";
import { useFiltreIssuesQuery } from "store/api/issueApi";
import { STATUS_OPTIONS } from "./constants";
import ExcelExportDialog from "./exportToExcelDialog";
import Footer from "examples/Footer";

// Period options
const PERIOD_OPTIONS = [
  { value: "today", label: "Aujourd'hui" },
  { value: "yesterday", label: "Hier" },
  { value: "thisWeek", label: "Cette semaine" },
  { value: "thisMonth", label: "Ce mois" },
  { value: "thisYear", label: "Cette année" },
  { value: "custom", label: "Personnalisée" },
];

// Date filter types
const DATE_FILTER_TYPES = {
  DATE_DEBUT: "date_debut",
  DATE_ECHEANCE: "date_echeance",
  DATE_FIN: "date_fin",
};

function IssuesList() {
  const theme = useTheme();
  const managerId = useSelector(selectCurrentUser);

  // State management
  const [collaborateurId, setCollaborateurId] = useState(null);
  const [selectedCollaborateur, setSelectedCollaborateur] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Tous");
  const [filterType, setFilterType] = useState("thisWeek");

  // Date type tabs for advanced filter
  const [dateFilterTab, setDateFilterTab] = useState(0);

  // Date filter states for all three date types
  // Date début
  const [selectedStartDateDebut, setSelectedStartDateDebut] = useState("");
  const [selectedEndDateDebut, setSelectedEndDateDebut] = useState("");

  // Date échéance
  const [selectedStartDateEcheance, setSelectedStartDateEcheance] = useState("");
  const [selectedEndDateEcheance, setSelectedEndDateEcheance] = useState("");

  // Date fin
  const [selectedStartDateFin, setSelectedStartDateFin] = useState("");
  const [selectedEndDateFin, setSelectedEndDateFin] = useState("");

  // For compatibility with existing code - maps to selectedStartDateDebut and selectedEndDateDebut
  const [selectedDate1, setSelectedDate1] = useState(new Date().toISOString().split("T")[0]);
  const [selectedDate2, setSelectedDate2] = useState(new Date().toISOString().split("T")[0]);

  const [openFilter, setOpenFilter] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    startDateDebut: "",
    endDateDebut: "",
    startDateFin: "",
    endDateFin: "",
    startDateEcheance: "",
    endDateEcheance: "",
    collaborateurId: null,
    status: "Tous",
  });

  // Handle date tab change in advanced filters
  const handleDateTabChange = (event, newValue) => {
    setDateFilterTab(newValue);
  };

  // Fetch data with API filters and pagination
  const { columns, rows, isLoading, total } = useIssuesTableData(managerId, {
    ...filters,
    page,
    pageSize: rowsPerPage,
  });

  // Calculate date ranges based on selected period (for quick filter)
  useEffect(() => {
    const now = new Date();
    let start = "";
    let end = "";

    if (filterType === "today") {
      const today = convertDateFormat(formatDate(now));

      start = today;
      end = today;
    } else if (filterType === "yesterday") {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yest = convertDateFormat(formatDate(yesterday));
      start = yest;
      end = yest;
    } else if (filterType === "thisWeek") {
      const day = now.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const monday = new Date(now);
      monday.setDate(now.getDate() + diffToMonday);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      start = convertDateFormat(formatDate(monday));
      end = convertDateFormat(formatDate(sunday));
    } else if (filterType === "thisMonth") {
      const firstDay = getStartDate("month");
      const lastDay = now;
      start = convertDateFormat(formatDate(firstDay));
      end = convertDateFormat(formatDate(lastDay));
    } else if (filterType === "thisYear") {
      const firstDay = getStartDate("year");
      const lastDay = now;
      start = convertDateFormat(formatDate(firstDay));
      end = convertDateFormat(formatDate(lastDay));
    }

    setSelectedDate1(start);
    setSelectedDate2(end);

    // Set these for the advanced date filter too
    setSelectedStartDateDebut(start);
    setSelectedEndDateDebut(end);

    // Update filters for API call when dates change
    setFilters((prev) => ({
      ...prev,
      startDateDebut: start,
      endDateDebut: end,
    }));

    // Reset to first page when filters change
    setPage(0);
  }, [filterType]);

  // Update collaborateurId filter when it changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      collaborateurId,
    }));

    // Reset to first page when filters change
    setPage(0);
  }, [collaborateurId]);

  // Update date filters when custom dates are selected in quick filter
  useEffect(() => {
    if (filterType === "custom") {
      setFilters((prev) => ({
        ...prev,
        startDateDebut: selectedDate1,
        endDateDebut: selectedDate2,
      }));

      // Mirror these values to the advanced filter
      setSelectedStartDateDebut(selectedDate1);
      setSelectedEndDateDebut(selectedDate2);

      // Reset to first page when filters change
      setPage(0);
    }
  }, [selectedDate1, selectedDate2, filterType]);

  // Update status filter
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      status: filterStatus,
    }));

    // Reset to first page when filters change
    setPage(0);
  }, [filterStatus]);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (filterStatus !== "Tous") count++;
    if (collaborateurId !== null) count++;

    // Count date filters
    if (selectedStartDateDebut || selectedEndDateDebut) count++;
    if (selectedStartDateEcheance || selectedEndDateEcheance) count++;
    if (selectedStartDateFin || selectedEndDateFin) count++;

    setActiveFilters(count);
  }, [
    filterStatus,
    collaborateurId,
    selectedStartDateDebut,
    selectedEndDateDebut,
    selectedStartDateEcheance,
    selectedEndDateEcheance,
    selectedStartDateFin,
    selectedEndDateFin,
  ]);

  // Reset all filters
  const handleResetFilters = () => {
    setFilterStatus("Tous");
    setCollaborateurId(null);
    setSelectedCollaborateur(null);

    // Reset all date filters
    setSelectedDate1(new Date().toISOString().split("T")[0]);
    setSelectedDate2(new Date().toISOString().split("T")[0]);
    setSelectedStartDateDebut("");
    setSelectedEndDateDebut("");
    setSelectedStartDateEcheance("");
    setSelectedEndDateEcheance("");
    setSelectedStartDateFin("");
    setSelectedEndDateFin("");

    setFilterType("today");
    setFilters({
      startDateDebut: "",
      endDateDebut: "",
      startDateFin: "",
      endDateFin: "",
      startDateEcheance: "",
      endDateEcheance: "",
      collaborateurId: null,
      status: "Tous",
    });
    setPage(0);
  };

  // Apply filters when drawer is closed
  const handleApplyFilters = () => {
    setFilters({
      startDateDebut: selectedStartDateDebut,
      endDateDebut: selectedEndDateDebut,
      startDateEcheance: selectedStartDateEcheance,
      endDateEcheance: selectedEndDateEcheance,
      startDateFin: selectedStartDateFin,
      endDateFin: selectedEndDateFin,
      collaborateurId,
      status: filterStatus,
    });

    // Update quick filter values for compatibility
    setSelectedDate1(selectedStartDateDebut);
    setSelectedDate2(selectedEndDateDebut);

    setPage(0);
    setOpenFilter(false);
  };

  // Handle page change
  const onPageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const onRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  // Generate a label for date period chips
  const getDatePeriodLabel = (startDate, endDate, type) => {
    let label = "";
    switch (type) {
      case DATE_FILTER_TYPES.DATE_DEBUT:
        label = "Date début";
        break;
      case DATE_FILTER_TYPES.DATE_ECHEANCE:
        label = "Date échéance";
        break;
      case DATE_FILTER_TYPES.DATE_FIN:
        label = "Date fin";
        break;
      default:
        label = "Période";
    }
    return `${label}: ${startDate || ""} - ${endDate || ""}`;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
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
                rows={rows.map((row) => ({
                  ...row,
                  status: row.status.props.label,
                }))}
                activeFilters={activeFilters}
                setOpenFilter={setOpenFilter}
                theme={theme}
                title={"Table des tâches"}
                fileName={"table_des_taches"}
                filtreExiste
                dialog={ExcelExportDialog}
                columns={columns}
              />

              <MDBox pt={3} pb={2} px={3}>
                <FiltreRapide
                  activeFilters={activeFilters}
                  handleResetFilters={handleResetFilters}
                  theme={theme}
                  setFilters={setFilters}
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
                        >
                          {PERIOD_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </>
                  }
                  chip={
                    activeFilters > 0 && (
                      <MDBox display="flex" flexWrap="wrap" gap={1} mb={3}>
                        {filterStatus !== "Tous" && (
                          <Chip
                            label={`Statut: ${filterStatus}`}
                            onDelete={() => {
                              setFilterStatus("Tous");
                              setFilters((prev) => ({ ...prev, status: "Tous" }));
                            }}
                            size="small"
                            color="primary"
                          />
                        )}
                        {collaborateurId !== null && selectedCollaborateur && (
                          <Chip
                            label={`Collaborateur: ${selectedCollaborateur?.nom} ${selectedCollaborateur?.prenom}`}
                            onDelete={() => {
                              setCollaborateurId(null);
                              setSelectedCollaborateur(null);
                              setFilters((prev) => ({ ...prev, collaborateurId: null }));
                            }}
                            size="small"
                            color="primary"
                          />
                        )}
                        {(selectedStartDateDebut || selectedEndDateDebut) && (
                          <Chip
                            label={getDatePeriodLabel(
                              selectedStartDateDebut,
                              selectedEndDateDebut,
                              DATE_FILTER_TYPES.DATE_DEBUT
                            )}
                            onDelete={() => {
                              setSelectedStartDateDebut("");
                              setSelectedEndDateDebut("");
                              setSelectedDate1("");
                              setSelectedDate2("");
                              setFilters((prev) => ({
                                ...prev,
                                startDateDebut: "",
                                endDateDebut: "",
                              }));
                            }}
                            size="small"
                            color="primary"
                          />
                        )}
                        {(selectedStartDateEcheance || selectedEndDateEcheance) && (
                          <Chip
                            label={getDatePeriodLabel(
                              selectedStartDateEcheance,
                              selectedEndDateEcheance,
                              DATE_FILTER_TYPES.DATE_ECHEANCE
                            )}
                            onDelete={() => {
                              setSelectedStartDateEcheance("");
                              setSelectedEndDateEcheance("");
                              setFilters((prev) => ({
                                ...prev,
                                startDateEcheance: "",
                                endDateEcheance: "",
                              }));
                            }}
                            size="small"
                            color="primary"
                          />
                        )}
                        {(selectedStartDateFin || selectedEndDateFin) && (
                          <Chip
                            label={getDatePeriodLabel(
                              selectedStartDateFin,
                              selectedEndDateFin,
                              DATE_FILTER_TYPES.DATE_FIN
                            )}
                            onDelete={() => {
                              setSelectedStartDateFin("");
                              setSelectedEndDateFin("");
                              setFilters((prev) => ({
                                ...prev,
                                startDateFin: "",
                                endDateFin: "",
                              }));
                            }}
                            size="small"
                            color="primary"
                          />
                        )}
                      </MDBox>
                    )
                  }
                />
                <Table
                  columns={columns}
                  rows={rows}
                  isLoading={isLoading}
                  total={total}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  onPageChange={onPageChange}
                  onRowsPerPageChange={onRowsPerPageChange}
                  theme={theme}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <FiltreAvancee
        openFilter={openFilter}
        setOpenFilter={setOpenFilter}
        isMobile={false}
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
            Statut
          </MDTypography>
          <FormControl fullWidth>
            <InputLabel id="status-select-label">Statut</InputLabel>
            <Select
              labelId="status-select-label"
              label="Statut"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              sx={{ height: 45 }}
            >
              {STATUS_OPTIONS.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </MDBox>

        {/* Date Filters with Tabs */}
        <MDBox>
          <MDTypography variant="subtitle1" fontWeight="medium" mb={1} color="text">
            Filtres par période
          </MDTypography>

          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs
              value={dateFilterTab}
              onChange={handleDateTabChange}
              variant="fullWidth"
              aria-label="date filter tabs"
            >
              <Tab label="Date début" />
              <Tab label="Date échéance" />
              <Tab label="Date fin" />
            </Tabs>
          </Box>

          {/* Date Début Filter (Tab 0) */}
          {dateFilterTab === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  type="date"
                  label="De"
                  InputLabelProps={{ shrink: true }}
                  value={selectedStartDateDebut}
                  onChange={(e) => {
                    setSelectedStartDateDebut(e.target.value);
                  }}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="date"
                  label="À"
                  InputLabelProps={{ shrink: true }}
                  value={selectedEndDateDebut}
                  onChange={(e) => {
                    setSelectedEndDateDebut(e.target.value);
                  }}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
            </Grid>
          )}

          {/* Date Échéance Filter (Tab 1) */}
          {dateFilterTab === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  type="date"
                  label="De"
                  InputLabelProps={{ shrink: true }}
                  value={selectedStartDateEcheance}
                  onChange={(e) => {
                    setSelectedStartDateEcheance(e.target.value);
                  }}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="date"
                  label="À"
                  InputLabelProps={{ shrink: true }}
                  value={selectedEndDateEcheance}
                  onChange={(e) => {
                    setSelectedEndDateEcheance(e.target.value);
                  }}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
            </Grid>
          )}

          {/* Date Fin Filter (Tab 2) */}
          {dateFilterTab === 2 && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  type="date"
                  label="De"
                  InputLabelProps={{ shrink: true }}
                  value={selectedStartDateFin}
                  onChange={(e) => {
                    setSelectedStartDateFin(e.target.value);
                  }}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="date"
                  label="À"
                  InputLabelProps={{ shrink: true }}
                  value={selectedEndDateFin}
                  onChange={(e) => {
                    setSelectedEndDateFin(e.target.value);
                  }}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
            </Grid>
          )}
        </MDBox>
      </FiltreAvancee>
      <Footer />
    </DashboardLayout>
  );
}

export default IssuesList;
