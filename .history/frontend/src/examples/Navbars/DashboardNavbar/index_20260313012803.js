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
import { useLocation, Link, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";

// MUI icons
import Home from "@mui/icons-material/Home";
import Person from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpen from "@mui/icons-material/MenuOpen";
import Settings from "@mui/icons-material/Settings";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import Breadcrumbs from "examples/Breadcrumbs";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import { useMaterialUIController, setTransparentNavbar, setMiniSidenav } from "context";
import { useAuth } from "context/AuthContext";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, darkMode } = controller;
  const [anchorEl, setAnchorEl] = useState(null);
  const route = useLocation().pathname.split("/").slice(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  const openProfileMenu = Boolean(anchorEl);
  const handleOpenProfileMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseProfileMenu = () => setAnchorEl(null);

  const handleMenuProfile = () => {
    handleCloseProfileMenu();
    navigate("/profile");
  };
  const handleMenuSettings = () => {
    handleCloseProfileMenu();
    navigate("/profile"); // or a dedicated /settings route if you add one
  };

  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }
    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);

  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;
      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }
      return colorValue;
    },
  });

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "?";
    return name
      .trim()
      .split(/\s+/)
      .map((s) => s[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon={Home} title={route[route.length - 1] || "Dashboard"} route={route} light={light} />
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })} display="flex" alignItems="center" gap={1}>
            <IconButton
              size="small"
              disableRipple
              color="inherit"
              sx={navbarMobileMenu}
              onClick={handleMiniSidenav}
            >
              {miniSidenav ? <MenuOpen sx={iconsStyle} fontSize="small" /> : <MenuIcon sx={iconsStyle} fontSize="small" />}
            </IconButton>
            <IconButton
              onClick={handleOpenProfileMenu}
              size="small"
              sx={{ p: 0 }}
              aria-controls={openProfileMenu ? "profile-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openProfileMenu ? "true" : undefined}
            >
              <Avatar
                src={user?.profile_image || user?.avatar}
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: light ? "rgba(255,255,255,0.2)" : "info.main",
                  color: light ? "inherit" : "white",
                  border: "2px solid",
                  borderColor: light ? "rgba(255,255,255,0.5)" : "grey.300",
                }}
              >
                {user?.name ? getInitials(user.name) : <Person sx={{ fontSize: 22 }} />}
              </Avatar>
            </IconButton>
            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={openProfileMenu}
              onClose={handleCloseProfileMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{ sx: { mt: 1.5, minWidth: 160 } }}
            >
              <MenuItem onClick={handleMenuProfile}>
                <Person sx={{ mr: 1.5, fontSize: 20 }} />
                <MDTypography variant="button">Profile</MDTypography>
              </MenuItem>
              <MenuItem onClick={handleMenuSettings}>
                <Settings sx={{ mr: 1.5, fontSize: 20 }} />
                <MDTypography variant="button">Settings</MDTypography>
              </MenuItem>
            </Menu>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
