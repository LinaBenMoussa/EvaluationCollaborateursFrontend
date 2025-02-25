import { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { CircularProgress } from "@mui/material";
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";
import { useUsersTableData } from "./data/useUsersTableData";
import SelectFieldRole from "../add-user/SelectFieldRole";

function Tables() {
  const navigate = useNavigate();

  const [role, setRole] = useState("Admin");
  const { columns, rows, isLoading } = useUsersTableData(role);
  console.log(columns, rows, isLoading);

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
                  Authors Table
                </MDTypography>
              </MDBox>
              <MDBox pt={0}>
                <MDBox justifyContent="space-between">
                  <MDBox display="flex" justifyContent="space-between" alignItems="center">
                    <MDBox display="flex" alignItems="center">
                      <MDBox m={2} sx={{ width: 280 }}>
                        <SelectFieldRole role={role} setRole={setRole} />
                      </MDBox>
                    </MDBox>
                    <MDBox m={5}>
                      <MDButton
                        variant="contained"
                        color="info"
                        onClick={() => navigate("/adduser")}
                      >
                        Ajouter utilisateur
                      </MDButton>
                    </MDBox>
                  </MDBox>
                </MDBox>
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  <DataTable
                    table={{ columns, rows }}
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

export default Tables;
