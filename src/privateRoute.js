/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ role }) => {
  if (role?.[0] === "ROLE_MANAGER") {
    return <Navigate to="/dashboard" />;
  } else if (role?.[0] === "ROLE_COLLABORATEUR") {
    return <Navigate to="/pointage" />;
  } else if (role?.[0] === "ROLE_ADMIN") {
    console.log("role", role);
    return <Navigate to="/utilisateurs" />;
  } else {
    return <Navigate to="/login" />;
  }
};
