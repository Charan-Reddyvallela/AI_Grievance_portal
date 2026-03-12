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

import { useState, useEffect } from "react";

// react-router components
import { Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

// Icons (Lucide)
import { Home, MapPin, UserPlus, LogIn, ShieldCheck } from "lucide-react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DefaultNavbarLink from "examples/Navbars/DefaultNavbar/DefaultNavbarLink";
import DefaultNavbarMobile from "examples/Navbars/DefaultNavbar/DefaultNavbarMobile";

// Material Dashboard 2 React base styles
import breakpoints from "assets/theme/base/breakpoints";

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";

function DefaultNavbar({ transparent, light, action }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [mobileNavbar, setMobileNavbar] = useState(false);
  const [mobileView, setMobileView] = useState(false);

  const openMobileNavbar = ({ currentTarget }) => setMobileNavbar(currentTarget.parentNode);
  const closeMobileNavbar = () => setMobileNavbar(false);

  useEffect(() => {
    // A function that sets the display state for the DefaultNavbarMobile.
    function displayMobileNavbar() {
      if (window.innerWidth < breakpoints.values.lg) {
        setMobileView(true);
        setMobileNavbar(false);
      } else {
        setMobileView(false);
        setMobileNavbar(false);
      }
    }

    /** 
     The event listener that's calling the displayMobileNavbar function when 
     resizing the window.
    */
    window.addEventListener("resize", displayMobileNavbar);

    // Call the displayMobileNavbar function to set the state with the initial value.
    displayMobileNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", displayMobileNavbar);
  }, []);

  return (
    <>
      <MDBox
        py={1.25}
        px={{ xs: 2, sm: 3, lg: 4 }}
        position="absolute"
        top={0}
        left={0}
        right={0}
        zIndex={3}
        shadow={transparent ? "none" : "md"}
        color={light ? "white" : "dark"}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={({
          palette: { transparent: transparentColor, white, background },
          functions: { rgba },
        }) => ({
          backgroundColor: transparent && light
            ? "rgba(15, 23, 42, 0.88)"
            : transparent
            ? transparentColor.main
            : rgba(darkMode ? background.sidenav : white.main, 0.92),
          backdropFilter: transparent && light ? "saturate(180%) blur(12px)" : transparent ? "none" : "saturate(200%) blur(30px)",
        })}
      >
        {/* Project name – left */}
        <MDBox
          component={Link}
          to="/"
          display="flex"
          alignItems="center"
          gap={1.25}
          py={0.5}
          sx={{ overflow: "visible", minWidth: 0, textDecoration: "none", flexShrink: 0 }}
        >
          <ShieldCheck size={22} strokeWidth={2} style={{ color: "currentColor", flexShrink: 0 }} />
          <MDTypography
            variant="button"
            fontWeight="bold"
            color={light ? "white" : "dark"}
            sx={{
              whiteSpace: "nowrap",
              fontSize: { xs: "0.9375rem", sm: "1.0625rem" },
              letterSpacing: "0.02em",
            }}
          >
            AI Grievance Portal
          </MDTypography>
        </MDBox>

        {/* Nav links + button – right */}
        <MDBox display="flex" alignItems="center" sx={{ gap: 0 }}>
          <MDBox color="inherit" display={{ xs: "none", lg: "flex" }} alignItems="center">
            <DefaultNavbarLink icon={Home} name="Home" route="/" light={light} />
            <DefaultNavbarLink icon={MapPin} name="Track" route="/track" light={light} />
            <DefaultNavbarLink icon={UserPlus} name="Sign up" route="/register" light={light} />
            {!(action?.route === "/login") && <DefaultNavbarLink icon={LogIn} name="Sign in" route="/login" light={light} />}
          </MDBox>
          {action &&
          (action.type === "internal" ? (
            <MDBox display={{ xs: "none", lg: "inline-block" }} ml={1}>
              <MDButton
                component={Link}
                to={action.route}
                variant="gradient"
                color={action.color ? action.color : "info"}
                size="small"
                sx={{
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  fontSize: "0.8125rem",
                  px: 2,
                  py: 1,
                }}
              >
                {action.label}
              </MDButton>
            </MDBox>
          ) : (
            <MDBox display={{ xs: "none", lg: "inline-block" }} ml={1}>
              <MDButton
                component="a"
                href={action.route}
                target="_blank"
                rel="noreferrer"
                variant="gradient"
                color={action.color ? action.color : "info"}
                size="small"
                sx={{
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  fontSize: "0.8125rem",
                  px: 2,
                  py: 1,
                }}
              >
                {action.label}
              </MDButton>
            </MDBox>
          ))}
          <MDBox
            display={{ xs: "inline-block", lg: "none" }}
            lineHeight={0}
            py={0.5}
            pl={1}
            color="inherit"
            sx={{ cursor: "pointer", "& > svg": { fontSize: 24 } }}
            onClick={openMobileNavbar}
          >
            {mobileNavbar ? <CloseIcon /> : <MenuIcon />}
          </MDBox>
        </MDBox>
      </MDBox>
      {mobileView && <DefaultNavbarMobile open={mobileNavbar} close={closeMobileNavbar} action={action} />}
    </>
  );
}

// Setting default values for the props of DefaultNavbar
DefaultNavbar.defaultProps = {
  transparent: false,
  light: false,
  action: false,
};

// Typechecking props for the DefaultNavbar
DefaultNavbar.propTypes = {
  transparent: PropTypes.bool,
  light: PropTypes.bool,
  action: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      type: PropTypes.oneOf(["external", "internal"]).isRequired,
      route: PropTypes.string.isRequired,
      color: PropTypes.oneOf([
        "primary",
        "secondary",
        "info",
        "success",
        "warning",
        "error",
        "dark",
        "light",
      ]),
      label: PropTypes.string.isRequired,
    }),
  ]),
};

export default DefaultNavbar;
