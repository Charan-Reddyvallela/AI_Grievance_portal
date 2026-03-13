import PropTypes from "prop-types";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import MDBox from "components/MDBox";
import { PORTAL_CONTACT } from "data/portalContent";

export default function AuthFooter({ light }) {
  const year = new Date().getFullYear();
  const textColor = "#ffffff";
  return (
    <MDBox
      component="footer"
      position="relative"
      width="100%"
      py={0.5}
      sx={{
        flexShrink: 0,
        background: "#143250",
        border: "none !important",
        boxShadow: "none",
        outline: "none",
        "&::before, &::after": { display: "none" },
        "& *": { border: "none !important" },
      }}
    >
      <Container maxWidth="xl" disableGutters sx={{ border: "none", "& *": { border: "none" } }}>
        <MDBox
          width="100%"
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
          gap={{ xs: 0.25, sm: 0 }}
          px={1.5}
          sx={{
            fontSize: "0.75rem",
            fontWeight: 500,
            color: textColor,
            lineHeight: 1.4,
          }}
        >
          <MDBox component="span" sx={{ whiteSpace: "nowrap", color: textColor }}>
            &copy; {year}, AI Grievance Portal
          </MDBox>
          <MDBox component="span" sx={{ display: { xs: "none", sm: "inline" }, mx: 1, color: textColor, opacity: 0.9 }} aria-hidden>·</MDBox>
          <Link href="/terms" target="_blank" rel="noreferrer" sx={{ color: textColor, fontSize: "inherit", fontWeight: 500, textDecoration: "underline" }}>
            Terms
          </Link>
          <MDBox component="span" sx={{ color: textColor, opacity: 0.9 }} aria-hidden>·</MDBox>
          <Link href="/privacy" target="_blank" rel="noreferrer" sx={{ color: textColor, fontSize: "inherit", fontWeight: 500, textDecoration: "underline" }}>
            Privacy
          </Link>
          <MDBox component="span" sx={{ display: { xs: "none", sm: "inline" }, mx: 1, color: textColor, opacity: 0.9 }} aria-hidden>·</MDBox>
          <MDBox component="span" sx={{ whiteSpace: "nowrap", color: textColor }}>
            {PORTAL_CONTACT.email} · {PORTAL_CONTACT.phone}
          </MDBox>
        </MDBox>
      </Container>
    </MDBox>
  );
}
AuthFooter.defaultProps = { light: false };
AuthFooter.propTypes = { light: PropTypes.bool };
