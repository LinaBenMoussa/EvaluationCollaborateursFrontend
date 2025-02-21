/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";

// Material Dashboard 2 React themes
import theme from "assets/theme";

// Material Dashboard 2 React routes
import routes from "routes";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav } from "context";
import "react-toastify/dist/ReactToastify.css";

import SignIn from "layouts/authentication/sign-in";

// Images
import brandWhite from "assets/images/logo_clinisys.png";
import { useSelector } from "react-redux";
import { selectCurrentRole, selectIsAuthenticated } from "./store/slices/authSlice";
import AuthRequired from "store/slices/RequireAuth";
import AddFeedBack from "layouts/feedback/addfeedback";
import LogoutButton from "layouts/authentication/logout/logout";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, direction, layout, sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();
  const userRole = useSelector(selectCurrentRole);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes
      .filter((route) => !route.roles || route.roles.includes(userRole?.[0] ?? ""))
      .map((route) => {
        if (route.collapse) {
          return getRoutes(route.collapse);
        }
        if (route.route) {
          return <Route exact path={route.route} element={route.component} key={route.key} />;
        }
        return null;
      });
    
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isAuthenticated && layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={brandWhite}
            brandName=""
            routes={routes.filter((route) => !route.roles || route.roles.includes(userRole?.[0] ?? ""))}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
            footerComponent={<LogoutButton />}
          />
        </>
      )}
      <Routes>
      <Route
        path="/*"
        element={
          <AuthRequired>
            <Routes>
              {getRoutes(routes)}
              <Route path="*" element={<Navigate to="/dashboard" />} />
              <Route path="/addfeedback" element={<AddFeedBack />} />
            </Routes>
          </AuthRequired>
        }
      />
        <Route path="/authentication/sign-in" element={<SignIn />} />
      </Routes>
    </ThemeProvider>
    
  );
}
