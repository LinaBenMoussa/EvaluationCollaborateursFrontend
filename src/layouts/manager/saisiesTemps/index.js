import { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { CircularProgress, IconButton, TextField } from "@mui/material";
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
  const [selectedDate1, setSelectedDate1] = useState(new Date().toISOString().split("T")[0]);
  const [selectedDate2, setSelectedDate2] = useState(new Date().toISOString().split("T")[0]);
  const { columns, rows, isLoading } = useSaisiesTableData(managerId);
  console.log(columns, rows, isLoading);

  const filteredrows = rows
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
                    <CircularProgress />
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
