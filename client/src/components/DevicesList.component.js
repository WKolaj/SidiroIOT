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
import OnlineCircleIcon from '@material-ui/icons/FiberManualRecord';
import RouterIcon from '@material-ui/icons/Router';
import DeviceUnknownIcon from '@material-ui/icons/DeviceUnknown';

const useStyles = makeStyles((theme) => ({
  active: {
    color: '#2fcc2f',
    height: '15px',
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  inactive: {
    color: 'red',
    height: '15px',
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  iconMarginHorizontal: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));

function SimpleList(props) {
  const classes = useStyles();
  const { allDevices, selectedDevice, selectDevice } = props;

  useEffect(() => {
    if (selectedDevice.selectedDeviceID === '' && Object.keys(allDevices).length>0) {
      const firstEntry = Object.entries(allDevices)[0]
      selectDevice(0, firstEntry[1].id, firstEntry[1].type)
    }
  }, [allDevices, selectDevice, selectedDevice])

  const deviceTypeIcon = (type) => {
    switch (type) {
      case 'MBDevice':
        return <AssessmentIcon className={classes.iconMarginHorizontal} />
      case 'S7Device':
        return <MemoryIcon className={classes.iconMarginHorizontal} />
      case 'InternalDevice':
        return <StorageIcon className={classes.iconMarginHorizontal} />
      case 'MBGatewayDevice':
        return <RouterIcon className={classes.iconMarginHorizontal} />
      case 'MSAgentDevice':
        return <CloudIcon className={classes.iconMarginHorizontal} />
      default:
        return <DeviceUnknownIcon className={classes.iconMarginHorizontal} />
    }
  }

  return (
    <React.Fragment>
      <List component="nav" aria-label="device-selection">
        {Object.values(allDevices).map((device, index) => {
          const isActive = device.isConnected !== undefined ? device.isConnected && device.isActive : device.isActive;
          return (
            <ListItem key={index}
              button
              selected={selectedDevice.selectedDeviceIndex === index ? true : false}
              onClick={() => props.selectDevice(index, device.id, device.type)}>
              <ListItemIcon>
                <OnlineCircleIcon className={isActive ? classes.active : classes.inactive} />
                {deviceTypeIcon(device.type)}
              </ListItemIcon>
              <ListItemText primary={device.name} />
            </ListItem>
          )
        })}
      </List>
    </React.Fragment>
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