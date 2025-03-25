import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "store/slices/authSlice";
import { usePointageTableData } from "./data/usePointageTableData";
import { useTheme, useMediaQuery, alpha } from "@mui/material";
import { FiltreAvancee } from "./components/FiltreAvancee";
import MDBox from "components/MDBox";
import { HistoriqueHeader } from "./components/Header";
import { HistoriqueContent } from "./components/content";

function Historique() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const collaborateurId = useSelector(selectCurrentUser);
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
  });

  // Fetch data with API filters and pagination
  const { columns, rows, isLoading, total, handlePageChange, handlePageSizeChange } =
    usePointageTableData(collaborateurId, {
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
    if (selectedDate1 || selectedDate2) count++;
    setActiveFilters(count);
  }, [selectedDate1, selectedDate2]);

  // Réinitialise tous les filtres
  const handleResetFilters = () => {
    setSelectedDate1("");
    setSelectedDate2("");
    setFilterType("today");
    setFilters({
      startDate: "",
      endDate: "",
    });
    setPage(0);
  };

  const handleApplyFilters = () => {
    setFilters({
      startDate: selectedDate1,
      endDate: selectedDate2,
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
              <HistoriqueHeader
                rows={rows}
                activeFilters={activeFilters}
                setOpenFilter={setOpenFilter}
                theme={theme}
              />

              <HistoriqueContent
                theme={theme}
                isMobile={isMobile}
                filterType={filterType}
                setFilterType={setFilterType}
                activeFilters={activeFilters}
                handleResetFilters={handleResetFilters}
                selectedDate1={selectedDate1}
                selectedDate2={selectedDate2}
                setSelectedDate1={setSelectedDate1}
                setSelectedDate2={setSelectedDate2}
                setFilters={setFilters}
                isLoading={isLoading}
                columns={columns}
                rows={rows}
                total={total}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
              />
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Tiroir de filtres */}
      <FiltreAvancee
        handleApplyFilters={handleApplyFilters}
        handleResetFilters={handleResetFilters}
        isMobile={isMobile}
        openFilter={openFilter}
        setOpenFilter={setOpenFilter}
        selectedDate1={selectedDate1}
        setSelectedDate1={setSelectedDate1}
        selectedDate2={selectedDate2}
        setSelectedDate2={setSelectedDate2}
        theme={theme}
        alpha={alpha}
        setFilterType={setFilterType}
      />
    </DashboardLayout>
  );
}

export default Historique;
