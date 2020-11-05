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
    if(selectedDevice.selectedDeviceName === '' && allDevices.length>0) {
      const firstEntry = Object.entries(allDevices[0])
      selectDevice(0, firstEntry[0][1].name, firstEntry[0][1].type)
    }
  }, [allDevices, selectDevice, selectedDevice.selectedDeviceName])

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="device selection">
        {allDevices.map((dev, index) => {
          const entries = Object.entries(dev)
          for (const [, properties] of entries) {
            return (<ListItem key={index} button
              selected={selectedDevice.selectedDeviceIndex === index ? true : false}
              onClick={() => props.selectDevice(index, properties.name, properties.type)}>
              <ListItemIcon>
                {properties.type === 'MBDevice' ? <AssessmentIcon className={properties.isActive ? classes.active : classes.inactive} />
                  : properties.type === 'S7Device' ? <MemoryIcon className={properties.isActive ? classes.active : classes.inactive} />
                    : properties.type === 'InternalDevice' ? <StorageIcon className={properties.isActive ? classes.active : classes.inactive} />
                      : <CloudIcon className={properties.isActive ? classes.active : classes.inactive} />}
              </ListItemIcon>
              <ListItemText primary={properties.name} />
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