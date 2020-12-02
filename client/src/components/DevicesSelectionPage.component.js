import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DevicesList from './DevicesList.component';
import DeviceSelectionTabs from './UniversalTabs.component';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import { setAllDevices, refreshDeviceParams } from '../actions/DevicesSelectionPage.action';
import CollapsibleTable from './CollapsibleTable.component';
import DeviceService from '../services/device.service';
import ActivateService from '../services/activate.service';
import worker from 'workerize-loader!../workers/devices.worker'; //eslint-disable-line import/no-webpack-loader-syntax

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(3)
  },
}));

let instance;

function DevicesSelectionPage(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { setAllDevices, allDevices, selectedDevice, authenticated, refreshDeviceParams } = props;

  const reformatDeviceDataToReducer = (data) => {
    let arr = []
    for (const [key, value] of Object.entries(data)) {
      arr.push({ [key]: value })
    }
    return arr
  }

  //initial fetch all devices
  useEffect(() => {
    DeviceService.getDevices().then(res => {
      setAllDevices(reformatDeviceDataToReducer(res.data))
    })
  }, [setAllDevices])

  //setup web worker for fetching periodically
  useEffect(() => {
    const refreshDeviceData = (message) => {
      const { data } = message;
      if (data !== undefined && data.type !== 'RPC') {
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

  const createTabs = (devices, selectedDevice) => {
    let columns = []
    let rows = []
    let tabs = []
    devices.map((device, index) => {
      const entries = Object.entries(device)
      for (const [, properties] of entries) {
        if (properties.id === selectedDevice.selectedDeviceID) {
          const propertiesEntries = Object.entries(properties)
          for (const [column, cell] of propertiesEntries) {
            if (typeof cell !== 'object' && cell !== null) {
              //INFO tab
              columns.push(t(`DevicesSelectionPage.Properties.${column}`))
              //columns.push(column)
              rows.push(cell)
            }
            else {
              const tab = createTab(cell)
              tabs.push({
                label: t(`DevicesSelectionPage.Tabs.${column}`),
                content: <CollapsibleTable columns={tab.columns} rows={tab.rows} />
              })
            }
          }
        }
      }
      return null
    })
    tabs.push({
      label: t(`DevicesSelectionPage.Tabs.info`),
      content: <CollapsibleTable columns={columns} rows={[rows]} />
    })

    return <DeviceSelectionTabs
      name={selectedDevice.selectedDeviceType}
      tabs={tabs}
    />
  }

  const createTab = (obj) => {
    let columns = []
    let rows = []
    const entries = Object.entries(obj)
    for (const [, properties] of entries) {
      let row = []
      const propertiesEntries = Object.entries(properties)
      for (const [column, cell] of propertiesEntries) {
        if (!columns.includes(t(`DevicesSelectionPage.Properties.${column}`))) {
          columns.push(t(`DevicesSelectionPage.Properties.${column}`))
        }
        //if is numeric and with decimal place, set precision to 2
        if (!isNaN(cell) && cell % 1 !== 0 && cell !== false && cell !== true) {
          row.push(parseFloat(cell).toFixed(2))
        }
        else {
          if (column === 'lastValueTick') {

            row.push(formatDateTime(new Date(cell * 1000)))
          }
          else {
            row.push(cell)
          }
        }
      }
      rows.push(row)
    }
    return { rows, columns }
  }

  const formatDateTime = (date) => {
    const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
    const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}, ${hours}:${minutes}:${seconds}`;
  }

  //const isActive = selectedDevice.selectedDeviceID !== '' && allDevices[selectedDevice.selectedDeviceIndex] !== undefined && allDevices[selectedDevice.selectedDeviceIndex][selectedDevice.selectedDeviceID].isActive ? true : false;
  const isActive = () => {
    if (selectedDevice.selectedDeviceID !== '' && allDevices[selectedDevice.selectedDeviceIndex] !== undefined) {
      if (selectedDevice.selectedDeviceType === 'InternalDevice') {
        return allDevices[selectedDevice.selectedDeviceIndex][selectedDevice.selectedDeviceID].isActive ? true : false
      }
      else {
        return allDevices[selectedDevice.selectedDeviceIndex][selectedDevice.selectedDeviceID].isActive && allDevices[selectedDevice.selectedDeviceIndex][selectedDevice.selectedDeviceID].isConnected ? true : false
      }
    }
    else {
      return null
    }
  }

  const activateDevice = (activate, device) => {
    ActivateService.activateDevice(activate, device).then(res => {
      if(res.status === 200) {
        refreshDeviceParams(res.data)
      }
    })
  }

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={3}>
          <Typography variant="h4" className={classes.title}>{t('DevicesSelectionPage.DevicesTitle')}</Typography>
          <DevicesList />
        </Grid>
        <Grid container item xs={12} sm={12} md={9} spacing={0}>
          <Grid item xs={12}>
            <Typography variant="h4" className={classes.title}>{selectedDevice.selectedDeviceID}</Typography>
            <React.Fragment>
              {createTabs(allDevices, selectedDevice)}
            </React.Fragment>
          </Grid>
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h5">{t('DevicesSelectionPage.Status')}: {isActive() ? t('DevicesSelectionPage.StatusConnected') : t('DevicesSelectionPage.StatusDisconnected')}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button
                onClick={() => activateDevice(true, selectedDevice.selectedDeviceID)}
                fullWidth
                variant="contained"
                color="primary"
                disabled={isActive() ? true : false}>
                {t('DevicesSelectionPage.Connect')}
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button
                onClick={() => activateDevice(false, selectedDevice.selectedDeviceID)}
                fullWidth
                variant="contained"
                color="secondary"
                disabled={isActive() ? false : true}>
                {t('DevicesSelectionPage.Disconnect')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    selectedDevice: state.DevicesListReducer,
    allDevices: state.DevicesSelectionPageReducer.devices,
    authenticated: state.AuthenticationReducer.authed
  }
}

const mapDispatchToProps = {
  setAllDevices,
  refreshDeviceParams
}

export default connect(mapStateToProps, mapDispatchToProps)(DevicesSelectionPage)