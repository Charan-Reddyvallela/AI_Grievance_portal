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

import { createContext, useContext, useState, useEffect, useMemo } from "react";

// Material Dashboard 2 React main context
const MaterialUI = createContext();

// Material Dashboard 2 React context provider
const MaterialUIControllerProvider = ({ children }) => {
  const [controller, dispatch] = useMaterialUIController();

  return <MaterialUI.Provider value={[controller, dispatch]}>{children}</MaterialUI.Provider>;
};

// Material Dashboard 2 React custom hook for using context
const useMaterialUIController = () => {
  const context = useContext(MaterialUI);

  if (!context) {
    throw new Error("useMaterialUIController should be used inside the MaterialUIControllerProvider.");
  }

  return context;
};

// Typechecking props for the MaterialUIControllerProvider
MaterialUIControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Context module functions
const setMiniSidenav = (dispatch, value) => dispatch({ type: "SET_MINI_SIDENAV", value });
const setTransparentSidenav = (dispatch, value) => dispatch({ type: "SET_TRANSPARENT_SIDENAV", value });
const setWhiteSidenav = (dispatch, value) => dispatch({ type: "SET_WHITE_SIDENAV", value });
const setDarkMode = (dispatch, value) => dispatch({ type: "SET_DARKMODE", value });
const setLayout = (dispatch, value) => dispatch({ type: "SET_LAYOUT", value });
const setOpenConfigurator = (dispatch, value) => dispatch({ type: "SET_OPEN_CONFIGURATOR", value });
  const setDirection = (dispatch, value) => dispatch({ type: "SET_DIRECTION", value });
  const setColor = (dispatch, value) => dispatch({ type: "SET_COLOR", value });

const useMaterialUIController = () => {
  const [controller, dispatch] = useState({
    miniSidenav: false,
    transparentSidenav: false,
    whiteSidenav: false,
    darkMode: false,
    layout: "dashboard",
    openConfigurator: false,
    direction: "ltr",
    sidenavColor: "info",
  });

  return [controller, dispatch];
};

export {
  MaterialUIControllerProvider,
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
  setDarkMode,
  setLayout,
  setOpenConfigurator,
  setDirection,
  setColor,
};
