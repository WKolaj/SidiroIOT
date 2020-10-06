import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import CloudIcon from '@material-ui/icons/Cloud';
import { connect } from 'react-redux';
import { selectDevice } from '../actions/DevicesList.action';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    //backgroundColor: theme.palette.background.paper,
  },
}));

function SimpleList(props) {
  const classes = useStyles();


  return (
    <div className={classes.root}>
      <List component="nav" aria-label="device selection">
        <ListItem button onClick={()=>props.selectDevice(0, 'mindsphere', 'MindSphere')} selected={props.selectedDevice.selectedDeviceIndex === 0 ? true : false}>
          <ListItemIcon>
            <CloudIcon />
          </ListItemIcon>
          <ListItemText primary="MindSphere" />
        </ListItem>
        <ListItem button onClick={()=>props.selectDevice(1, 'meter1', 'Meter')} selected={props.selectedDevice.selectedDeviceIndex === 1 ? true : false}>
          <ListItemIcon>
            <FontAwesomeIcon icon={faCircle} color="green" />
          </ListItemIcon>
          <ListItemText primary="Meter1" />
        </ListItem>
        <ListItem button onClick={()=>props.selectDevice(2, 'meter2', 'Meter')} selected={props.selectedDevice.selectedDeviceIndex === 2 ? true : false}>
          <ListItemIcon>
            <FontAwesomeIcon icon={faCircle} color="red" />
          </ListItemIcon>
          <ListItemText primary="Meter2" />
        </ListItem>
      </List>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedDevice: state.DevicesListReducer
  }
}

const mapDispatchToProps = {
  selectDevice
}

export default connect(mapStateToProps, mapDispatchToProps)(SimpleList)