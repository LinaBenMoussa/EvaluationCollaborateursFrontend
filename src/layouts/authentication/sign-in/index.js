import { useEffect, useRef, useState } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/clouds-reflected-windows-contemporary-building.webp";
import { useDispatch } from "react-redux";
import { Box, CircularProgress } from "@mui/material";
import { loginSuccess } from "../../../store/slices/authSlice";
import { useLoginMutation } from "../../../store/api/authApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Basic() {
  const userRef = useRef();
  const [username, setUser] = useState("");
  const [password, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  useEffect(() => {
    userRef.current.focus();
  }, []);
  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ username, password });
      if (response.error) {
        throw new Error(response.error.data.message || "Une erreur inconnue");
      }
      const userData = response.data;
      dispatch(loginSuccess({ ...userData, username }));
      toast.success("Connexion réussie !");
      setPwd("");
      setUser("");
      navigate("/");
    } catch (err) {
      if (err.message.includes("Échec de l'authentification")) {
        toast.error(err.message);
      } else {
        toast.error("Une erreur est survenue.");
      }
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
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
            <MDBox component="form" role="form" onSubmit={handleSubmit}>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Username"
                  onChange={(e) => setUser(e.target.value)}
                  value={username}
                  ref={userRef}
                  fullWidth
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="password"
                  label="Password"
                  onChange={(e) => setPwd(e.target.value)}
                  value={password}
                  fullWidth
                />
              </MDBox>
              <MDBox mt={4} mb={1}>
                <MDButton type="submit" variant="gradient" color="info" fullWidth>
                  sign in
                </MDButton>
              </MDBox>
              <ToastContainer />
            </MDBox>
          )}
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
