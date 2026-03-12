/**
 * Re-export Material UI controller (theme, sidenav, navbar) from context-ui
 * so imports from "context" get the reducer-based provider with setTransparentNavbar, etc.
 */
export {
  MaterialUIControllerProvider,
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
  setSidenavColor,
  setTransparentNavbar,
  setFixedNavbar,
  setOpenConfigurator,
  setDirection,
  setLayout,
  setDarkMode,
} from "../context-ui";
