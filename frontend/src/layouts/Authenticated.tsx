import { api, useLogoutMutation } from "@/services/api";
import { useAppDispatch } from "@/store/store";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/mate
TextDecoderStream, rial/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Link, Outlet, useNavigate, useRevalidator } from "react-router-dom";

import { store } from "@/store/store";
import { redirect } from "react-router-dom";

export const authLoader = () => {
  const { isAuthenticated } = store.getState().auth;

  if (!isAuthenticated) {
    throw redirect("/login");
  }

  return null;
};

export default function Authenticated() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigation = useNavigate();
  const [logoutUser] = useLogoutMutation();
  const { revalidate } = useRevalidator();
  const dispatch = useAppDispatch();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const afterLogout = async () => {
    // Revalidate all the routes
    await revalidate();
    // Reset apis cache
    dispatch(api.util.resetApiState());
  };

  const handleClose = (route?: "profile" | "logout") => {
    return () => {
      if (route) {
        if (route == "logout") {
          logoutUser().finally(afterLogout);
        } else {
          navigation("/" + route);
        }
      }
      setAnchorEl(null);
    };
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            disabled
          >
            <MenuIcon />
          </IconButton>
          <Box
            display="flex"
            gap={2}
            alignItems="center"
            component={Link}
            to="/"
            sx={{ textDecoration: "none" }}
          >
            <Typography color="white" variant="h6" sx={{ flexGrow: 1 }}>
              App Logo
            </Typography>
          </Box>
          <Box marginLeft="auto">
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose()}
            >
              <MenuItem onClick={handleClose("profile")}>Profile</MenuItem>
              <MenuItem onClick={handleClose("logout")}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Outlet />
    </Box>
  );
}
