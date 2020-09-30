import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { BrowserRouter as Router, Link } from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
import ViewArrayIcon from "@material-ui/icons/ViewArray";
import LanguageIcon from "@material-ui/icons/Language";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { connect } from 'react-redux';
//import { setLanguageDialogOpen } from '../actions/LanguageDialog.action';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import Routes from '../routes/index.routes.js';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
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
    textAlign: 'center'
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
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1
  },
  content: {
    flexGrow: 1,
    width: `calc(100% - 57px)`,
    padding: theme.spacing(1),
    [`${theme.breakpoints.down('sm')} and (orientation: portrait)`]: {
      paddingBottom: theme.spacing(7),
      paddingTop: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    },
  },
  bottomNaviAction: {
    minWidth: '50px'
  }
}));

function MiniDrawer(props) {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Router>
        <CssBaseline />
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, classes.drawerClose)}
          classes={{paper: clsx(classes.drawerClose)}}
          open={false}
        >
          <List>
          <Tooltip title={t('Drawer.1')}>
            <ListItem button component={Link} to="/"  >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={t('Drawer.1')} />
            </ListItem>
            </Tooltip>
            <Tooltip title={t('Drawer.2')}>
            <ListItem button component={Link} to="/settings" >
              <ListItemIcon>
                <ViewArrayIcon />
              </ListItemIcon>
              <ListItemText primary={t('Drawer.2')} />
            </ListItem>
            </Tooltip>
            <Divider />
            <Tooltip title={t('Drawer.Language')}>
            <ListItem
              button 
              //onClick={() => props.setLanguageDialogOpen(true)}
            >
              <ListItemIcon>
                <LanguageIcon />
              </ListItemIcon>
              <ListItemText primary={t('Drawer.Language')} />
            </ListItem>
            </Tooltip>
          </List>
        </Drawer>
        <main className={classes.content}>
          <Routes/>
        </main>
        <BottomNavigation
          showLabels={false}
          className={classes.bottomNavi}
        >
          <BottomNavigationAction className={classes.bottomNaviAction} label={t('Drawer.Overview')} icon={<HomeIcon />} component={Link} to="/" value="/" showLabel={true} />
          <BottomNavigationAction className={classes.bottomNaviAction} label={t('Drawer.Elevation')} icon={<ViewArrayIcon />} component={Link} to="/elevation" value="/elevation" showLabel={true} />
          <BottomNavigationAction className={classes.bottomNaviAction} label={t('Drawer.Language')} icon={<LanguageIcon />} 
          //onClick={() => props.setLanguageDialogOpen(true)} 
          showLabel={true} 
          />
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
  //setLanguageDialogOpen
}

export default connect(mapStateToProps, mapDispatchToProps)(MiniDrawer);