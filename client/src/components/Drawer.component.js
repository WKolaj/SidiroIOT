import React, { useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LanguageIcon from "@material-ui/icons/Language";
import ViewArrayIcon from "@material-ui/icons/ViewArray";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import HomeIcon from "@material-ui/icons/Home";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Routes from '../routes/index.routes';
import { setLanguageDialogOpen } from '../actions/LanguageDialog.action';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip, faMemory, faThermometerHalf, faHdd } from '@fortawesome/free-solid-svg-icons'
import Badge from '@material-ui/core/Badge';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    [`${theme.breakpoints.down('sm')} and (orientation: portrait)`]: {
      display: 'none'
    },
    [`${theme.breakpoints.down('sm')} and (orientation: landscape)`]: {
      display: 'flex'
    },
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  bottomNavi: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
    [`${theme.breakpoints.down('sm')} and (orientation: portrait)`]: {
      display: 'flex'
    },
    [`${theme.breakpoints.down('sm')} and (orientation: landscape)`]: {
      display: 'none'
    },
    [`${theme.breakpoints.up('md')}`]: {
      display: 'none'
    },
    textAlign: 'center',
  },
  bottomNaviAction: {
    color: theme.palette.primary.light
  },
  title: {
    flexGrow: 1,
  },
  hardwareUsage: {
    width: '50px',
    height: '40px'
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
    height: '40px',
    flexGrow: 1
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
    loginButton: {
      display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
}));

function MiniDrawer(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();
  const matches = useMediaQuery(`${theme.breakpoints.down('sm')} and (orientation: portrait)`)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  useEffect(() => {
    if (matches) {
      setOpen(false)
    }
  }, [matches])

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <Badge badgeContent={'17%'} color="primary" >
          <IconButton aria-label="show 17 new notifications" color="inherit" className={classes.hardwareUsage} >
            <FontAwesomeIcon icon={faMicrochip} />
          </IconButton>
        </Badge>
        <p>CPU</p>
      </MenuItem>
      <MenuItem>
        <Badge badgeContent={'35%'} color="primary" >
          <IconButton aria-label="show 17 new notifications" color="inherit" className={classes.hardwareUsage}>
            <FontAwesomeIcon icon={faMemory} />
          </IconButton>
        </Badge>
        <p>MEM</p>
      </MenuItem>
      <MenuItem>
        <Badge badgeContent={'35°C'} color="primary">
          <IconButton aria-label="show 17 new notifications" color="inherit" className={classes.hardwareUsage}>
            <FontAwesomeIcon icon={faThermometerHalf} />
          </IconButton>
        </Badge>
        <p>TEMP</p>
      </MenuItem>
      <MenuItem>
        <Badge badgeContent={'55%'} color="primary">
          <IconButton aria-label="show 17 new notifications" color="inherit" className={classes.hardwareUsage}>
            <FontAwesomeIcon icon={faHdd} />
          </IconButton>
        </Badge>
        <p>HDD</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.root}>
      <Router>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
                [classes.hide]: matches
              })}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap className={classes.title}>
              Sidiro IoT
          </Typography>



            <div className={classes.sectionDesktop}>
              <Badge badgeContent={'17%'} color="primary" >
                <IconButton aria-label="show 17 new notifications" color="inherit" className={classes.hardwareUsage} >
                  <FontAwesomeIcon icon={faMicrochip} />
                </IconButton>
              </Badge>
              <Badge badgeContent={'35%'} color="primary" >
                <IconButton aria-label="show 17 new notifications" color="inherit" className={classes.hardwareUsage}>
                  <FontAwesomeIcon icon={faMemory} />
                </IconButton>
              </Badge>
              <Badge badgeContent={'35°C'} color="primary">
                <IconButton aria-label="show 17 new notifications" color="inherit" className={classes.hardwareUsage}>
                  <FontAwesomeIcon icon={faThermometerHalf} />
                </IconButton>
              </Badge>
              <Badge badgeContent={'55%'} color="primary">
                <IconButton aria-label="show 17 new notifications" color="inherit" className={classes.hardwareUsage}>
                  <FontAwesomeIcon icon={faHdd} />
                </IconButton>
              </Badge>
              
            </div>
            <IconButton
            className={classes.loginButton}
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItem button component={Link} to="/"  >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={t('Drawer.1')} />
            </ListItem>
            <ListItem button component={Link} to="/settings"  >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={t('Drawer.2')} />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => props.setLanguageDialogOpen(true)}>
              <ListItemIcon>
                <LanguageIcon />
              </ListItemIcon>
              <ListItemText primary={t('Drawer.Language')} />
            </ListItem>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Routes />
        </main>
        <BottomNavigation
          showLabels={false}
          className={classes.bottomNavi}
        >
          <BottomNavigationAction className={classes.bottomNaviAction} label={t('Drawer.1')} icon={<HomeIcon />} component={Link} to="/" value="/" showLabel={true} />
          <BottomNavigationAction className={classes.bottomNaviAction} label={t('Drawer.2')} icon={<ViewArrayIcon />} component={Link} to="/settings" value="/settings" showLabel={true} />
          <BottomNavigationAction className={classes.bottomNaviAction} label={t('Drawer.Language')} icon={<LanguageIcon />} onClick={() => props.setLanguageDialogOpen(true)}
            showLabel={true} />
        </BottomNavigation>
      </Router>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {

  }
}

const mapDispatchToProps = {
  setLanguageDialogOpen
}

export default connect(mapStateToProps, mapDispatchToProps)(MiniDrawer);