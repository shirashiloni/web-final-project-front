import { NavLink } from 'react-router-dom';

import NewPostIcon from '@mui/icons-material/AddCircle';
import ExploreIcon from '@mui/icons-material/Explore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AppBar, Toolbar, Typography, Button, Stack } from '@mui/material';

const TopBar = () => {
  const linkStyle = { textDecoration: 'none', color: 'inherit' };
  const activeStyle = { textDecoration: 'underline' };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Welcome!
        </Typography>

        <Stack direction="row" spacing={2}>
          <NavLink to="/profile" style={({ isActive }) => (isActive ? activeStyle : linkStyle)}>
            <Button color="inherit" startIcon={<AccountCircleIcon />}>
              Profile
            </Button>
          </NavLink>
          <NavLink to="/explore" style={({ isActive }) => (isActive ? activeStyle : linkStyle)}>
            <Button color="inherit" startIcon={<ExploreIcon />}>
              Explore
            </Button>
          </NavLink>
          <NavLink to="/post" style={({ isActive }) => (isActive ? activeStyle : linkStyle)}>
            <Button color="inherit" startIcon={<NewPostIcon />}>
              New Post
            </Button>
          </NavLink>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
