/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-router-dom components
import { Link } from "react-router-dom";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function DefaultNavbarLink({ icon: IconComponent, name, route, light }) {
  return (
    <MDBox
      component={Link}
      to={route}
      display="flex"
      alignItems="center"
      gap={1}
      px={1.5}
      py={0.75}
      sx={{
        cursor: "pointer",
        userSelect: "none",
        textDecoration: "none",
        borderRadius: 1,
        transition: "background-color 0.2s",
        "&:hover": { backgroundColor: light ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)" },
      }}
    >
      {IconComponent && (
        <MDBox sx={{ display: "flex", alignItems: "center", color: "inherit", "& > svg": { flexShrink: 0 } }}>
          <IconComponent size={18} strokeWidth={2} style={{ color: "currentColor" }} />
        </MDBox>
      )}
      <MDTypography
        variant="button"
        fontWeight="medium"
        color={light ? "white" : "dark"}
        textTransform="capitalize"
        sx={{
          lineHeight: 1.25,
          whiteSpace: "nowrap",
          fontSize: "0.9375rem",
        }}
      >
        {name}
      </MDTypography>
    </MDBox>
  );
}

// Typechecking props for the DefaultNavbarLink
DefaultNavbarLink.defaultProps = {
  icon: undefined,
};

DefaultNavbarLink.propTypes = {
  icon: PropTypes.elementType,
  name: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
  light: PropTypes.bool.isRequired,
};

export default DefaultNavbarLink;
