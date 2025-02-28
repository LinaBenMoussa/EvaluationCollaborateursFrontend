import { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "store/slices/authSlice";
import { CircularProgress, IconButton, TextField } from "@mui/material";
import { usePointageTableData } from "./data/usePointageTableData";
import AutocompleteField from "layouts/shared/autocompleteField";
import { useGetCollaborateursByManagerQuery } from "store/api/userApi";
import { isDateInRange } from "functions/dateTime";
import { convertDateFormat } from "functions/dateTime";
import { exportToExcel } from "functions/exportToExcel";
import exceller from "assets/images/icons/flags/exceller.png";

function Historique() {
  const managerId = useSelector(selectCurrentUser);
  const [collaborateurId, setCollaborateurId] = useState(null);
  const [selectedCollaborateur, setSelectedCollaborateur] = useState(null);
  const { columns, rows, isLoading } = usePointageTableData(managerId);

  const [filterStatus, setFilterStatus] = useState("Tous");
  const [selectedDate1, setSelectedDate1] = useState("");
  const [selectedDate2, setSelectedDate2] = useState("");

  console.log(columns, rows, isLoading);
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
