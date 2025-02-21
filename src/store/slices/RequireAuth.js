/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthRequired = ({ children }) => {
  const token = useSelector(selectCurrentToken);
  const [isTokenValid, setIsTokenValid] = useState(true);

  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        console.log("Token expiré !");
        setIsTokenValid(false);
      } else {
        setIsTokenValid(true);
      }
    } catch (error) {
      console.error("Token invalide !");
      setIsTokenValid(false);
    }
  }, [token]);

  if (!isTokenValid) {
    return <Navigate to="/authentication/sign-in" replace />;
  }

  return children;
};

export default AuthRequired;
