import PropTypes from "prop-types";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import typography from "assets/theme/base/typography";

export default function AuthFooter({ light }) {
  const { size } = typography;
  return (
    <MDBox
      position="absolute"
      width="100%"
      bottom={0}
      py={3}
      sx={{
        background: "linear-gradient(to top, rgba(30, 60, 90, 0.85) 0%, rgba(30, 60, 90, 0.4) 70%, transparent 100%)",
        backdropFilter: "saturate(180%) blur(8px)",
      }}
    >
      <Container>
        <MDBox
          width="100%"
          display="flex"
          flexDirection={{ xs: "column", lg: "row" }}
          justifyContent="space-between"
          alignItems="center"
          px={1.5}
        >
          <MDBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
            color={light ? "white" : "text"}
            fontSize={size.sm}
          >
            &copy; {new Date().getFullYear()}, AI Grievance Portal
          </MDBox>
          <MDBox component="ul" sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", listStyle: "none", mt: { xs: 3, lg: 0 }, mb: 0, p: 0 }}>
            <MDBox component="li" pr={2} lineHeight={1}>
              <Link href="/terms" target="_blank" rel="noreferrer">
                <MDTypography variant="button" fontWeight="regular" color={light ? "white" : "dark"}>Terms</MDTypography>
              </Link>
            </MDBox>
            <MDBox component="li" px={2} lineHeight={1}>
              <Link href="/privacy" target="_blank" rel="noreferrer">
                <MDTypography variant="button" fontWeight="regular" color={light ? "white" : "dark"}>Privacy</MDTypography>
              </Link>
            </MDBox>
          </MDBox>
        </MDBox>
      </Container>
    </MDBox>
  );
}
AuthFooter.defaultProps = { light: false };
AuthFooter.propTypes = { light: PropTypes.bool };
