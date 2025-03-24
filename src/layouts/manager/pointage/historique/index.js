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
import { usePointageTableData } from "./data/usePointageTableData";
import AutocompleteField from "layouts/shared/autocompleteField";
import { useGetCollaborateursByManagerQuery } from "store/api/userApi";
import { exportToExcel } from "functions/exportToExcel";
import exceller from "assets/images/icons/flags/exceller.png";

function Historique() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const managerId = useSelector(selectCurrentUser);
  const [collaborateurId, setCollaborateurId] = useState(null);
  const [selectedCollaborateur, setSelectedCollaborateur] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Tous");
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

      // Reset to first page when filters change
      setPage(0);
    }
  }, [selectedDate1, selectedDate2, filterType]);

  // Compte les filtres actifs
  useEffect(() => {
    let count = 0;
    if (filterStatus !== "Tous") count++;
    if (collaborateurId !== null) count++;
    if (selectedDate1 || selectedDate2) count++;
    setActiveFilters(count);
  }, [filterStatus, collaborateurId, selectedDate1, selectedDate2]);

  // Réinitialise tous les filtres
  const handleResetFilters = () => {
    setFilterStatus("Tous");
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

  // Filter rows by status (this is still done client-side since the API doesn't filter by status)
  const filteredPointages = rows.filter((row) => {
    if (filterStatus === "Tous") return true;
    return filterStatus === "En poste" ? row.status === "En poste" : row.status === "A quité";
  });

  // Obtention des statistiques pour le résumé
  const getStats = () => {
    const totalEntries = filteredPointages.length;
    const activeEntries = filteredPointages.filter((entry) => entry.status === "En poste").length;
    const inactiveEntries = filteredPointages.filter((entry) => entry.status === "A quité").length;

    return { totalEntries, activeEntries, inactiveEntries };
  };

  const stats = getStats();

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
              <MDBox
                mx={0}
                mt={0}
                py={3}
                px={3}
                variant="gradient"
                bgColor="info"
                borderRadius="0"
                coloredShadow="none"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDBox>
                  <MDTypography variant="h5" color="white" fontWeight="bold">
                    Historique des Pointages
                  </MDTypography>
                  <MDTypography variant="caption" color="white" fontWeight="light">
                    Gérez et consultez tous vos enregistrements
                  </MDTypography>
                </MDBox>
                <MDBox display="flex" alignItems="center">
                  <Tooltip title="Exporter en Excel">
                    <IconButton
                      color="white"
                      onClick={() => exportToExcel(filteredPointages, "Liste_des_Pointages")}
                      sx={{
                        mr: 1,
                        backgroundColor: alpha("#fff", 0.1),
                        "&:hover": { backgroundColor: alpha("#fff", 0.2) },
                      }}
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
                      sx={{
                        "& .MuiBadge-badge": { fontSize: 10 },
                      }}
                    >
                      <IconButton
                        color="white"
                        onClick={() => setOpenFilter(true)}
                        sx={{
                          backgroundColor: alpha("#fff", 0.1),
                          "&:hover": { backgroundColor: alpha("#fff", 0.2) },
                        }}
                      >
                        <FilterListIcon />
                      </IconButton>
                    </Badge>
                  </Tooltip>
                </MDBox>
              </MDBox>

              <MDBox p={3}>
                {/* Filtres rapides dans un paper surélevé */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: "10px",
                    backgroundColor: theme.palette.background.default,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  <MDBox
                    display="flex"
                    flexDirection={isMobile ? "column" : "row"}
                    alignItems={isMobile ? "stretch" : "center"}
                    justifyContent="space-between"
                  >
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

                    {activeFilters > 0 && (
                      <MDButton
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={handleResetFilters}
                        sx={{
                          borderRadius: "8px",
                          textTransform: "none",
                          py: 1,
                        }}
                        startIcon={<CloseIcon />}
                      >
                        Réinitialiser les filtres
                      </MDButton>
                    )}
                  </MDBox>
                </Paper>

                {/* Filtres actifs */}
                {activeFilters > 0 && (
                  <MDBox display="flex" flexWrap="wrap" gap={1} mb={3}>
                    {filterStatus !== "Tous" && (
                      <Chip
                        label={`Statut: ${filterStatus}`}
                        onDelete={() => setFilterStatus("Tous")}
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
                )}

                {/* Tableau de données avec chargement */}
                {isLoading ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ minHeight: "300px" }}
                  >
                    <CircularProgress color="info" />
                  </Box>
                ) : (
                  <>
                    <DataTable
                      table={{ columns, rows: filteredPointages }}
                      isSorted={true}
                      entriesPerPage={true} // Désactiver la pagination interne
                      showTotalEntries={true}
                      canSearch={true}
                      noEndBorder={true}
                      sx={{
                        "& .MuiTableRow-root:hover": {
                          backgroundColor: alpha(theme.palette.info.main, 0.05),
                        },
                        "& .MuiTableCell-head": {
                          backgroundColor: theme.palette.background.default,
                          color: theme.palette.text.primary,
                          fontWeight: "bold",
                        },
                      }}
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

                    {/* Info de pagination */}
                    <MDBox
                      mt={2}
                      display="flex"
                      flexDirection={isMobile ? "column" : "row"}
                      justifyContent="space-between"
                      alignItems={isMobile ? "flex-start" : "center"}
                      p={2}
                      sx={{
                        backgroundColor: theme.palette.background.default,
                        borderRadius: "10px",
                      }}
                    >
                      <MDTypography variant="body2" color="text">
                        Affichage de <strong>{filteredPointages.length}</strong> pointages
                        {total > 0 && ` sur un total de <strong>${total}</strong>`}
                      </MDTypography>
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
            width: { xs: "100%", sm: 400 },
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

export default Historique;
