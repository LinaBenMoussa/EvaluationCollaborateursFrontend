import { Button, Icon } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../store/slices/authSlice";
import MDButton from "../../../components/MDButton";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/authentication/sign-in");
  };

  return (
    <MDButton
      variant="contained"
      color="secondary"
      onClick={handleLogout}
      startIcon={<Icon>logout</Icon>}
      sx={{
        backgroundColor: (theme) => theme.palette.secondary.dark,
      }}
    >
      Déconnexion
    </MDButton>
  );
};

export default LogoutButton;
