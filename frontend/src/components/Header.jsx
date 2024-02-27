import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Tooltip,
  Avatar
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import WebhookIcon from "@mui/icons-material/Webhook";
import { Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { logout } from '../actions/userActions';

function Header() {
  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, userInfo } = userLogin;

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar sx={{ bgcolor: "#242424", position: "sticky" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            DSALGO-Q4
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {userInfo ? (
                <div>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography
                      component={Link}
                      to="/"
                      textAlign="center"
                      sx={{ color: "inherit", textDecoration: "none" }}
                    >
                      Home
                    </Typography>
                  </MenuItem>

                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography
                      // component={Button}
                      onClick={logoutHandler}
                      textAlign="center"
                      sx={{ color: "inherit", textDecoration: "none" }}
                    >
                      Logout
                    </Typography>
                  </MenuItem>
                </div>
              ) : (
                <div>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography
                      component={Link}
                      to="/"
                      textAlign="center"
                      sx={{ color: "inherit", textDecoration: "none" }}
                    >
                      Home
                    </Typography>
                  </MenuItem>

                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography
                      component={Link}
                      to="/auth/login"
                      textAlign="center"
                      sx={{ color: "inherit", textDecoration: "none" }}
                    >
                      Login
                    </Typography>
                  </MenuItem>
                </div>
              )}
            </Menu>
          </Box>

          <WebhookIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              "&:visited": {
                color: "inherit", // Set the same color as for the normal state
              },
            }}
          >
            DSALGO-Q4
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              onClick={handleCloseNavMenu}
              component={Link}
              to="/"
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Home
            </Button>

            {!userInfo ? (
                <Button
                onClick={handleCloseNavMenu}
                component={Link}
                to="login/"
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Login
              </Button>
            ):(
                <></>
            )}

          </Box>

          <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
            {userInfo ? (
              <Tooltip>
                <div>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={userInfo.username}
                      src="/static/images/avatar/2.jpg"
                    />
                  </IconButton>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem onClick={handleCloseUserMenu}>
                      <Typography
                        sx={{ color: "inherit", textDecoration: "none" }}
                        // component={Link}
                        onClick={logoutHandler}
                        // to={`/${setting.toLowerCase()}`}
                        textAlign="center"
                      >
                        Logout
                      </Typography>
                    </MenuItem>
                    
                  </Menu>
                </div>
              </Tooltip>
            ) : (
              <div></div>
            )}
          </Box>
          {/* You can add more buttons for navigation */}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
