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
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "store/slices/authSlice";
import { useGetCollaborateursByManagerQuery } from "store/api/userApi";
import AutocompleteField from "layouts/shared/autocompleteField";
import { useCongesTableData } from "./data/useCongesTableData";
import { Header } from "layouts/shared/Header";
import FiltreRapide from "layouts/shared/FiltreRapide";
import Table from "layouts/shared/Table";
import { FiltreAvancee } from "layouts/shared/FiltreAvancee";

// Period options
const PERIOD_OPTIONS = [
  { value: "today", label: "Aujourd'hui" },
  { value: "yesterday", label: "Hier" },
  { value: "thisWeek", label: "Cette semaine" },
  { value: "thisMonth", label: "Ce mois" },
  { value: "thisYear", label: "Cette année" },
  { value: "custom", label: "Personnalisée" },
];

// Type options for filter
const TYPE_OPTIONS = [
  "Tous",
  "A", // Autorisation
  "C", // Congé annuel
];

function CongesList() {
  const theme = useTheme();
  const managerId = useSelector(selectCurrentUser);

  // State management
  const [collaborateurId, setCollaborateurId] = useState(null);
  const [selectedCollaborateur, setSelectedCollaborateur] = useState(null);
  const [filterType, setFilterType] = useState("Tous");
  const [filterPeriode, setFilterPeriode] = useState("thisMonth");
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
    collaborateurId: null,
    type: "Tous",
  });

  // Fetch data with API filters and pagination
  const { columns, rows, isLoading, total, handlePageChange, handlePageSizeChange } =
    useCongesTableData(managerId, {
      ...filters,
      page,
      pageSize: rowsPerPage,
    });

  // Calculate date ranges based on selected period
  useEffect(() => {
    const now = new Date();
    let start = "";
    let end = "";

    if (filterPeriode === "today") {
      const today = now.toISOString().split("T")[0];
      start = today;
      end = today;
    } else if (filterPeriode === "yesterday") {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yest = yesterday.toISOString().split("T")[0];
      start = yest;
      end = yest;
    } else if (filterPeriode === "thisWeek") {
      const day = now.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const monday = new Date(now);
      monday.setDate(now.getDate() + diffToMonday);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      start = monday.toISOString().split("T")[0];
      end = sunday.toISOString().split("T")[0];
    } else if (filterPeriode === "thisMonth") {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      start = firstDay.toISOString().split("T")[0];
      end = lastDay.toISOString().split("T")[0];
    } else if (filterPeriode === "thisYear") {
      const firstDay = new Date(now.getFullYear(), 0, 1);
      const lastDay = new Date(now.getFullYear(), 11, 31);
      start = firstDay.toISOString().split("T")[0];
      end = lastDay.toISOString().split("T")[0];
    }

    setSelectedDate1(start);
    setSelectedDate2(end);

    // Update filters for API call when dates change
    setFilters((prev) => ({
      ...prev,
      startDateDebut: start,
      endDateDebut: end,
    }));

    // Reset to first page when filters change
    setPage(0);
  }, [filterPeriode]);

  // Update collaborateurId filter when it changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      collaborateurId,
    }));

    // Reset to first page when filters change
    setPage(0);
  }, [collaborateurId]);

  // Update date filters when custom dates are selected
  useEffect(() => {
    if (filterPeriode === "custom") {
      setFilters((prev) => ({
        ...prev,
        startDateDebut: selectedDate1,
        endDateDebut: selectedDate2,
      }));

      // Reset to first page when filters change
      setPage(0);
    }
  }, [selectedDate1, selectedDate2, filterPeriode]);

  // Update type filter
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      type: filterType,
    }));

    // Reset to first page when filters change
    setPage(0);
  }, [filterType]);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (filterType !== "Tous") count++;
    if (collaborateurId !== null) count++;
    if (selectedDate1 || selectedDate2) count++;
    setActiveFilters(count);
  }, [filterType, collaborateurId, selectedDate1, selectedDate2]);

  // Reset all filters
  const handleResetFilters = () => {
    setFilterType("Tous");
    setCollaborateurId(null);
    setSelectedCollaborateur(null);
    setSelectedDate1(new Date().toISOString().split("T")[0]);
    setSelectedDate2(new Date().toISOString().split("T")[0]);
    setFilterPeriode("thisMonth");
    setFilters({
      startDateDebut: "",
      endDateDebut: "",
      startDateFin: "",
      endDateFin: "",
      collaborateurId: null,
      type: "Tous",
    });
    setPage(0);
  };

  // Apply filters when drawer is closed
  const handleApplyFilters = () => {
    setFilters({
      startDateDebut: selectedDate1,
      endDateDebut: selectedDate2,
      collaborateurId,
      type: filterType,
    });
    setPage(0);
    setOpenFilter(false);
  };

  // Handle page change
  const onPageChange = (event, newPage) => {
    setPage(newPage);
    handlePageChange(newPage);
  };

  // Handle rows per page change
  const onRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    handlePageSizeChange(newRowsPerPage);
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
                  type: row.type.props.label,
                }))}
                activeFilters={activeFilters}
                setOpenFilter={setOpenFilter}
                theme={theme}
                title={"Liste des Congés"}
                fileName={"liste_des_conges"}
                filtreExiste
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
                          value={filterPeriode}
                          onChange={(e) => setFilterPeriode(e.target.value)}
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
                        {filterType !== "Tous" && (
                          <Chip
                            label={`Type: ${filterType === "A" ? "Autorisation" : "Congé annuel"}`}
                            onDelete={() => {
                              setFilterType("Tous");
                              setFilters((prev) => ({ ...prev, type: "Tous" }));
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
                        {(selectedDate1 || selectedDate2) && (
                          <Chip
                            label={`Période: ${selectedDate1 || ""} - ${selectedDate2 || ""}`}
                            onDelete={() => {
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
            Type de Congé
          </MDTypography>
          <FormControl fullWidth>
            <InputLabel id="type-select-label">Type</InputLabel>
            <Select
              labelId="type-select-label"
              label="Type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              sx={{ height: 40 }}
            >
              {TYPE_OPTIONS.map((type) => (
                <MenuItem key={type} value={type}>
                  {type === "Tous"
                    ? "Tous les types"
                    : type === "A"
                    ? "Autorisation"
                    : "Congé annuel"}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </MDBox>
        <MDBox>
          <MDTypography variant="subtitle1" fontWeight="medium" mb={1} color="text">
            Période personnalisée
          </MDTypography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                type="date"
                label="De"
                InputLabelProps={{ shrink: true }}
                value={selectedDate1}
                onChange={(e) => {
                  setSelectedDate1(e.target.value);
                  setFilterPeriode("custom");
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
                value={selectedDate2}
                onChange={(e) => {
                  setSelectedDate2(e.target.value);
                  setFilterPeriode("custom");
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
        </MDBox>
      </FiltreAvancee>
    </DashboardLayout>
  );
}

export default CongesList;
