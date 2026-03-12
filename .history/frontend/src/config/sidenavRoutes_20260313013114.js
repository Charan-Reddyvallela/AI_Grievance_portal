import Dashboard from "@mui/icons-material/Dashboard";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import Search from "@mui/icons-material/Search";
import Person from "@mui/icons-material/Person";
import Logout from "@mui/icons-material/Logout";
import AdminPanelSettings from "@mui/icons-material/AdminPanelSettings";

/**
 * Sidenav routes for dashboard layout.
 * Top: Dashboard, Submit new complaint, Track Complaint. Then Profile, Admin (if admin).
 * Sign out is pinned to the bottom of the sidebar (position: "bottom").
 */
export function getSidenavRoutes(isAdmin) {
  const iconSx = { fontSize: 20 };
  const top = [
    { type: "collapse", name: "Dashboard", key: "dashboard", icon: <Dashboard sx={iconSx} />, route: "/dashboard" },
    { type: "collapse", name: "Submit new complaint", key: "submit", icon: <AddCircleOutline sx={iconSx} />, route: "/dashboard#submit" },
    { type: "collapse", name: "Track Complaint", key: "track", icon: <Search sx={iconSx} />, route: "/track" },
    { type: "collapse", name: "Profile", key: "profile", icon: <Person sx={iconSx} />, route: "/profile" },
  ];
  if (isAdmin) {
    top.push({ type: "collapse", name: "Admin", key: "admin", icon: <AdminPanelSettings sx={iconSx} />, route: "/admin" });
  }
  const bottom = [
    { type: "collapse", name: "Sign out", key: "signout", icon: <Logout sx={iconSx} />, route: "/logout", position: "bottom" },
  ];
  return { main: top, bottom: bottom };
}
