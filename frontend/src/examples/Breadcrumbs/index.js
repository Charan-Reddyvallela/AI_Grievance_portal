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

// react-router-dom components
import { Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import { Breadcrumbs as MuiBreadcrumbs } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function Breadcrumbs({ icon: IconComponent, title, route, light }) {
  const routes = route.slice(0, -1);
  const displayTitle = title.replace(/-/g, " ");

  return (
    <MDBox mr={{ xs: 0, xl: 8 }} py={0.5}>
      <MuiBreadcrumbs
        sx={{
          "& .MuiBreadcrumbs-li": {
            display: "flex",
            alignItems: "center",
            lineHeight: 1.5,
          },
          "& .MuiBreadcrumbs-separator": {
            color: ({ palette: { white, grey } }) => (light ? white.main : grey[600]),
            fontSize: "1.125rem",
            fontWeight: 600,
            mx: 1,
            opacity: light ? 0.8 : 0.6,
          },
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <MDBox
            component="span"
            display="inline-flex"
            alignItems="center"
            color={light ? "white" : "dark"}
            sx={{
              opacity: light ? 0.95 : 0.85,
              lineHeight: 0,
              "& > svg": { fontSize: 28 },
              "&:hover": { opacity: 1 },
              transition: "opacity 0.2s ease",
            }}
          >
            {IconComponent ? <IconComponent fontSize="inherit" /> : null}
          </MDBox>
        </Link>
        {routes.map((el) => (
          <Link to={`/${el}`} key={el} style={{ textDecoration: "none" }}>
            <MDTypography
              component="span"
              variant="button"
              fontWeight="medium"
              textTransform="capitalize"
              color={light ? "white" : "dark"}
              opacity={light ? 0.85 : 0.6}
              sx={{ fontSize: "1rem", lineHeight: 1.4, "&:hover": { opacity: 1 } }}
            >
              {el.replace(/-/g, " ")}
            </MDTypography>
          </Link>
        ))}
        <MDTypography
          variant="button"
          fontWeight="bold"
          textTransform="capitalize"
          color={light ? "white" : "dark"}
          sx={{ fontSize: "1.125rem", lineHeight: 1.4, letterSpacing: "0.01em" }}
        >
          {displayTitle}
        </MDTypography>
      </MuiBreadcrumbs>
    </MDBox>
  );
}

// Setting default values for the props of Breadcrumbs
Breadcrumbs.defaultProps = {
  light: false,
};

// Typechecking props for the Breadcrumbs
Breadcrumbs.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  route: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  light: PropTypes.bool,
};

export default Breadcrumbs;
