/* eslint-disable react/prop-types */
import { Button, Icon } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../store/slices/authSlice";
import MDButton from "../../../components/MDButton";
import MDTypography from "components/MDTypography";
import PropTypes from "prop-types";

const LogoutButton = ({ miniSidenav }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/authentication/sign-in");
  };

  return (
    <MDButton
      onClick={handleLogout}
      variant="contained"
      color="secondary"
      size="small"
      startIcon={!miniSidenav && <Icon>logout</Icon>}
      sx={{
        borderRadius: "8px",
        backgroundColor: (theme) => theme.palette.secondary.dark,
        minWidth: miniSidenav ? "40px" : "auto",
        p: miniSidenav ? "8px" : "6px 16px",
      }}
    >
      {miniSidenav ? <Icon>logout</Icon> : <>Déconnexion</>}
    </MDButton>
  );
};

LogoutButton.defaultProps = {
  miniSidenav: false,
};

LogoutButton.propTypes = {
  miniSidenav: PropTypes.bool,
};

export default LogoutButton;
