import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { CircularProgress } from "@mui/material";
import MDInput from "components/MDInput";
import { useGetParametreQuery } from "store/api/parametreApi";
import MDButton from "components/MDButton";
import { useSetParametreMutation } from "store/api/parametreApi";
import { toast } from "react-toastify";

function Parametre() {
  const { data, isLoading } = useGetParametreQuery();
  const [updateParameters] = useSetParametreMutation();
  const [jwt_expiration, setExpiration] = useState("");

  useEffect(() => {
    if (data && data.jwt_expiration) {
      setExpiration(data.jwt_expiration);
    }
  }, [data]);
  const handleSubmit = () => {
    updateParameters({ jwt_expiration });
    toast.success("Les changement sont modifi avec succès !");
  };

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
                  Parametre
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
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
                    <MDBox mb={2}>
                      <MDInput
                        type="text"
                        label="expiration"
                        value={jwt_expiration}
                        onChange={(e) => setExpiration(e.target.value)}
                      />
                    </MDBox>
                    <MDButton onClick={handleSubmit} variant="gradient" color="info" type="submit">
                      Enregistrer
                    </MDButton>
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

export default Parametre;
