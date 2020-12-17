import React, { useEffect, useCallback } from 'react';
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
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(3)
  },
  onboarded: {
    color: 'green'
  },
  offboarded: {
    color: 'red'
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
  }

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

  const fetchDevices = useCallback(() => {
    DeviceService.getDevices().then(res => {
      if (res.status === 200) {
        setAllDevices(reformatDeviceDataToReducer(res.data))
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

  const converter = (data) => {
    let tables = {}
    data.forEach(obj => {
      if (Array.isArray(obj)) {
        //if array of arrays, access properties only
        obj = obj[1]
      }
      if (tables[obj.type] === undefined) {
        tables = {
          ...tables,
          [obj.type]: {
            type: obj.type,
            rows: [],
            cols: templates(obj.type, data).cols
          }
        }
      }
      tables = {
        ...tables,
        [obj.type]: {
          ...tables[obj.type],
          rows: [...tables[obj.type].rows, templates(obj.type, obj).rows]
        }
      }
    })
    return tables
  }

  const templates = (type, data) => {
    switch (type) {
      //devices
      case 'MBDevice':
        return {
          cols: [t('DevicesSelectionPage.Properties.ipAddress'), t('DevicesSelectionPage.Properties.isActive'), t('DevicesSelectionPage.Properties.isConnected'), t('DevicesSelectionPage.Properties.name'), t('DevicesSelectionPage.Properties.portNumber'), t('DevicesSelectionPage.Properties.timeout'), t('DevicesSelectionPage.Properties.type')],
          rows: [data.ipAddress, data.isActive, data.isConnected, data.name, data.portNumber, data.timeout, data.type]
        }
      case 'InternalDevice':
        return {
          cols: [t('DevicesSelectionPage.Properties.isActive'), t('DevicesSelectionPage.Properties.name'), t('DevicesSelectionPage.Properties.type')],
          rows: [data.isActive, data.name, data.type]
        }
      case 'MSAgentDevice':
        return {
          cols: ['boarded', 'dataStorageSize', 'eventStorageSize', t('DevicesSelectionPage.Properties.isActive'), t('DevicesSelectionPage.Properties.name'), 'numberOfDataFilesToSend', 'numberOfEventFilesToSend', 'numberOfSendDataRetries', 'numberOfSendEventRetries', 'sendDataFileInterval', 'sendEventFileInterval', 'MSAgentDevice'],
          rows: [data.boarded, data.dataStorageSize, data.eventStorageSize, data.isActive, data.name, data.numberOfDataFilesToSend, data.numberOfEventFilesToSend, data.numberOfSendDataRetries, data.numberOfSendEventRetries, data.sendDataFileInterval, data.sendEventFileInterval, data.MSAgentDevice]
        }
      case 'S7Device':
        return {
          cols: ['ipAddress', 'isActive', 'isConnected', 'name', 'rack', 'slot', 'timeout', 'type'],
          rows: [data.ipAddress, data.isActive, data.isConnected, data.name, data.rack, data.slot, data.timeout, data.type]
        }

      //edge computing
      case 'AverageCalculator':
        return {
          cols: ['name', 'type', 'value', 'unit', 'defaultValue', 'factor', 'sampleTime', 'calculationInterval', 'lastValueTick'],
          rows: [data.name, data.type, data.value, data.unit, data.defaultValue, data.factor, data.sampleTime, data.calculationInterval, data.lastValueTick]
        }
      case 'IncreaseCalculator':
        return {
          cols: ['name', 'type', 'value', 'unit', 'defaultValue', 'factor', 'sampleTime', 'overflow', 'calculationInterval', 'lastValueTick'],
          rows: [data.name, data.type, data.value, data.unit, data.defaultValue, data.factor, data.sampleTime, data.overflow, data.calculationInterval, data.lastValueTick]
        }
      case 'FactorCalculator':
        return {
          cols: ['name', 'type', 'value', 'unit', 'defaultValue', 'factor', 'sampleTime', 'lastValueTick'],
          rows: [data.name, data.type, data.value, data.unit, data.defaultValue, data.factor, data.sampleTime, data.lastValueTick]
        }
      case 'SumCalculator':
        return {
          cols: ['name', 'type', 'value', 'unit', 'defaultValue', 'sampleTime', 'lastValueTick'],
          rows: [data.name, data.type, data.value, data.unit, data.defaultValue, data.sampleTime, data.lastValueTick]
        }
      case 'ValueFromByteArrayCalculator':
        return {
          cols: ['name', 'type', 'value', 'unit', 'defaultValue', 'bitNumber', 'byteNumber', 'length', 'sampleTime', 'lastValueTick'],
          rows: [data.name, data.type, data.value, data.unit, data.defaultValue, data.bitNumber, data.byteNumber, data.length, data.sampleTime, data.lastValueTick]
        }
      case 'ExpressionCalculator':
        return {
          cols: ['name', 'type', 'value', 'unit', 'defaultValue', 'expression', 'parameters', 'sampleTime', 'lastValueTick'],
          rows: [data.name, data.type, data.value, data.unit, data.defaultValue, data.expression, data.parameters, data.sampleTime, data.lastValueTick]
        }

      //variables
      case 'MBBoolean':
      case 'MBByteArray':
      case 'MBFloat':
      case 'MBDouble':
      case 'MBUInt32':
      case 'MBUInt16':
      case 'MBInt32':
      case 'MBInt16':
      case 'MBSwappedInt32':
      case 'MBSwappedUInt32':
      case 'MBSwappedFloat':
      case 'MBSwappedDouble':
        return {
          cols: [t('DevicesSelectionPage.Properties.defaultValue'), t('DevicesSelectionPage.Properties.lastValueTick'), t('DevicesSelectionPage.Properties.length'), t('DevicesSelectionPage.Properties.name'), t('DevicesSelectionPage.Properties.offset'), t('DevicesSelectionPage.Properties.offset'), t('DevicesSelectionPage.Properties.readAsSingle'), t('DevicesSelectionPage.Properties.readFCode'), t('DevicesSelectionPage.Properties.sampleTime'), t('DevicesSelectionPage.Properties.type'), t('DevicesSelectionPage.Properties.unit'), t('DevicesSelectionPage.Properties.value'), t('DevicesSelectionPage.Properties.write'), t('DevicesSelectionPage.Properties.writeAsSingle'), t('DevicesSelectionPage.Properties.writeFCode')],
          rows: [data.defaultValue, formatDateTime(new Date(data.lastValueTick * 1000)), data.length, data.name, data.offset, data.read, data.readAsSingle, data.readFCode, data.sampleTime, data.type, data.unit, parseFloat(data.value).toFixed(2), data.write, data.writeAsSingle, data.writeFCode]
        }
      case 'LastCycleDurationVariable':
      case 'CPULoadVariable':
        return {
          cols: [t('DevicesSelectionPage.Properties.defaultValue'), t('DevicesSelectionPage.Properties.lastValueTick'), t('DevicesSelectionPage.Properties.name'), t('DevicesSelectionPage.Properties.sampleTime'), t('DevicesSelectionPage.Properties.type'), t('DevicesSelectionPage.Properties.unit'), t('DevicesSelectionPage.Properties.value')],
          rows: [data.defaultValue, formatDateTime(new Date(data.lastValueTick * 1000)), data.name, data.sampleTime, data.type, data.unit, parseFloat(data.value).toFixed(2)]
        }
      case 'S7Real':
        return {
          cols: ['name', 'type', 'value', 'unit', 'dbNumber', 'defaultValue', 'lastValueTick', 'length', 'memoryType', 'offset', 'read', 'readAsSingle', 'sampleTime', 'write', 'writeAsSingle'],
          rows: [data.name, data.type, data.value, data.unit, data.dbNumber, data.defaultValue, data.lastValueTick, data.length, data.memoryType, data.offset, data.read, data.readAsSingle, data.sampleTime, data.write, data.writeAsSingle]
        }
      // case 'AssociatedVariable':
      //   return {
      //     cols: [],
      //     rows: [data.name, data.type, data.value, data.unit, data.defaultValue, data.sampleTime, data.associatedDeviceId, ]
      //   }

      //alerts
      case 'HighLimitAlert':
        return {
          cols: [t('DevicesSelectionPage.Properties.defaultValue'), t('DevicesSelectionPage.Properties.highLimit'), t('DevicesSelectionPage.Properties.hysteresis'), t('DevicesSelectionPage.Properties.lastValueTick'), t('DevicesSelectionPage.Properties.name'), t('DevicesSelectionPage.Properties.sampleTime'), 'severity', 'texts', 'timeOffDelay', 'timeOnDelay', t('DevicesSelectionPage.Properties.type'), t('DevicesSelectionPage.Properties.unit'), t('DevicesSelectionPage.Properties.value')],
          rows: [data.defaultValue, data.highLimit, data.hysteresis, formatDateTime(new Date(data.lastValueTick * 1000)), data.name, data.sampleTime, data.severity, data.texts, data.timeOffDelay, data.timeOnDelay, data.type, data.unit, parseFloat(data.value).toFixed(2)]
        }
      case 'BandwidthLimitAlert':
        return {
          cols: [t('DevicesSelectionPage.Properties.defaultValue'), t('DevicesSelectionPage.Properties.highLimit'), t('DevicesSelectionPage.Properties.hysteresis'), t('DevicesSelectionPage.Properties.lastValueTick'), 'lowLimit', t('DevicesSelectionPage.Properties.name'), t('DevicesSelectionPage.Properties.sampleTime'), 'severity', 'texts', 'timeOffDelay', 'timeOnDelay', t('DevicesSelectionPage.Properties.type'), t('DevicesSelectionPage.Properties.unit'), t('DevicesSelectionPage.Properties.value')],
          rows: [data.defaultValue, data.highLimit, data.hysteresis, formatDateTime(new Date(data.lastValueTick * 1000)), data.lowLimit, data.name, data.sampleTime, data.severity, data.texts, data.timeOffDelay, data.timeOnDelay, data.type, data.unit, parseFloat(data.value).toFixed(2)]
        }
      case 'LowLimitAlert':
        return {
          cols: [t('DevicesSelectionPage.Properties.defaultValue'), t('DevicesSelectionPage.Properties.hysteresis'), t('DevicesSelectionPage.Properties.lastValueTick'), 'lowLimit', t('DevicesSelectionPage.Properties.name'), t('DevicesSelectionPage.Properties.sampleTime'), 'severity', 'texts', 'timeOffDelay', 'timeOnDelay', t('DevicesSelectionPage.Properties.type'), t('DevicesSelectionPage.Properties.unit'), t('DevicesSelectionPage.Properties.value')],
          rows: [data.defaultValue, data.hysteresis, data.lastValueTick, data.lowLimit, data.name, data.sampleTime, data.severity, data.texts, data.timeOffDelay, data.timeOnDelay, data.type, data.unit, data.value]
        }
      case 'ExactValuesAlert':
        return {
          cols: [t('DevicesSelectionPage.Properties.defaultValue'), t('DevicesSelectionPage.Properties.lastValueTick'), t('DevicesSelectionPage.Properties.name'), t('DevicesSelectionPage.Properties.sampleTime'), t('DevicesSelectionPage.Properties.severity'), t('DevicesSelectionPage.Properties.texts'), t('DevicesSelectionPage.Properties.timeOffDelay'), t('DevicesSelectionPage.Properties.timeOnDelay'), t('DevicesSelectionPage.Properties.type'), t('DevicesSelectionPage.Properties.unit'), t('DevicesSelectionPage.Properties.value')],
          rows: [data.defaultValue, data.lastValueTick, data.name, data.sampleTime, data.severity, data.texts, data.timeOffDelay, data.timeOnDelay, data.type, data.unit, data.value]
        }

      //custom made - without 'type' property - eventsToSendConfig, dataToSendConfig
      case 'eventsToSendConfig':
        return {
          cols: ['sendingInterval', 'entityId', 'sourceType', 'sourceId', 'source', 'severity'],
          rows: [data.sendingInterval, data.entityId, data.sourceType, data.sourceId, data.source, data.severity]
        }
      case 'dataToSendConfig':
        return {
          cols: ['sendingInterval', 'qualityCodeEnabled', 'datapointId', 'dataConverter'],
          rows: [data.sendingInterval, data.qualityCodeEnabled, data.datapointId, data.dataConverter]
        }

      default:
        return {
          cols: [],
          rows: []
        }
    }
  }

  const createTabs = (devices, selectedDevice) => {
    let tabs = []
    devices.forEach((device, index) => {
      const entries = Object.entries(device)
      for (const [, properties] of entries) {
        if (properties.id === selectedDevice.selectedDeviceID) {
          const converted = converter([properties])
          //generate tables for each device type
          const firstLevelTables = traverseObject(converted)
          //info tab
          tabs.push({
            label: t(`DevicesSelectionPage.Tabs.info`),
            content: firstLevelTables.map((table, i) => (<React.Fragment key={i}><Typography variant="h6" className={classes.marginTopTable}>{table.type}</Typography><CollapsibleTable columns={table.cols} rows={table.rows} /></React.Fragment>))
          })

          const propertiesEntries = Object.entries(properties)
          //other tabs, traversing through object
          for (let [column, cell] of propertiesEntries) {
            if (typeof cell === 'object') {
              const traverse = traverseObject(cell, column)
              const converted = converter(traverse)
              const secondLevelTable = traverseObject(converted)
              tabs.push({
                label: t(`DevicesSelectionPage.Tabs.${column}`),
                content: secondLevelTable.map((table, i) => (<React.Fragment key={i}><Typography variant="h6" className={classes.marginTopTable}>{table.type}</Typography><CollapsibleTable columns={table.cols} rows={table.rows} /></React.Fragment>))
              })
            }
          }
        }
      }
      return null
    })

    return <DeviceSelectionTabs
      name={selectedDevice.selectedDeviceType}
      tabs={tabs}
    />
  }

  const traverseObject = (obj, column = null) => {
    //console.log(column)
    let tables = []
    const entries = Object.entries(obj)
    for (const [, tableProperties] of entries) {
      if (column === 'dataToSendConfig' || column === 'eventsToSendConfig') {
        tables.push({ ...tableProperties, type: column })
      }
      else {
        tables.push(tableProperties)
      }
    }
    return tables
  }


  const formatDateTime = (date) => {
    const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
    const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}, ${hours}:${minutes}:${seconds}`;
  }

  const isActive = () => {
    if (selectedDevice.selectedDeviceID !== '' && allDevices[selectedDevice.selectedDeviceIndex] !== undefined) {
      if (allDevices[selectedDevice.selectedDeviceIndex][selectedDevice.selectedDeviceID].isConnected !== undefined) {
        return allDevices[selectedDevice.selectedDeviceIndex][selectedDevice.selectedDeviceID].isActive && allDevices[selectedDevice.selectedDeviceIndex][selectedDevice.selectedDeviceID].isConnected
      }
      else {
        return allDevices[selectedDevice.selectedDeviceIndex][selectedDevice.selectedDeviceID].isActive
      }
    }
    else {
      return null
    }
  }

  const isBoarded = () => {
    return selectedDevice.selectedDeviceType === 'MSAgentDevice' ? allDevices[selectedDevice.selectedDeviceIndex][selectedDevice.selectedDeviceID].boarded : null
  }

  const activateDevice = (activate, device) => {
    ActivateService.activateDevice(activate, device).then(res => {
      if (res.status === 200) {
        refreshDeviceParams(res.data)
      }
    })
  }

  return (
    <React.Fragment>
      <Grid container spacing={2} justify="flex-start"
        alignItems="flex-start">
        <Grid item xs={12} sm={12} md={3} xl={2}>
          <Typography variant="h4" className={classes.devicesTitleInline}>{t('DevicesSelectionPage.DevicesTitle')}</Typography>
          <Tooltip title={t('DevicesSelectionPage.RefreshAllDevices')} placement="bottom">
            <IconButton aria-label="delete" className={classes.alignTop} onClick={() => fetchDevices()} >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <DevicesList />
        </Grid>
        <Grid container item xs={12} sm={12} md={9} xl={10} spacing={0}>
          <Grid item xs={12} >
            <Typography variant="h4" className={classes.title}>{selectedDevice.selectedDeviceID}</Typography>
            <React.Fragment>
              {createTabs(allDevices, selectedDevice)}
            </React.Fragment>
          </Grid>
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h5">{t('DevicesSelectionPage.Status')}: {isActive() ? t('DevicesSelectionPage.StatusConnected') : t('DevicesSelectionPage.StatusDisconnected')}</Typography>
              {selectedDevice.selectedDeviceType === 'MSAgentDevice' ?
                <Typography variant="h6" className={isBoarded() ? classes.onboarded : classes.offboarded}>{isBoarded() ? t('DevicesSelectionPage.StatusOnboarded') : t('DevicesSelectionPage.StatusOffboarded')}</Typography>
                : null}
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