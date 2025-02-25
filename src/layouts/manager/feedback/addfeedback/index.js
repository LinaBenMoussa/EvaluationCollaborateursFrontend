import { useEffect, useRef, useState } from "react";
import { Box, Button, Card, Grid, Stack, TextField } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDButton from "components/MDButton";
import LikeDislikeButtons from "./likeButton";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import AutocompleteField from "layouts/shared/autocompleteField";
import { useGetCollaborateursByManagerQuery } from "store/api/userApi";
import { useAddFeedbackMutation } from "store/api/feedbackApi";
import { selectCurrentUser } from "store/slices/authSlice";

function AddFeedBack() {
  const [collaborateurId, setCollaborateurId] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [type, setType] = useState("");
  const [selectedCollaborateur, setSelectedCollaborateur] = useState(null);
  const [addFeedback] = useAddFeedbackMutation();
  const navigate = useNavigate();
  const managerId = useSelector(selectCurrentUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addFeedback({
        commentaire,
        collaborateurId,
        type,
        managerId,
      });
      console.log("response", response);
      if (response.error) {
        throw new Error(response.error.data.message || "Une erreur inconnue");
      }

      toast.success("Feedback a été ajouté avec succès !");
      setCollaborateurId("");
      setCommentaire("");
      setType("");
      setSelectedCollaborateur(null);
      navigate("/feedback");
    } catch (err) {
      if (err.message.includes("Veuillez remplir tous les champs.")) {
        toast.error(err.message);
      } else {
        toast.error("Une erreur est survenue.");
      }
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
                  Feedback
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
                      <AutocompleteField
                        useFetchHook={() => useGetCollaborateursByManagerQuery(managerId)}
                        fullWidth
                        setSelectedItem={setSelectedCollaborateur}
                        setIdItem={setCollaborateurId}
                        selectedItem={selectedCollaborateur}
                        label="Choisir un collaborateur"
                      />
                      <TextField
                        label="Commantaire"
                        type="text"
                        onChange={(e) => setCommentaire(e.target.value)}
                        value={commentaire}
                        fullWidth
                      />
                      <LikeDislikeButtons type={type} setType={setType} />
                      <MDButton variant="gradient" type="submit" color="info" fullWidth>
                        Envoyer
                      </MDButton>
                    </Box>
                    <ToastContainer />
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

export default AddFeedBack;
