import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import PageLayout from "examples/LayoutContainers/PageLayout";
import AuthFooter from "../AuthFooter";

export default function BasicLayout({ image, children }) {
  return (
    <PageLayout>
      <DefaultNavbar
        action={{ type: "internal", route: "/register", label: "Sign up", color: "info" }}
        transparent
        light
      />
      <MDBox
        position="absolute"
        width="100%"
        minHeight="100vh"
        sx={{
          background: image
            ? undefined
            : "linear-gradient(165deg, #e8f4fc 0%, #d4e9f7 28%, #b8d9f0 55%, #9ec9e8 100%)",
          backgroundImage: image
            ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${image})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          "&::before": image
            ? undefined
            : {
                content: '""',
                position: "absolute",
                inset: 0,
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                pointerEvents: "none",
              },
        }}
      />
      <MDBox
        px={1}
        width="100%"
        height="100vh"
        maxHeight="100vh"
        py={{ xs: 2, sm: 3 }}
        mx="auto"
        sx={{
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          border: "none",
          boxShadow: "none",
          outline: "none",
        }}
      >
        <Grid
          container
          spacing={1}
          justifyContent="center"
          alignItems="center"
          sx={{
            flex: "1 1 auto",
            minHeight: 0,
            py: { xs: 1, sm: 0 },
            border: "none",
            boxShadow: "none",
          }}
        >
          <Grid item xs={11} sm={9} md={5} lg={4} xl={3} sx={{ minHeight: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
            {children}
          </Grid>
        </Grid>
        <AuthFooter light />
      </MDBox>
    </PageLayout>
  );
}
BasicLayout.propTypes = {
  image: PropTypes.string,
  children: PropTypes.node.isRequired,
};
