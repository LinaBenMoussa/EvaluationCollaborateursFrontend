import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "store/slices/authSlice";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Chip,
  Tooltip,
  Badge,
  Paper,
  Box,
  useTheme,
  useMediaQuery,
  alpha,
  Pagination,
  TablePagination,
} from "@mui/material";
import { useSaisiesTableData } from "./data/useSaisiesTableData";
import AutocompleteField from "layouts/shared/autocompleteField";
import { useGetCollaborateursByManagerQuery } from "store/api/userApi";
import { exportToExcel } from "functions/exportToExcel";
import exceller from "assets/images/icons/flags/exceller.png";

function SaisiesTemps() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const managerId = useSelector(selectCurrentUser);
  const [collaborateurId, setCollaborateurId] = useState(null);
  const [selectedCollaborateur, setSelectedCollaborateur] = useState(null);
  const [selectedDate1, setSelectedDate1] = useState(new Date().toISOString().split("T")[0]);
  const [selectedDate2, setSelectedDate2] = useState(new Date().toISOString().split("T")[0]);
  const [filterType, setFilterType] = useState("today");
  const [openFilter, setOpenFilter] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    collaborateurId: null,
  });

  // Fetch data with API filters and pagination
  const { columns, rows, isLoading, total, handlePageChange, handlePageSizeChange } =
    useSaisiesTableData(managerId, {
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

      // Reset to first page when filters change
      setPage(0);
    }
  }, [selectedDate1, selectedDate2, filterType]);

  // Compte les filtres actifs
  useEffect(() => {
    let count = 0;
    if (collaborateurId !== null) count++;
    if (selectedDate1 || selectedDate2) count++;
    setActiveFilters(count);
  }, [collaborateurId, selectedDate1, selectedDate2]);

  // Réinitialise tous les filtres
  const handleResetFilters = () => {
    setCollaborateurId(null);
    setSelectedCollaborateur(null);
    setSelectedDate1(new Date().toISOString().split("T")[0]);
    setSelectedDate2(new Date().toISOString().split("T")[0]);
    setFilterType("today");
    setFilters({
      startDate: "",
      endDate: "",
      collaborateurId: null,
    });
    setPage(0);
  };

  // Apply filters when drawer is closed
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
                  Saisies Table
                </MDTypography>
                <MDBox>
                  <Tooltip title="Exporter en Excel">
                    <IconButton
                      color="white"
                      onClick={() => exportToExcel(rows, "Liste_des_Saisies")}
                      sx={{ mr: 1 }}
                    >
                      <img
                        src={exceller}
                        alt="Exporter en Excel"
                        style={{ width: 25, height: 25 }}
                      />
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
                {/* Filtres rapides */}
                <MDBox display="flex" alignItems="center" mb={2}>
                  <FormControl sx={{ minWidth: 220, mr: 2 }}>
                    <InputLabel id="filter-type-label">Période</InputLabel>
                    <Select
                      labelId="filter-type-label"
                      label="Période"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      sx={{ height: 40 }}
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

                {/* Filtres actifs */}
                {activeFilters > 0 && (
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
                      />
                    )}
                  </MDBox>
                )}

                {/* Tableau de données */}
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
                      entriesPerPage={{ defaultValue: 25, entries: [5, 10, 15, 20, 25] }} // 25 par défaut
                      // Désactiver la pagination interne
                      showTotalEntries={false}
                      canSearch={true}
                      noEndBorder={true}
                    />

                    {/* Contrôles de pagination */}
                    <MDBox display="flex" justifyContent="flex-end" alignItems="center" mt={2}>
                      <TablePagination
                        component="div"
                        count={total}
                        page={page}
                        onPageChange={onPageChange}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={onRowsPerPageChange}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        labelRowsPerPage="Lignes par page:"
                        labelDisplayedRows={({ from, to, count }) =>
                          `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
                        }
                        sx={{
                          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                            {
                              margin: 0,
                            },
                        }}
                      />
                    </MDBox>
                  </>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Tiroir de filtres */}
      <Drawer
        anchor="right"
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: 450 },
            padding: 0,
            borderTopLeftRadius: isMobile ? 0 : "15px",
            borderBottomLeftRadius: isMobile ? 0 : "15px",
          },
        }}
      >
        <MDBox height="100%" display="flex" flexDirection="column">
          <MDBox
            p={3}
            sx={{
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              backgroundColor: theme.palette.background.default,
            }}
          >
            <MDBox display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="h5" fontWeight="bold">
                Filtres avancés
              </MDTypography>
              <IconButton
                onClick={() => setOpenFilter(false)}
                sx={{
                  backgroundColor: alpha(theme.palette.text.primary, 0.05),
                  "&:hover": { backgroundColor: alpha(theme.palette.text.primary, 0.1) },
                }}
              >
                <CloseIcon />
              </IconButton>
            </MDBox>
          </MDBox>

          <MDBox
            p={3}
            display="flex"
            flexDirection="column"
            gap={4}
            flex="1"
            overflow="auto"
            sx={{
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: alpha(theme.palette.text.primary, 0.2),
                borderRadius: "4px",
              },
            }}
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
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
                      setSelectedDate1(e.target.value);
                      setFilterType("custom");
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
                      setFilterType("custom");
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
          </MDBox>

          {/* Boutons d'action */}
          <MDBox
            p={3}
            display="flex"
            justifyContent="space-between"
            sx={{
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              backgroundColor: theme.palette.background.default,
            }}
          >
            <MDButton
              color="error"
              onClick={handleResetFilters}
              variant="outlined"
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: "medium",
                px: 3,
              }}
            >
              Réinitialiser
            </MDButton>
            <MDButton
              color="info"
              onClick={handleApplyFilters}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: "medium",
                px: 3,
              }}
            >
              Appliquer
            </MDButton>
          </MDBox>
        </MDBox>
      </Drawer>
    </DashboardLayout>
  );
}

export default SaisiesTemps;
