import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CloudIcon from '@material-ui/icons/Cloud';
import { connect } from 'react-redux';
import { selectDevice } from '../actions/DevicesList.action';
import StorageIcon from '@material-ui/icons/Storage';
import MemoryIcon from '@material-ui/icons/Memory';
import AssessmentIcon from '@material-ui/icons/Assessment';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    position: 'relative',
    overflow: 'auto',
    maxHeight: '80vh',
    //backgroundColor: theme.palette.background.paper,
  },
  active: {
    color: 'green'
  },
  inactive: {
    color: 'red'
  }
}));

function SimpleList(props) {
  const classes = useStyles();
  const { allDevices, selectedDevice, selectDevice } = props;

  useEffect(() => {
    if(selectedDevice.selectedDeviceID === '' && allDevices.length>0) {
      const firstEntry = Object.entries(allDevices[0])
      selectDevice(0, firstEntry[0][1].id, firstEntry[0][1].type)
    }
  }, [allDevices, selectDevice, selectedDevice.selectedDeviceID])

  

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="device selection" >
        {allDevices.map((dev, index) => {
          const entries = Object.entries(dev)
          for (const [, properties] of entries) {
            const isActive = properties.isConnected !==undefined? properties.isConnected && properties.isActive : properties.isActive;
            return (<ListItem key={index} button
              selected={selectedDevice.selectedDeviceIndex === index ? true : false}
              onClick={() => props.selectDevice(index, properties.id, properties.type)}>
              <ListItemIcon>
                {properties.type === 'MBDevice' ? <AssessmentIcon className={isActive ? classes.active : classes.inactive} />
                  : properties.type === 'S7Device' ? <MemoryIcon className={isActive ? classes.active : classes.inactive} />
                    : properties.type === 'InternalDevice' ? <StorageIcon className={isActive ? classes.active : classes.inactive} />
                      : <CloudIcon className={isActive ? classes.active : classes.inactive} />}
              </ListItemIcon>
              <ListItemText primary={properties.id} />
            </ListItem>)
          }
          return null
        })}
      </List>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedDevice: state.DevicesListReducer,
    allDevices: state.DevicesSelectionPageReducer.devices
  }
}

const mapDispatchToProps = {
  selectDevice
}

export default connect(mapStateToProps, mapDispatchToProps)(SimpleList)