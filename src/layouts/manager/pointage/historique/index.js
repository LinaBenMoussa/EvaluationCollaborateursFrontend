import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "store/slices/authSlice";
import { usePointageTableData } from "./data/usePointageTableData";
import {
  useTheme,
  useMediaQuery,
  alpha,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
} from "@mui/material";
import MDBox from "components/MDBox";
import { Header } from "layouts/shared/Header";
import MDTypography from "components/MDTypography";
import AutocompleteField from "layouts/shared/autocompleteField";
import { FiltreAvancee } from "layouts/shared/FiltreAvancee";
import { useGetCollaborateursByManagerQuery } from "store/api/userApi";
import FiltreRapide from "layouts/shared/FiltreRapide";
import Table from "layouts/shared/Table";

function Historique() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const managerId = useSelector(selectCurrentUser);
  const [collaborateurId, setCollaborateurId] = useState(null);
  const [selectedCollaborateur, setSelectedCollaborateur] = useState(null);
  const [selectedDate1, setSelectedDate1] = useState("");
  const [selectedDate2, setSelectedDate2] = useState("");
  const [filterType, setFilterType] = useState("today");
  const [openFilter, setOpenFilter] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    collaborateurId: null,
  });

  // Fetch data with API filters and pagination
  const { columns, rows, isLoading, total, handlePageChange, handlePageSizeChange } =
    usePointageTableData(managerId, {
      ...filters,
      page: page,
      pageSize: rowsPerPage,
    });

  // Met à jour automatiquement les dates en fonction du filtre sélectionné
  useEffect(() => {
    const now = new Date();
    let start = "";
    let end = "";

    if (filterType === "today") {
      const today = now.toISOString().split("T")[0];
      start = today;
      end = today;
    } else if (filterType === "yesterday") {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yest = yesterday.toISOString().split("T")[0];
      start = yest;
      end = yest;
    } else if (filterType === "thisWeek") {
      const day = now.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const monday = new Date(now);
      monday.setDate(now.getDate() + diffToMonday);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      start = monday.toISOString().split("T")[0];
      end = sunday.toISOString().split("T")[0];
    } else if (filterType === "thisMonth") {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      start = firstDay.toISOString().split("T")[0];
      end = lastDay.toISOString().split("T")[0];
    } else if (filterType === "thisYear") {
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
      startDate: start,
      endDate: end,
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

  // Update date filters when custom dates are selected
  useEffect(() => {
    if (filterType === "custom") {
      setFilters((prev) => ({
        ...prev,
        startDate: selectedDate1,
        endDate: selectedDate2,
      }));
      setOpenFilter(true);
      // Reset to first page when filters change
      setPage(0);
    }
  }, [selectedDate1, selectedDate2, filterType]);

  // Compte les filtres actifs
  useEffect(() => {
    let count = 0;
    if (collaborateurId !== null) count++;
    if (selectedDate1 || selectedDate2) count++;
    console.log("activeFilters", activeFilters);
    setActiveFilters(count);
  }, [collaborateurId, selectedDate1, selectedDate2]);

  // Réinitialise tous les filtres
  const handleResetFilters = () => {
    setCollaborateurId(null);
    setSelectedCollaborateur(null);
    setSelectedDate1("");
    setSelectedDate2("");
    setFilterType("today");
    setFilters({
      startDate: "",
      endDate: "",
      collaborateurId: null,
    });
    setPage(0);
  };

  const handleApplyFilters = () => {
    setFilters({
      startDate: selectedDate1,
      endDate: selectedDate2,
      collaborateurId: collaborateurId,
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
    const newRowsPerPage = parseInt(event.target.value, 25);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    handlePageSizeChange(newRowsPerPage);
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
                rows={rows}
                activeFilters={activeFilters}
                setOpenFilter={setOpenFilter}
                theme={theme}
                title={"Historique des pointages"}
                filtreExiste
              />
              <MDBox p={3}>
                <FiltreRapide
                  activeFilters={activeFilters}
                  handleResetFilters={handleResetFilters}
                  theme={theme}
                  setFilters={setFilters}
                  children1={
                    <FormControl sx={{ minWidth: 220, mb: isMobile ? 2 : 0 }}>
                      <InputLabel id="filter-type-label">Période</InputLabel>
                      <Select
                        labelId="filter-type-label"
                        label="Période"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        sx={{
                          height: 45,
                          "&.MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
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
                  }
                  children2={
                    activeFilters > 0 && (
                      <MDBox display="flex" flexWrap="wrap" gap={1} mb={3}>
                        {collaborateurId !== null && (
                          <Chip
                            label={`Collaborateur: ${selectedCollaborateur?.nom} ${selectedCollaborateur?.prenom}`}
                            onDelete={() => {
                              setCollaborateurId(null);
                              setSelectedCollaborateur(null);
                              setFilters((prev) => ({ ...prev, collaborateurId: null }));
                            }}
                            size="small"
                            color="primary"
                            sx={{
                              borderRadius: "6px",
                              fontWeight: "medium",
                              "& .MuiChip-label": { px: 2 },
                              "& .MuiChip-deleteIcon": { color: "white" },
                            }}
                          />
                        )}
                        {(selectedDate1 || selectedDate2) && (
                          <Chip
                            label={`Période: ${selectedDate1 || ""} - ${selectedDate2 || ""}`}
                            onDelete={() => {
                              setSelectedDate1("");
                              setSelectedDate2("");
                              setFilters((prev) => ({ ...prev, startDate: "", endDate: "" }));
                            }}
                            size="small"
                            color="primary"
                            sx={{
                              borderRadius: "6px",
                              fontWeight: "medium",
                              "& .MuiChip-label": { px: 2 },
                              "& .MuiChip-deleteIcon": { color: "white" },
                            }}
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

      {/* Tiroir de filtres */}
      <FiltreAvancee
        openFilter={openFilter}
        setOpenFilter={setOpenFilter}
        isMobile={isMobile}
        theme={theme}
        handleApplyFilters={handleApplyFilters}
        handleResetFilters={handleResetFilters}
        alpha={alpha}
      >
        {/* Filtre collaborateur */}
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
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
          />
        </MDBox>

        {/* Filtre de période */}
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
                  setFilterType("custom");
                  setSelectedDate1(e.target.value);
                }}
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="date"
                label="À"
                InputLabelProps={{ shrink: true }}
                value={selectedDate2}
                onChange={(e) => {
                  setFilterType("custom");
                  setSelectedDate2(e.target.value);
                }}
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
              />
            </Grid>
          </Grid>
        </MDBox>
      </FiltreAvancee>
    </DashboardLayout>
  );
}

export default Historique;
