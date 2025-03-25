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
import { CircularProgress, TextField, TablePagination } from "@mui/material";
import { usePointageTableData } from "./data/usePointageTableData";

function ListPointage() {
  const collaborateurId = useSelector(selectCurrentUser);
  const [filterStatus, setFilterStatus] = useState("Tous");
  const [selectedDate1, setSelectedDate1] = useState("");
  const [selectedDate2, setSelectedDate2] = useState("");

  // Pass filter options to the hook
  const { columns, rows, isLoading, pagination } = usePointageTableData(collaborateurId, {
    status: filterStatus,
    startDate: selectedDate1,
    endDate: selectedDate2,
  });

  // Ensure end date is not before start date
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
              >
                <MDTypography variant="h6" color="white">
                  Liste des pointages
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                  <MDBox display="flex" alignItems="center">
                    <MDBox m={2}>
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
                  <>
                    <DataTable
                      table={{ columns, rows }}
                      isSorted={true}
                      entriesPerPage={true}
                      showTotalEntries={false}
                      canSearch={true}
                      noEndBorder={false}
                    />
                    <MDBox p={2} display="flex" justifyContent="flex-end">
                      <TablePagination
                        component="div"
                        count={pagination.total}
                        page={pagination.page}
                        onPageChange={(event, newPage) => pagination.handleChangePage(newPage)}
                        rowsPerPage={pagination.rowsPerPage}
                        onRowsPerPageChange={(event) =>
                          pagination.handleChangeRowsPerPage(parseInt(event.target.value, 10))
                        }
                        rowsPerPageOptions={[10, 25, 50, 100]}
                        labelRowsPerPage="Lignes par page"
                        labelDisplayedRows={({ from, to, count }) =>
                          `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
                        }
                      />
                    </MDBox>
                  </>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default ListPointage;
