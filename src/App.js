/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";

// react-router components
import { Routes, Route, useLocation } from "react-router-dom";

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
import AddFeedBack from "layouts/manager/feedback/addfeedback";
import SaisiesTable from "layouts/manager/saisie temps";
import AddUser from "layouts/admin/add-user";
import EditUser from "layouts/admin/edit-user";
import Historique from "layouts/manager/pointage/historique";
import Pointage from "layouts/manager/pointage/journalier";
import Parametre from "layouts/admin/parametre";
import { PrivateRoute } from "privateRoute";


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
              <Route path="*" element={<PrivateRoute role={userRole} />} />
              <Route path="/addfeedback" element={<AddFeedBack />} />
              <Route path="/saisie/:id" element={<SaisiesTable />} />
              <Route path="/adduser" element={<AddUser />} />
              <Route path="/edituser/:id" element={<EditUser />} />
              <Route path="/historique" element={<Historique />} />
              <Route path="/journalier" element={<Pointage />} />
              <Route path="/parametre" element={<Parametre />} />
            </Routes>
          </AuthRequired>
        }
      />
        <Route path="/authentication/sign-in" element={<SignIn />} />
      </Routes>
    </ThemeProvider>
    
  );
}
