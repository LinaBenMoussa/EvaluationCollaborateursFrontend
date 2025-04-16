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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Chip,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import { useSaisiesTableData } from "./data/useSaisiesTableData";
import AutocompleteField from "layouts/shared/autocompleteField";
import { useGetCollaborateursByManagerQuery } from "store/api/userApi";
import { Header } from "layouts/shared/Header";
import FiltreRapide from "layouts/shared/FiltreRapide";
import Table from "layouts/shared/Table";
import { FiltreAvancee } from "layouts/shared/FiltreAvancee";
import { convertDateFormat } from "functions/dateTime";
import { formatDate } from "functions/dateTime";
import { getStartDate } from "functions/startDate";
import SaisieExportToExcelDialog from "./exportToExcelDialog";
import Footer from "examples/Footer";

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
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    collaborateurId: null,
  });

  // Fetch data with API filters and pagination
  const { columns, rows, isLoading, total } = useSaisiesTableData(managerId, {
    ...filters,
    page: page,
    pageSize: rowsPerPage,
  });

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

    setFilters((prev) => ({
      ...prev,
      startDate: start,
      endDate: end,
    }));

    setPage(0);
  }, [filterType]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      collaborateurId,
    }));

    setPage(0);
  }, [collaborateurId]);

  useEffect(() => {
    if (filterType === "custom") {
      setFilters((prev) => ({
        ...prev,
        startDate: selectedDate1,
        endDate: selectedDate2,
      }));

      setPage(0);
    }
  }, [selectedDate1, selectedDate2, filterType]);

  useEffect(() => {
    let count = 0;
    if (collaborateurId !== null) count++;
    if (selectedDate1 || selectedDate2) count++;
    setActiveFilters(count);
  }, [collaborateurId, selectedDate1, selectedDate2]);

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
  };

  // Handle rows per page change
  const onRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
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
                title={"Table des saisies de temps"}
                fileName={"table_des_saisies"}
                filtreExiste
                dialog={SaisieExportToExcelDialog}
                columns={columns}
              />

              <MDBox pt={3} pb={2} px={3}>
                <FiltreRapide
                  activeFilters={activeFilters}
                  handleResetFilters={handleResetFilters}
                  theme={theme}
                  setFilters={setFilters}
                  fields={
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
                  }
                  chip={
                    activeFilters > 0 && (
                      <MDBox display="flex" flexWrap="wrap" gap={1} mb={3}>
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
                              setFilters((prev) => ({ ...prev, startDate: "", endDate: "" }));
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
      </FiltreAvancee>
      <Footer />
    </DashboardLayout>
  );
}

export default SaisiesTemps;
