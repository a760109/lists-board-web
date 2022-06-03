import { useSelector, useDispatch } from 'react-redux';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useAuth0 } from '@auth0/auth0-react';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';
import TaskInfoDialog from './components/TaskInfoDialog';
import { getTasksData, createTask } from './store/tasksSlice';
import Tasks from './Tasks';
import { showSuccess } from 'app/store/messageSlice';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function Home() {
  const userData = useSelector(({ auth }) => auth.user.userData);
  const dispatch = useDispatch();

  const { logout } = useAuth0();

  const [anchorEl, setAnchorEl] = React.useState();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState();
  const [isOpenNewDialog, setIsOpenNewDialog] = React.useState(false);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleOnCreate = React.useCallback(
    async data => {
      dispatch(createTask(data));
      setIsOpenNewDialog(false);
      dispatch(showSuccess());
    },
    [dispatch],
  );

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu anchorEl={anchorEl} id={menuId} keepMounted open={isMenuOpen} onClose={handleMenuClose}>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          localStorage.clear();
          logout({ returnTo: `${window.location.origin}` });
        }}
      >
        Logout
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu anchorEl={mobileMoreAnchorEl} id={mobileMenuId} keepMounted open={isMobileMenuOpen} onClose={handleMobileMenuClose}>
      <MenuItem
        onClick={() => {
          setIsOpenNewDialog(true);
        }}
      >
        <IconButton color='inherit'>
          <AddBoxIcon />
        </IconButton>
        <p>Add</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton aria-label='account of current user' aria-controls='primary-search-account-menu' aria-haspopup='true' color='inherit'>
          <Avatar src={userData.picture} />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='h6' noWrap component='div' sx={{ display: { xs: 'none', sm: 'block' } }}>
              {userData.name}
            </Typography>
            {/* <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase placeholder='Search…' inputProps={{ 'aria-label': 'search' }} />
            </Search> */}
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton
                size='large'
                onClick={() => {
                  setIsOpenNewDialog(true);
                }}
                color='inherit'
              >
                <AddBoxIcon />
              </IconButton>
              <IconButton
                size='large'
                edge='end'
                aria-label='account of current user'
                aria-controls={menuId}
                aria-haspopup='true'
                onClick={handleProfileMenuOpen}
                color='inherit'
              >
                <Avatar src={userData.picture} />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size='large'
                aria-label='show more'
                aria-controls={mobileMenuId}
                aria-haspopup='true'
                onClick={handleMobileMenuOpen}
                color='inherit'
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
        <TaskInfoDialog
          open={isOpenNewDialog}
          onClose={() => {
            setIsOpenNewDialog(false);
          }}
          onSubmitted={handleOnCreate}
        />
      </Box>
      <Tasks />
    </div>
  );
}
