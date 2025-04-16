import PropTypes from "prop-types";
import { Link, Icon } from "@mui/material";
import MDBox from "components/MDBox";
import typography from "assets/theme/base/typography";
import { FaLinkedin } from "react-icons/fa";
import { FaGlobe } from "react-icons/fa";

function Footer() {
  const { size } = typography;

  return (
    <MDBox
      width="100%"
      display="flex"
      flexDirection={{ xs: "column", lg: "row" }}
      justifyContent="space-between"
      alignItems="center"
      px={1.5}
      py={2}
      sx={{
        borderTop: "1px solid #e0e0e0",
        backgroundColor: "background.paper",
      }}
    >
      <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        color="text"
        fontSize={size.sm}
        px={1.5}
      >
        &copy; {new Date().getFullYear()},
        <MDBox component="span" fontWeight="bold" mx={0.5}>
          Clinisys
        </MDBox>
      </MDBox>

      <MDBox
        component="ul"
        sx={({ breakpoints }) => ({
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          listStyle: "none",
          mt: 3,
          mb: 0,
          p: 0,

          [breakpoints.up("lg")]: {
            mt: 0,
          },
        })}
      >
        {/* Social media icons */}
        <MDBox component="li" pl={2} lineHeight={1} display="flex" gap={1}>
          <Link href="https://csys.com.tn/" target="_blank" color="text.secondary">
            <FaGlobe />
          </Link>

          <Link
            href="https://www.linkedin.com/company/clinisys-erp"
            target="_blank"
            color="text.secondary"
          >
            <FaLinkedin />
          </Link>

          <Link
            href="https://www.facebook.com/profile.php?id=100063692281478&locale=fr_FR"
            target="_blank"
            color="text.secondary"
          >
            <Icon>facebook</Icon>
          </Link>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

Footer.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      target: PropTypes.string,
    })
  ),
};

export default Footer;
