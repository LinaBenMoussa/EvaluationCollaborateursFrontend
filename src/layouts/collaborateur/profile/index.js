import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import TopCollaborators from "./components/topCollaborateur";
import Header from "./components/Header";
import Badge from "./components/badge";

function Overview() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header>
        <MDBox m={5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TopCollaborators />
            </Grid>
            <Grid item xs={12} md={6}>
              <Badge />
            </Grid>
          </Grid>
        </MDBox>
      </Header>
    </DashboardLayout>
  );
}

export default Overview;
