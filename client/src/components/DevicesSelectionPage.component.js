import React, { useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DevicesList from './DevicesList.component';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setAllDevices, refreshDeviceParams } from '../actions/DevicesSelectionPage.action';
import DeviceService from '../services/device.service';
import worker from 'workerize-loader!../workers/devices.worker'; //eslint-disable-line import/no-webpack-loader-syntax
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import MBDeviceDisplay from './DevicesSelectionPageComponents/MBDeviceDisplay.component';
import S7DeviceDisplay from './DevicesSelectionPageComponents/S7DeviceDisplay.component';
import InternalDeviceDisplay from './DevicesSelectionPageComponents/InternalDeviceDisplay.component';
import MBGatewayDeviceDisplay from './DevicesSelectionPageComponents/MBGatewayDeviceDisplay.component';
import MSAgentDeviceDisplay from './DevicesSelectionPageComponents/MSAgentDeviceDisplay.component';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 'calc(100% - 70px)'
  },
  title: {
    marginBottom: theme.spacing(3)
  },
  alignTop: {
    verticalAlign: 'top'
  },
  devicesTitleInline: {
    marginBottom: theme.spacing(3),
    display: 'inline-block'
  },
  marginTopTable: {
    marginTop: theme.spacing(4)
  },
  noDevicesContainer: {
    width: '100%',
    textAlign: 'center'
  },
  fullHeight: {
    height: '100%'
  },
  sticky: {
    [`${theme.breakpoints.up('md')}`]: {
      position: 'sticky',
      top: theme.spacing(10)
    },
  }
}));

let instance;

function DevicesSelectionPage(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { setAllDevices, allDevices, selectedDevice, authenticated, refreshDeviceParams } = props;

  const sortObjectKeys = (obj) => Object.entries(obj).sort().reduce((o, [k, v]) => { o[k] = v; return o }, {})

  const fetchDevices = useCallback(() => {
    DeviceService.getDevices().then(res => {
      if (res.status === 200) {
        setAllDevices(sortObjectKeys(res.data))
      }
    })
  }, [setAllDevices]);

  //initial fetch all devices
  useEffect(() => {
    fetchDevices()
  }, [setAllDevices, fetchDevices])

  //setup web worker for fetching periodically
  useEffect(() => {
    const refreshDeviceData = (message) => {
      const { data } = message;
      if (data !== undefined && data.type !== 'RPC' && data.id !== undefined) {
        refreshDeviceParams(data)
      }
    }

    instance = worker()
    instance.addEventListener("message", message => refreshDeviceData(message));
    return () => {
      instance.postMessage({ token: null, text: 'stop' })
      instance.removeEventListener("message", message => refreshDeviceData(message))
      instance.terminate()
    }
  }, [refreshDeviceParams])

  //check if authenticated, if not - stop fetching
  useEffect(() => {
    if (instance !== null) {
      if (authenticated === false) {
        instance.postMessage({ token: null, text: 'stop' })
      }
      else {
        instance.postMessage({ token: JSON.parse(localStorage.getItem("user")).accessToken, text: 'start', device: selectedDevice.selectedDeviceID });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, selectedDevice])

  const displaySelectedDevice = () => {
    switch (selectedDevice.selectedDeviceType) {
      case 'MBDevice':
        return <MBDeviceDisplay />
      case 'S7Device':
        return <S7DeviceDisplay />
      case 'InternalDevice':
        return <InternalDeviceDisplay />
      case 'MBGatewayDevice':
        return <MBGatewayDeviceDisplay />
      case 'MSAgentDevice':
        return <MSAgentDeviceDisplay />
      default:
        return null
    }
  }

  return (
    <React.Fragment>
      <Grid container spacing={2} justify="flex-start" alignItems="flex-start" className={classes.root}>
        <Grid item xs={12} sm={12} md={3} xl={2} className={classes.sticky}>
          <Typography variant="h4" className={classes.devicesTitleInline}>{t('DevicesSelectionPage.DevicesTitle')}</Typography>
          <Zoom in={true} style={{ transitionDelay: '500ms' }}>
            <Tooltip title={t('DevicesSelectionPage.RefreshAllDevices')} placement="bottom">
              <IconButton aria-label="refresh" className={classes.alignTop} onClick={() => fetchDevices()} >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Zoom>
          <DevicesList />
        </Grid>

        {Object.keys(allDevices).length > 0 ?
          <Grid container item xs={12} sm={12} md={9} xl={10} spacing={0} className={classes.fullHeight}>
            <Grid item xs={12} >
              {displaySelectedDevice()}
            </Grid>
          </Grid>
          :
          <div className={classes.noDevicesContainer}>
            <Typography variant="h4">{t('DevicesSelectionPage.NoDevicesHeader')}</Typography>
          </div>
        }
      </Grid>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    selectedDevice: state.DevicesListReducer,
    allDevices: state.DevicesSelectionPageReducer.devices,
    authenticated: state.AuthenticationReducer.authed,
    tableView: state.DevicesSelectionPageReducer.tableView
  }
}

const mapDispatchToProps = {
  setAllDevices,
  refreshDeviceParams,
}

export default connect(mapStateToProps, mapDispatchToProps)(DevicesSelectionPage)