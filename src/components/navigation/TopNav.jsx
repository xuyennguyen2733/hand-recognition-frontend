import {
  AppBar,
  Box,
  Button,
  Container,
  Menu,
  MenuItem,
  SvgIcon,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import MainFullIcon from "../../shared/CustomSvgIcon";
import styled from "@emotion/styled";

const pages = [
  // {
  //   link: "/test",
  //   label: "Test a model",
  // },
  {
    link: "/examine-hand",
    label: "Examine hand movement",
  },
  // {
  //   link: "/collect-hand-lite",
  //   label: "Collect hand data (Lite)",
  // },
  {
    link: "/collect-hand",
    label: "Collect hand data",
  },
];

const NavButton = styled(Button)({
  padding: "0.2rem",
  margin: "0.3rem",
  height: "2.5rem",
  width: "auto",
  "&:focus": {
    outline: "none",
  },
  textTransform: "capitalize",
  fontWeight: "bolder",
});

function TopNav() {
  const location = useLocation();

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "black", height: "4rem" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link to="/">
            <NavButton variant="text">
              <MainFullIcon
                sx={{
                  height: "100%",
                  width: "auto",
                  marginRight: "1rem",
                }}
              />
            </NavButton>
          </Link>
          <Box sx={{ flexGrow: 1, display: "flex" }}>
            {pages.map(({ link, label }) => (
              <Link to={link} key={link}>
                <NavButton
                  variant={location.pathname === link ? "contained" : "text"}
                >
                  {label}
                </NavButton>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default TopNav;
