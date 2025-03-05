import { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";
import { useUsersTableData } from "./data/useUsersTableData";
import SelectFieldRole from "../add-user/SelectFieldRole";

function Tables() {
  const navigate = useNavigate();
  const [role, setRole] = useState("Admin");
  const { columns, rows, isLoading, open, handleCloseDialog, handleConfirmDelete } =
    useUsersTableData(role);

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
                  Liste des utilisateurs
                </MDTypography>
              </MDBox>
              <MDBox pt={0}>
                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                  <MDBox m={2} sx={{ width: 280 }}>
                    <SelectFieldRole role={role} setRole={setRole} />
                  </MDBox>
                  <MDBox m={5}>
                    <MDButton variant="contained" color="info" onClick={() => navigate("/adduser")}>
                      Ajouter un utilisateur
                    </MDButton>
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
                    table={{ columns, rows }}
                    isSorted
                    entriesPerPage
                    showTotalEntries={false}
                    canSearch
                    noEndBorder={false}
                  />
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Boîte de dialogue de confirmation */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <MDTypography>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</MDTypography>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseDialog} color="secondary">
            Annuler
          </MDButton>
          <MDButton onClick={handleConfirmDelete} color="error">
            Supprimer
          </MDButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default Tables;
