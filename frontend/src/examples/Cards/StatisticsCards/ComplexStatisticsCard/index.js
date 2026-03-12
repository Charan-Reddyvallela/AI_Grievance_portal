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

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function ComplexStatisticsCard({ color, title, count, percentage, icon }) {
  return (
    <Card
      sx={{
        overflow: "hidden",
        height: "100%",
        minHeight: 140,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 2,
      }}
    >
      <MDBox
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        pt={2}
        px={3}
        pb={0}
        position="relative"
        overflow="visible"
      >
        <MDBox
          variant="gradient"
          bgColor={color}
          color={color === "light" ? "dark" : "white"}
          coloredShadow={color}
          borderRadius="lg"
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="4rem"
          height="4rem"
          sx={{
            flexShrink: 0,
            overflow: "visible",
            position: "relative",
            zIndex: 1,
            "& > .MuiBox-root": { display: "flex", alignItems: "center", justifyContent: "center" },
          }}
        >
          {typeof icon === "string" ? (
            <Icon fontSize="medium" color="inherit" sx={{ fontSize: "2.25rem !important" }}>{icon}</Icon>
          ) : (
            <MDBox sx={{ display: "flex", alignItems: "center", justifyContent: "center", "& > svg": { width: "2.25rem", height: "2.25rem" } }}>
              {icon}
            </MDBox>
          )}
        </MDBox>
        <MDBox
          textAlign="right"
          sx={{
            flex: 1,
            minWidth: 0,
            ml: 2.5,
            position: "relative",
            zIndex: 0,
          }}
        >
          <MDTypography
            variant="button"
            fontWeight="medium"
            color="text"
            sx={{
              display: "block",
              fontSize: "0.9375rem",
              lineHeight: 1.3,
              letterSpacing: "0.02em",
              color: "rgba(0,0,0,0.7)",
            }}
          >
            {title}
          </MDTypography>
          <MDTypography
            variant="h4"
            fontWeight="bold"
            sx={{
              fontSize: "2.25rem",
              lineHeight: 1.2,
              mt: 0.5,
              color: "rgba(0,0,0,0.87)",
              letterSpacing: "-0.02em",
            }}
          >
            {count}
          </MDTypography>
        </MDBox>
      </MDBox>
      <Divider sx={{ my: 0, borderColor: "rgba(0,0,0,0.08)" }} />
      <MDBox pb={2} pt={1} px={3}>
        <MDTypography
          component="p"
          variant="button"
          color="text"
          sx={{
            fontSize: "0.875rem",
            lineHeight: 1.4,
            color: "rgba(0,0,0,0.6)",
          }}
        >
          <MDTypography component="span" variant="button" fontWeight="bold" color={percentage.color} sx={{ fontSize: "0.875rem" }}>
            {percentage.amount}
          </MDTypography>
          {percentage.label ? ` ${percentage.label}` : ""}
        </MDTypography>
      </MDBox>
    </Card>
  );
}

// Setting default values for the props of ComplexStatisticsCard
ComplexStatisticsCard.defaultProps = {
  color: "info",
  percentage: {
    color: "success",
    text: "",
    label: "",
  },
};

// Typechecking props for the ComplexStatisticsCard
ComplexStatisticsCard.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  percentage: PropTypes.shape({
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "white",
    ]),
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
  }),
  icon: PropTypes.node.isRequired,
};

export default ComplexStatisticsCard;
