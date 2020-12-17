// universal tabs component with tabpanels, only horizontal
//pass required prop 'tabs' to it with [{label: yourlabeltext, content: yourcontent}, ...]
// prop required 'name' required for redux active tab index storage

import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { setUniversalTabsNameIndex } from '../actions/UniversalTabs.action';
import { connect } from 'react-redux';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={1}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

export const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: '20px'
  },
  defaultRoot: {
    flexGrow: 1,
    width: '100%',
    marginBottom: '20px'
  },
  noElevation: {
    boxShadow: 'unset'
  },
  tabpanel: {
    maxHeight: '80vh',
    overflow: 'auto'
  }
}));

function ScrollableTabsButtonForce(props) {
  const classes = useStyles();

  return (
    <div className={props.defaultMargin ? classes.defaultRoot : classes.root}>
      <AppBar position="static" color="default" className={classes.noElevation}>
        <Tabs
          value={props.tabsInstance[props.name] || 0}
          onChange={(event, value)=>props.setUniversalTabsNameIndex(props.name, value)}
          variant="scrollable"
          scrollButtons="auto"
          indicatorColor="secondary"
          textColor="secondary"
          aria-label="scrollable force tabs"
        >
          {props.tabs.map((tab, i) => {
            return <Tab key={`tab-${i}`} label={tab.label} {...a11yProps(i)} />
          })}
        </Tabs>
      </AppBar>
      {props.tabs.map((tab, i) => {
        return <TabPanel key={`tabpanel-${i}`} value={props.tabsInstance[props.name] || 0} index={i} className={classes.tabpanel}>
          {tab.content}
        </TabPanel>
      })}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    tabsInstance: state.UniversalTabsReducer
  }
}

const mapDispatchToProps = {
  setUniversalTabsNameIndex,
}

export default connect(mapStateToProps, mapDispatchToProps)(ScrollableTabsButtonForce)