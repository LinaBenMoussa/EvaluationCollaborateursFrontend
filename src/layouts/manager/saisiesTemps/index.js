import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import {
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useSaisiesTableData } from "./data/useSaisiesTableData";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "store/slices/authSlice";
import AutocompleteField from "layouts/shared/autocompleteField";
import { useGetCollaborateursByManagerQuery } from "store/api/userApi";
import { isDateInRange } from "functions/dateTime";
import { convertDateFormat } from "functions/dateTime";
import exceller from "assets/images/icons/flags/exceller.png";
import { exportToExcel } from "functions/exportToExcel";

function SaisiesTemps() {
  const managerId = useSelector(selectCurrentUser);
  const [collaborateurId, setCollaborateurId] = useState(null);
  const [selectedCollaborateur, setSelectedCollaborateur] = useState(null);

  // État pour les dates et le filtre de période
  const [selectedDate1, setSelectedDate1] = useState(new Date().toISOString().split("T")[0]);
  const [selectedDate2, setSelectedDate2] = useState(new Date().toISOString().split("T")[0]);
  const [filterType, setFilterType] = useState("today"); // "today", "yesterday", "thisWeek", "thisMonth", "thisYear", "custom"

  // Met à jour automatiquement les dates en fonction du filtre sélectionné
  useEffect(() => {
    const today = new Date();
    if (filterType === "today") {
      const dateStr = today.toISOString().split("T")[0];
      setSelectedDate1(dateStr);
      setSelectedDate2(dateStr);
    } else if (filterType === "yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const dateStr = yesterday.toISOString().split("T")[0];
      setSelectedDate1(dateStr);
      setSelectedDate2(dateStr);
    } else if (filterType === "thisWeek") {
      // Considère la semaine de lundi à dimanche
      const day = today.getDay(); // 0 = dimanche, 1 = lundi, etc.
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const monday = new Date(today);
      monday.setDate(today.getDate() + diffToMonday);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      setSelectedDate1(monday.toISOString().split("T")[0]);
      setSelectedDate2(sunday.toISOString().split("T")[0]);
    } else if (filterType === "thisMonth") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      setSelectedDate1(firstDay.toISOString().split("T")[0]);
      setSelectedDate2(lastDay.toISOString().split("T")[0]);
    } else if (filterType === "thisYear") {
      const firstDay = new Date(today.getFullYear(), 0, 1);
      const lastDay = new Date(today.getFullYear(), 11, 31);
      setSelectedDate1(firstDay.toISOString().split("T")[0]);
      setSelectedDate2(lastDay.toISOString().split("T")[0]);
    }
    // Si "custom", on laisse l'utilisateur choisir les dates
  }, [filterType]);

  const { columns, rows, isLoading } = useSaisiesTableData(managerId);

  const filteredrows = rows
    .filter((row) => {
      if (!selectedDate1 && !selectedDate2) return true;
      return isDateInRange(convertDateFormat(row.date), selectedDate1, selectedDate2);
    })
    .filter((row) => {
      if (collaborateurId === null) return true;
      return row.collaborateur === `${selectedCollaborateur?.nom} ${selectedCollaborateur?.prenom}`;
    });

  // Correction : évite que selectedDate1 soit supérieur à selectedDate2
  if (selectedDate2 && selectedDate2 < selectedDate1) {
    setSelectedDate1(selectedDate2);
  }

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
                  Saisies Table
                </MDTypography>
                <MDBox>
                  <IconButton
                    color="white"
                    onClick={() => exportToExcel(filteredrows, "Liste_des_Taches")}
                  >
                    <img src={exceller} alt="Exporter en Excel" style={{ width: 30, height: 30 }} />
                  </IconButton>
                </MDBox>
              </MDBox>
              <MDBox pt={3}>
                <MDBox justifyContent="space-between">
                  <MDBox display="flex" justifyContent="space-between" alignItems="center">
                    <MDBox display="flex" alignItems="center">
                      <MDBox m={2} sx={{ width: 280 }}>
                        <AutocompleteField
                          useFetchHook={() => useGetCollaborateursByManagerQuery(managerId)}
                          fullWidth
                          setSelectedItem={setSelectedCollaborateur}
                          setIdItem={setCollaborateurId}
                          selectedItem={selectedCollaborateur}
                          label="Choisir un collaborateur"
                        />
                      </MDBox>
                      <FormControl fullWidth sx={{ mx: 0.5, width: 220 }}>
                        <InputLabel id="filter-type-label">Période</InputLabel>
                        <Select
                          labelId="filter-type-label"
                          label="Période"
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                          sx={{ height: "45px" }}
                        >
                          <MenuItem value="today">{"Aujourd'hui"}</MenuItem>
                          <MenuItem value="yesterday">Hier</MenuItem>
                          <MenuItem value="thisWeek">Cette semaine</MenuItem>
                          <MenuItem value="thisMonth">Ce mois</MenuItem>
                          <MenuItem value="thisYear">Cette année</MenuItem>
                          <MenuItem value="custom">Personnalisée</MenuItem>
                        </Select>
                      </FormControl>
                      {/* Afficher les champs de date uniquement si la période est personnalisée */}
                      {filterType === "custom" && (
                        <MDBox ml={2}>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <TextField
                                type="date"
                                label="De"
                                InputLabelProps={{ shrink: true }}
                                value={selectedDate1}
                                onChange={(e) => setSelectedDate1(e.target.value)}
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                type="date"
                                label="À"
                                InputLabelProps={{ shrink: true }}
                                value={selectedDate2}
                                onChange={(e) => setSelectedDate2(e.target.value)}
                                fullWidth
                              />
                            </Grid>
                          </Grid>
                        </MDBox>
                      )}
                    </MDBox>
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
                      table={{ columns, rows: filteredrows }}
                      isSorted={true}
                      entriesPerPage={true}
                      showTotalEntries={false}
                      canSearch={true}
                      noEndBorder={false}
                    />
                  )}
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default SaisiesTemps;
