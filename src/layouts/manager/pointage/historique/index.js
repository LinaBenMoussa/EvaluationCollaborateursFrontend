import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "store/slices/authSlice";
import {
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { usePointageTableData } from "./data/usePointageTableData";
import AutocompleteField from "layouts/shared/autocompleteField";
import { useGetCollaborateursByManagerQuery } from "store/api/userApi";
import { isDateInRange, convertDateFormat } from "functions/dateTime";
import { exportToExcel } from "functions/exportToExcel";
import exceller from "assets/images/icons/flags/exceller.png";

function Historique() {
  const managerId = useSelector(selectCurrentUser);
  const [collaborateurId, setCollaborateurId] = useState(null);
  const [selectedCollaborateur, setSelectedCollaborateur] = useState(null);
  const { columns, rows, isLoading } = usePointageTableData(managerId);

  const [filterStatus, setFilterStatus] = useState("Tous");
  // Pour la période, on utilise deux états pour la date de début et la date de fin
  const [selectedDate1, setSelectedDate1] = useState("");
  const [selectedDate2, setSelectedDate2] = useState("");
  // Etat pour le type de filtre de période : "today", "yesterday", "thisWeek", "thisMonth", "thisYear" ou "custom"
  const [filterType, setFilterType] = useState("today");

  // Met à jour automatiquement selectedDate1 et selectedDate2 en fonction du filtre choisi
  useEffect(() => {
    const now = new Date();
    if (filterType === "today") {
      const today = now.toISOString().split("T")[0];
      setSelectedDate1(today);
      setSelectedDate2(today);
    } else if (filterType === "yesterday") {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yest = yesterday.toISOString().split("T")[0];
      setSelectedDate1(yest);
      setSelectedDate2(yest);
    } else if (filterType === "thisWeek") {
      // Supposons que la semaine commence le lundi
      const day = now.getDay(); // 0 = dimanche, 1 = lundi, etc.
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const monday = new Date(now);
      monday.setDate(now.getDate() + diffToMonday);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      setSelectedDate1(monday.toISOString().split("T")[0]);
      setSelectedDate2(sunday.toISOString().split("T")[0]);
    } else if (filterType === "thisMonth") {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      setSelectedDate1(firstDay.toISOString().split("T")[0]);
      setSelectedDate2(lastDay.toISOString().split("T")[0]);
    } else if (filterType === "thisYear") {
      const firstDay = new Date(now.getFullYear(), 0, 1);
      const lastDay = new Date(now.getFullYear(), 11, 31);
      setSelectedDate1(firstDay.toISOString().split("T")[0]);
      setSelectedDate2(lastDay.toISOString().split("T")[0]);
    }
    // Pour "custom", on laisse l'utilisateur saisir manuellement les dates
  }, [filterType]);

  // Refetch des données lorsque la période (dates) change
  useEffect(() => {
    // Ici, vous pouvez ajouter le refetch si nécessaire
    // refetchPointages(), refetchCollaborateurs(), etc.
  }, [selectedDate1, selectedDate2]);

  const filteredPointages = rows
    .filter((row) => {
      if (filterStatus === "Tous") return true;
      return filterStatus === "En poste" ? row.status === "En poste" : row.status === "A quité";
    })
    .filter((row) => {
      if (!selectedDate1 && !selectedDate2) return true;
      return isDateInRange(convertDateFormat(row.date), selectedDate1, selectedDate2);
    })
    .filter((row) => {
      if (collaborateurId === null) return true;
      return row.collaborateur === `${selectedCollaborateur?.nom} ${selectedCollaborateur?.prenom}`;
    });

  // Si la date de fin est inférieure à la date de début, on ajuste
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
                  Historique
                </MDTypography>
                <MDBox>
                  <IconButton
                    color="white"
                    onClick={() => exportToExcel(filteredPointages, "Liste_des_Collaborateurs")}
                  >
                    <img src={exceller} alt="Exporter en Excel" style={{ width: 30, height: 30 }} />
                  </IconButton>
                </MDBox>
              </MDBox>
              <MDBox pt={3}>
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
                    <MDBox mr={2}>
                      <TextField
                        select
                        label="Status"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        SelectProps={{ native: true }}
                        sx={{ width: 200 }}
                      >
                        <option value="Tous">Tous</option>
                        <option value="En poste">En poste</option>
                        <option value="A quité">A quité</option>
                      </TextField>
                    </MDBox>
                    <MDBox mr={2}>
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
                    {/* Affichage des champs de date uniquement si le filtre est "custom" */}
                    {filterType === "custom" && (
                      <MDBox>
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
                    table={{ columns, rows: filteredPointages }}
                    isSorted={true}
                    entriesPerPage={true}
                    showTotalEntries={false}
                    canSearch={true}
                    noEndBorder={false}
                  />
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Historique;
