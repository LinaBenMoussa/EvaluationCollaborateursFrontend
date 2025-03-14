import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { Box, CircularProgress } from "@mui/material";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SelectFieldRole from "./SelectFieldRole";
import AutocompleteField from "layouts/shared/autocompleteField";
import { useEditUserMutation } from "store/api/userApi";
import { useGetUserByIdQuery } from "store/api/userApi";
import { useGetByRoleQuery } from "store/api/userApi";

function EditUser() {
  const { id } = useParams();
  console.log("id", id);
  const { data: user, isLoading } = useGetUserByIdQuery(id);
  const [editUser, { isLoading: isEditing }] = useEditUserMutation();

  const [username, setUser] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [role, setRole] = useState("");
  const [id_redmine, setIdRedmine] = useState(null);
  const [id_bitrix24, setIdBitrix24] = useState(null);
  const [managerId, setManagerId] = useState("");
  const [selectedManager, setSelectedManager] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setUser(user.username);
      setNom(user.nom);
      setPrenom(user.prenom);
      setRole(user.role);
      setIdRedmine(user.id_redmine || "");
      setIdBitrix24(user.id_bitrix24 || "");
      setManagerId(user.manager?.id || "");
      setSelectedManager(
        user.manager
          ? {
              id: user.manager.id,
              nom: user.manager.nom,
              prenom: user.manager.prenom,
            }
          : null
      );
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await editUser({
        id,
        username,
        nom,
        prenom,
        role,
        managerId,
        id_redmine,
        id_bitrix24,
      });
      navigate("/utilisateurs");
      if (response.error) {
        throw new Error(response.error.data.message || "Une erreur inconnue");
      }
      toast.success("L'utilisateur a été mis à jour avec succès !");
    } catch (err) {
      toast.error(err.message || "Une erreur est survenue.");
    }
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
              >
                <MDTypography variant="h6" color="white">
                  {`Modifier l'utilisateur`}
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <MDBox pt={4} pb={3} px={3}>
                  <Box display="flex" justifyContent="center" alignItems="center">
                    <Box
                      component="form"
                      onSubmit={handleSubmit}
                      sx={{
                        p: 4,
                        bgcolor: "white",
                        borderRadius: 2,
                        boxShadow: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        width: 500,
                      }}
                    >
                      {isLoading ? (
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          sx={{ minHeight: "300px" }}
                        >
                          <CircularProgress />
                        </Box>
                      ) : (
                        <>
                          <MDBox mb={2}>
                            <MDInput
                              type="text"
                              value={username}
                              onChange={(e) => setUser(e.target.value)}
                              label="Nom d'utilisateur"
                              fullWidth
                              disabled
                            />
                          </MDBox>
                          <MDBox mb={2}>
                            <MDInput
                              type="text"
                              label="Nom"
                              value={nom}
                              onChange={(e) => setNom(e.target.value)}
                              fullWidth
                            />
                          </MDBox>
                          <MDBox mb={2}>
                            <MDInput
                              type="text"
                              label="Prénom"
                              value={prenom}
                              onChange={(e) => setPrenom(e.target.value)}
                              fullWidth
                            />
                          </MDBox>
                          <MDBox mb={2}>
                            <SelectFieldRole role={role} setRole={setRole} />
                          </MDBox>
                          {role === "Collaborateur" && (
                            <MDBox mb={2}>
                              <AutocompleteField
                                useFetchHook={() => useGetByRoleQuery("manager")}
                                fullWidth
                                setSelectedItem={setSelectedManager}
                                setIdItem={setManagerId}
                                selectedItem={selectedManager}
                                label="Choisir un manager"
                              />
                            </MDBox>
                          )}
                          {role === "Collaborateur" && (
                            <MDBox mb={2}>
                              <MDInput
                                type="text"
                                label="ID Redmine"
                                value={id_redmine}
                                onChange={(e) => setIdRedmine(e.target.value)}
                                fullWidth
                              />
                            </MDBox>
                          )}
                          {role === "Collaborateur" && (
                            <MDBox mb={2}>
                              <MDInput
                                type="text"
                                label="ID Bitrix24"
                                value={id_bitrix24}
                                onChange={(e) => setIdBitrix24(e.target.value)}
                                fullWidth
                              />
                            </MDBox>
                          )}
                          <MDButton variant="gradient" color="info" type="submit" fullWidth>
                            Mettre à jour
                          </MDButton>
                        </>
                      )}
                      <ToastContainer />
                    </Box>
                  </Box>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default EditUser;
