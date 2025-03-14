import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import FilterListIcon from "@mui/icons-material/FilterList";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "store/slices/authSlice";
import { useIssuesTableData } from "./data/useIssuesTableData";
import {
  TextField,
  MenuItem,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { useGetCollaborateursByManagerQuery } from "store/api/userApi";
import AutocompleteField from "layouts/shared/autocompleteField";
import { convertDateFormat } from "functions/dateTime";
import { isDateInRange } from "functions/dateTime";
import exceller from "assets/images/icons/flags/exceller.png";
import { exportToExcel } from "functions/exportToExcel";

function IssuesList() {
  const managerId = useSelector(selectCurrentUser);
  const [collaborateurId, setCollaborateurId] = useState(null);
  const [selectedCollaborateur, setSelectedCollaborateur] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Tous");
  const [filterType, setFilterType] = useState("today");
  const [selectedDateDebut1, setSelectedDateDebut1] = useState("");
  const [selectedDateDebut2, setSelectedDateDebut2] = useState("");
  const [selectedDateFin1, setSelectedDateFin1] = useState("");
  const [selectedDateFin2, setSelectedDateFin2] = useState("");
  const [selectedDateEcheance1, setSelectedDateEcheance1] = useState("");
  const [selectedDateEcheance2, setSelectedDateEcheance2] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const { columns, rows, isLoading } = useIssuesTableData(managerId);

  // Function to calculate date ranges based on selected period
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
    if (filterType !== "custom") {
      calculateDateRange(filterType);
    } else {
      setOpenFilter(true);
    }
  }, [filterType]);

  // Validation for date ranges
  if (selectedDateDebut2 && selectedDateDebut2 < selectedDateDebut1) {
    setSelectedDateDebut1(selectedDateDebut2);
  }
  if (selectedDateFin2 && selectedDateFin2 < selectedDateFin1) {
    setSelectedDateFin1(selectedDateFin2);
  }
  if (selectedDateEcheance2 && selectedDateEcheance2 < selectedDateEcheance1) {
    setSelectedDateEcheance1(selectedDateEcheance2);
  }

  const filteredRows = rows.filter((row) => {
    const statusMatch =
      filterStatus === "Tous" ? true : row.status.props.children[1] === filterStatus;
    const collaborateurMatch =
      collaborateurId !== null
        ? row.collaborateur === `${selectedCollaborateur?.nom} ${selectedCollaborateur?.prenom}`
        : true;
    return (
      statusMatch &&
      collaborateurMatch &&
      isDateInRange(convertDateFormat(row.date_debut), selectedDateDebut1, selectedDateDebut2) &&
      isDateInRange(convertDateFormat(row.date_fin), selectedDateFin1, selectedDateFin2) &&
      isDateInRange(
        convertDateFormat(row.date_echeance),
        selectedDateEcheance1,
        selectedDateEcheance2
      )
    );
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
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
                  <IconButton
                    color="white"
                    onClick={() => exportToExcel(filteredRows, "Liste_des_Taches")}
                  >
                    <img src={exceller} alt="Exporter en Excel" style={{ width: 30, height: 30 }} />
                  </IconButton>
                  <IconButton color="white" onClick={() => setOpenFilter(true)}>
                    <FilterListIcon sx={{ color: "white" }} />
                  </IconButton>
                </MDBox>
              </MDBox>

              <MDBox pt={1}>
                <MDBox ml={2}>
                  <FormControl fullWidth>
                    <InputLabel id="filter-type-label">Période</InputLabel>
                    <Select
                      labelId="filter-type-label"
                      label="Période"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      sx={{ height: "45px", width: "220px", mx: 0.5 }}
                    >
                      <MenuItem value="today">{"Aujourd'hui"}</MenuItem>
                      <MenuItem value="yesterday">Hier</MenuItem>
                      <MenuItem value="thisWeek">Cette semaine</MenuItem>
                      <MenuItem value="thisMonth">Ce mois</MenuItem>
                      <MenuItem value="thisYear">Cette année</MenuItem>
                      <MenuItem value="custom">Personnalisée</MenuItem>
                    </Select>
                  </FormControl>
                </MDBox>
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
                    entriesPerPage={true}
                    showTotalEntries={false}
                    canSearch={true}
                    noEndBorder={true}
                  />
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 400,
            padding: 2,
            height: "auto",
          },
        }}
      >
        <MDBox p={2}>
          <MDTypography variant="h6" mb={2}>
            Filtres
          </MDTypography>

          <MDBox display="flex" flexDirection="column" gap={2}>
            <AutocompleteField
              useFetchHook={() => useGetCollaborateursByManagerQuery(managerId)}
              fullWidth
              setSelectedItem={setSelectedCollaborateur}
              setIdItem={setCollaborateurId}
              selectedItem={selectedCollaborateur}
              label="Choisir un collaborateur"
            />
            <TextField
              select
              label="Statut"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              SelectProps={{
                sx: { height: 43, display: "flex", alignItems: "center" },
              }}
            >
              <MenuItem value="Tous">Tous</MenuItem>
              <MenuItem value="Nouveau">Nouveau</MenuItem>
              <MenuItem value="Résolu">Résolu</MenuItem>
              <MenuItem value="Fermé">Fermé</MenuItem>
              <MenuItem value="Réouvert">Réouvert</MenuItem>
              <MenuItem value="Assigné">Assigné</MenuItem>
              <MenuItem value="Rejeté">Rejeté</MenuItem>
              <MenuItem value="Reporté">Reporté</MenuItem>
              <MenuItem value="Dupliqué">Dupliqué</MenuItem>
              <MenuItem value="Ambigu">Ambigu</MenuItem>
              <MenuItem value="En cours">En cours</MenuItem>
              <MenuItem value="Ouvert">Ouvert</MenuItem>
              <MenuItem value="Négociation de l'offre">{"Négociation de l'offre"}</MenuItem>
              <MenuItem value="Validation de l'offre">{"Validation de l'offre"}</MenuItem>
              <MenuItem value="Clôture provisoire">Clôture provisoire</MenuItem>
            </TextField>
            <MDBox>
              <MDTypography variant="caption" sx={{ fontSize: "1rem" }} fontWeight="light" mb={1}>
                Date de début
              </MDTypography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    type="date"
                    label="De"
                    InputLabelProps={{ shrink: true }}
                    value={selectedDateDebut1}
                    onChange={(e) => {
                      setSelectedDateDebut1(e.target.value);
                      setFilterType("custom");
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="date"
                    label="À"
                    InputLabelProps={{ shrink: true }}
                    value={selectedDateDebut2}
                    onChange={(e) => {
                      setSelectedDateDebut2(e.target.value);
                      setFilterType("custom");
                    }}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </MDBox>
            <MDBox>
              <MDTypography variant="caption" sx={{ fontSize: "1rem" }} fontWeight="light" mb={1}>
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
                  />
                </Grid>
              </Grid>
            </MDBox>
            <MDBox>
              <MDTypography variant="caption" sx={{ fontSize: "1rem" }} fontWeight="light" mb={1}>
                Date Echeance
              </MDTypography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    type="date"
                    label="De"
                    InputLabelProps={{ shrink: true }}
                    value={selectedDateEcheance1}
                    onChange={(e) => setSelectedDateEcheance1(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="date"
                    label="À"
                    InputLabelProps={{ shrink: true }}
                    value={selectedDateEcheance2}
                    onChange={(e) => setSelectedDateEcheance2(e.target.value)}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </MDBox>
          </MDBox>
        </MDBox>
      </Drawer>
    </DashboardLayout>
  );
}

export default IssuesList;
