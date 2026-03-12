import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import typography from "assets/theme/base/typography";

function Footer() {
  const { size } = typography;
  return (
    <MDBox
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={1.5}
      py={2}
    >
      <MDTypography variant="button" color="text" fontSize={size.sm}>
        &copy; {new Date().getFullYear()} AI Grievance Portal
      </MDTypography>
    </MDBox>
  );
}

Footer.defaultProps = {};

export default Footer;
