import { Navigate } from "react-router-dom";
import { selectCurrentToken } from "./authSlice";
import { useSelector } from "react-redux";

// eslint-disable-next-line react/prop-types
const AuthRequired = ({ children }) => {
  var token = useSelector(selectCurrentToken);
  console.log(token);
  if (!token) {
    return <Navigate to="/authentication/sign-in" />;
  }

  return children;
};

export default AuthRequired;
