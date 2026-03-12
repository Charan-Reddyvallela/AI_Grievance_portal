/**
 * AI Grievance Portal - Routes
 */

import { Navigate } from "react-router-dom";
import Icon from "@mui/material/Icon";

// Layouts
import Landing from "layouts/landing";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import CitizenDashboard from "layouts/citizen-dashboard";
import AdminDashboard from "layouts/admin-dashboard";
import ComplaintTracking from "layouts/complaint-tracking";

import { useAuth } from "context/AuthContext";

function ProtectedRoute({ children, adminOnly }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}

const authRoutes = [
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/login",
    component: <SignIn />,
    sidebar: false,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/register",
    component: <SignUp />,
    sidebar: false,
  },
];

const dashboardRoutes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: (
      <ProtectedRoute>
        <CitizenDashboard />
      </ProtectedRoute>
    ),
    sidebar: true,
    adminOnly: false,
  },
  {
    type: "collapse",
    name: "Track",
    key: "track",
    icon: <Icon fontSize="small">search</Icon>,
    route: "/track",
    component: (
      <ProtectedRoute>
        <ComplaintTracking />
      </ProtectedRoute>
    ),
    sidebar: true,
    adminOnly: false,
  },
  {
    type: "collapse",
    name: "Admin",
    key: "admin",
    icon: <Icon fontSize="small">admin_panel_settings</Icon>,
    route: "/admin",
    component: (
      <ProtectedRoute adminOnly>
        <AdminDashboard />
      </ProtectedRoute>
    ),
    sidebar: true,
    adminOnly: true,
  },
];

const routes = [
  {
    type: "collapse",
    name: "Home",
    key: "landing",
    icon: <Icon fontSize="small">home</Icon>,
    route: "/",
    component: <Landing />,
    sidebar: false,
  },
  ...authRoutes,
  ...dashboardRoutes,
  {
    type: "collapse",
    name: "Track by ID",
    key: "track-id",
    route: "/track/:complaintId",
    component: (
      <ProtectedRoute>
        <ComplaintTracking />
      </ProtectedRoute>
    ),
    sidebar: false,
  },
];

export default routes;

export function getSidebarRoutes(user) {
  if (!user) return [];
  return dashboardRoutes.filter((r) => r.sidebar && (!r.adminOnly || user.role === "admin"));
}
