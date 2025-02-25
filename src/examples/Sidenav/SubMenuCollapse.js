/* eslint-disable react/prop-types */
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Collapse from "@mui/material/Collapse";
import MDBox from "components/MDBox";
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Link } from "@mui/material";

function SubMenuCollapse({ item, collapseName }) {
  const [open, setOpen] = useState(false);
  const { name, icon, key, subRoutes } = item;
  const navigate = useNavigate();
  const handleClick = () => setOpen(!open);
  const handleNavigate = () => {
    navigate(route);
  };
  return (
    <>
      {/* L'item principal du sous-menu */}
      <MDBox onClick={handleClick} sx={{ cursor: "pointer" }} display="flex" alignItems="center">
        <SidenavCollapse name={name} icon={icon} active={key === collapseName} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </MDBox>
      {/* Les sous-items */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        {subRoutes.map((sub) => (
          <NavLink key={sub.key || sub.name} to={sub.route} style={{ textDecoration: "none" }}>
            {/* Utilisation de MDBox pour ajouter un décalage (marge à gauche) */}
            <MDBox ml={2}>
              <SidenavCollapse name={sub.name} icon={sub.icon} active={collapseName === sub.key} />
            </MDBox>
          </NavLink>
        ))}
      </Collapse>
    </>
  );
}

export default SubMenuCollapse;
