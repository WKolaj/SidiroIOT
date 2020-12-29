import React, { useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DevicesList from './DevicesList.component';
import DeviceSelectionTabs from './UniversalTabs.component';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import { setAllDevices, refreshDeviceParams, toggleTableView } from '../actions/DevicesSelectionPage.action';
import CollapsibleTable from './CollapsibleTable.component';
import DeviceService from '../services/device.service';
import ActivateService from '../services/activate.service';
import worker from 'workerize-loader!../workers/devices.worker'; //eslint-disable-line import/no-webpack-loader-syntax
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ShortTextIcon from '@material-ui/icons/ShortText';
import Zoom from '@material-ui/core/Zoom';

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
  },
  advancedViewTables: {
    float: 'right',
    verticalAlign: 'top'
  }
}));

let instance;

function DevicesSelectionPage(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { setAllDevices, allDevices, selectedDevice, authenticated, refreshDeviceParams, toggleTableView, tableView } = props;

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
            cols: templates(obj.type, data, tableView).cols
          }
        }
      }
      tables = {
        ...tables,
        [obj.type]: {
          ...tables[obj.type],
          rows: [...tables[obj.type].rows, templates(obj.type, obj, tableView).rows]
        }
      }
    })
    return tables
  }

  const templates = (type, data, tableView) => {
    if (data.value !== undefined && !isNaN(data.value) && data.value !== null && data.value !== false && data.value !== true) {
      data = {
        ...data,
        value: parseFloat(data.value).toFixed(2)
      }
    }
    if (data.lastValueTick !== undefined) {
      data = {
        ...data,
        lastValueTick: formatDateTime(new Date(parseFloat(data.lastValueTick) * 1000))
      }
    }
    switch (type) {
      //devices
      case 'MBDevice':
        if (tableView === 'simple') {
          return {
            cols: ['name', 'isActive', 'isConnected'],
            rows: [data.name, data.isActive, data.isConnected]
          }
        }
        else {
          return {
            cols: ['name', 'type', 'ipAddress', 'portNumber', 'isActive', 'isConnected', 'timeout'],
            rows: [data.name, data.type, data.ipAddress, data.portNumber, data.isActive, data.isConnected, data.timeout]
          }
        }
      case 'InternalDevice':
        if (tableView === 'simple') {
          return {
            cols: ['name', 'isActive'],
            rows: [data.name, data.isActive]
          }
        }
        else {
          return {
            cols: ['name', 'type', 'isActive'],
            rows: [data.name, data.type, data.isActive]
          }
        }

      case 'MSAgentDevice':
        if (tableView === 'simple') {
          return {
            cols: ['name', 'boarded', 'isActive'],
            rows: [data.name, data.boarded, data.isActive]
          }
        }
        else {
          return {
            cols: ['name', 'type', 'boarded', 'isActive', 'dataStorageSize', 'eventStorageSize', 'numberOfDataFilesToSend', 'numberOfEventFilesToSend', 'numberOfSendDataRetries', 'numberOfSendEventRetries', 'sendDataFileInterval', 'sendEventFileInterval'],
            rows: [data.name, data.type, data.boarded, data.isActive, data.dataStorageSize, data.eventStorageSize, data.numberOfDataFilesToSend, data.numberOfEventFilesToSend, data.numberOfSendDataRetries, data.numberOfSendEventRetries, data.sendDataFileInterval, data.sendEventFileInterval]
          }
        }

      case 'S7Device':
        if (tableView === 'simple') {
          return {
            cols: ['name', 'isActive', 'isConnected'],
            rows: [data.name, data.isActive, data.isConnected]
          }
        }
        else {
          return {
            cols: ['name', 'type', 'ipAddress', 'isActive', 'isConnected', 'rack', 'slot', 'timeout'],
            rows: [data.name, data.type, data.ipAddress, data.isActive, data.isConnected, data.rack, data.slot, data.timeout]
          }
        }
      case 'MBGatewayDevice':
        if (tableView === 'simple') {
          return {
            cols: ['name', 'isActive', 'isConnected'],
            rows: [data.name, data.isActive, data.isConnected]
          }
        }
        else {
          return {
            cols: ['name', 'type', 'ipAddress', 'portNumber', 'isActive', 'isConnected', 'timeout'],
            rows: [data.name, data.type, data.ipAddress, data.portNumber, data.isActive, data.isConnected, data.timeout]
          }
        }

      //edge computing
      case 'AverageCalculator':
        if (tableView === 'simple') {
          return {
            cols: ['name', 'value', 'unit', 'lastValueTick'],
            rows: [data.name, data.value, data.unit, data.lastValueTick]
          }
        }
        else {
          return {
            cols: ['name', 'type', 'value', 'unit', 'defaultValue', 'factor', 'sampleTime', 'calculationInterval', 'lastValueTick'],
            rows: [data.name, data.type, data.value, data.unit, data.defaultValue, data.factor, data.sampleTime, data.calculationInterval, data.lastValueTick]
          }
        }
      case 'IncreaseCalculator':
        if (tableView === 'simple') {
          return {
            cols: ['name', 'value', 'unit', 'lastValueTick'],
            rows: [data.name, data.value, data.unit, data.lastValueTick]
          }
        }
        else {
          return {
            cols: ['name', 'type', 'value', 'unit', 'defaultValue', 'factor', 'sampleTime', 'overflow', 'calculationInterval', 'lastValueTick'],
            rows: [data.name, data.type, data.value, data.unit, data.defaultValue, data.factor, data.sampleTime, data.overflow, data.calculationInterval, data.lastValueTick]
          }
        }
      case 'FactorCalculator':
        if (tableView === 'simple') {
          return {
            cols: ['name', 'value', 'unit', 'lastValueTick'],
            rows: [data.name, data.value, data.unit, data.lastValueTick]
          }
        }
        return {
          cols: ['name', 'type', 'value', 'unit', 'defaultValue', 'factor', 'sampleTime', 'lastValueTick'],
          rows: [data.name, data.type, data.value, data.unit, data.defaultValue, data.factor, data.sampleTime, data.lastValueTick]
        }
      case 'SumCalculator':
        if (tableView === 'simple') {
          return {
            cols: ['name', 'value', 'unit', 'lastValueTick'],
            rows: [data.name, data.value, data.unit, data.lastValueTick]
          }
        }
        else {
          return {
            cols: ['name', 'type', 'value', 'unit', 'defaultValue', 'sampleTime', 'lastValueTick'],
            rows: [data.name, data.type, data.value, data.unit, data.defaultValue, data.sampleTime, data.lastValueTick]
          }
        }
      case 'ValueFromByteArrayCalculator':
        if (tableView === 'simple') {
          return {
            cols: ['name', 'value', 'unit', 'lastValueTick'],
            rows: [data.name, data.value, data.unit, data.lastValueTick]
          }
        }
        else {
          return {
            cols: ['name', 'type', 'value', 'unit', 'defaultValue', 'bitNumber', 'byteNumber', 'length', 'sampleTime', 'lastValueTick'],
            rows: [data.name, data.type, data.value, data.unit, data.defaultValue, data.bitNumber, data.byteNumber, data.length, data.sampleTime, data.lastValueTick]
          }
        }
      case 'ExpressionCalculator':
        if (tableView === 'simple') {
          return {
            cols: ['name', 'value', 'unit', 'lastValueTick'],
            rows: [data.name, data.value, data.unit, data.lastValueTick]
          }
        }
        else {
          return {
            cols: ['name', 'type', 'value', 'unit', 'defaultValue', 'expression', 'parameters', 'sampleTime', 'lastValueTick'],
            rows: [data.name, data.type, data.value, data.unit, data.defaultValue, data.expression, data.parameters, data.sampleTime, data.lastValueTick]
          }
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
        if (tableView === 'simple') {
          return {
            cols: ['name', 'value', 'unit', 'lastValueTick'],
            rows: [data.name, data.value, data.unit, data.lastValueTick]
          }
        }
        else {
          return {
            cols: ['name', 'type', 'value', 'unit', 'defaultValue', 'length', 'offset', 'read', 'write', 'readAsSingle', 'writeAsSingle', 'readFCode', 'writeFCode', 'sampleTime', 'lastValueTick'],
            rows: [data.name, data.type, data.value, data.unit, data.defaultValue, data.length, data.offset, data.read, data.write, data.readAsSingle, data.writeAsSingle, data.readFCode, data.writeFCode, data.sampleTime, data.lastValueTick]
          }
        }

      case 'LastCycleDurationVariable':
      case 'CPULoadVariable':
      case 'CPUTemperatureVariable':
      case 'DiskUsageVariable':
      case 'RAMUsageVariable':
        if (tableView === 'simple') {
          return {
            cols: ['name', 'value', 'unit', 'lastValueTick'],
            rows: [data.name, data.value, data.unit, data.lastValueTick]
          }
        }
        else {
          return {
            cols: ['name', 'type', 'value', 'unit', 'defaultValue', 'sampleTime', 'lastValueTick'],
            rows: [data.name, data.type, data.value, data.unit, data.defaultValue, data.sampleTime, data.lastValueTick]
          }
        }

      case 'AssociatedVariable':
        if (tableView === 'simple') {
          return {
            cols: ['name', 'value', 'unit', 'lastValueTick'],
            rows: [data.name, data.value, data.unit, data.lastValueTick]
          }
        }
        else {
          return {
            cols: ['name', 'type', 'value', 'unit', 'defaultValue', 'sampleTime', 'associatedDeviceID', 'associatedElementID','lastValueTick'],
            rows: [data.name, data.type, data.value, data.unit, data.defaultValue, data.sampleTime, data.associatedDeviceID, data.associatedElementID, data.lastValueTick]
          }
        }

      case 'S7Int':
      case 'S7DInt':
      case 'S7SInt':
      case 'S7UInt':
      case 'S7UDInt':
      case 'S7USInt':
      case 'S7Real':
      case 'S7DTL':
      case 'S7ByteArray':
        if (tableView === 'simple') {
          return {
            cols: ['name', 'value', 'unit', 'lastValueTick'],
            rows: [data.name, data.value, data.unit, data.lastValueTick]
          }
        }
        else {
          return {
            cols: ['name', 'type', 'value', 'unit', 'defaultValue', 'dbNumber', 'length', 'memoryType', 'offset', 'read', 'readAsSingle', 'sampleTime', 'write', 'writeAsSingle', 'lastValueTick'],
            rows: [data.name, data.type, data.value, data.unit, data.defaultValue, data.dbNumber, data.length, data.memoryType, data.offset, data.read, data.readAsSingle, data.sampleTime, data.write, data.writeAsSingle, data.lastValueTick]
          }
        }

      case 'DeviceConnectionVariable':
        if (tableView === 'simple') {
          return {
            cols: ['name', 'value', 'unit', 'lastValueTick'],
            rows: [data.name, data.value, data.unit, data.lastValueTick]
          }
        }
        else {
          return {
            cols: ['name', 'type', 'value', 'unit', 'defaultValue', 'sampleTime', 'lastValueTick'],
            rows: [data.name, data.type, data.value, data.unit, data.defaultValue, data.sampleTime, data.lastValueTick]
          }
        }

      //alerts
      case 'HighLimitAlert':
        if (tableView === 'simple') {
          return {
            cols: ['name', 'value', 'unit', 'lastValueTick', 'lastValueTick'],
            rows: [data.name, data.value, data.unit, data.lastValueTick, data.lastValueTick]
          }
        }
        else {
          return {
            cols: ['name', 'type', 'value', 'unit', 'defaultValue', 'highLimit', 'hysteresis', 'severity', 'sampleTime', 'texts', 'timeOffDelay', 'timeOnDelay', 'lastValueTick'],
            rows: [data.name, data.type, data.value, data.unit, data.defaultValue, data.highLimit, data.hysteresis, data.severity, data.sampleTime, data.texts, data.timeOffDelay, data.timeOnDelay, data.lastValueTick]
          }
        }
      case 'BandwidthLimitAlert':
        if (tableView === 'simple') {
          return {
            cols: ['name', 'value', 'unit', 'lastValueTick', 'lastValueTick'],
            rows: [data.name, data.value, data.unit, data.lastValueTick]
          }
        }
        else {
          return {
            cols: ['name', 'type', 'value', 'unit', 'defaultValue', 'highLimit', 'lowLimit', 'hysteresis', 'severity', 'sampleTime', 'texts', 'timeOffDelay', 'timeOnDelay', 'lastValueTick'],
            rows: [data.name, data.type, data.value, data.unit, data.defaultValue, data.highLimit, data.lowLimit, data.hysteresis, data.severity, data.sampleTime, data.texts, data.timeOffDelay, data.timeOnDelay, data.lastValueTick]
          }
        }
      case 'LowLimitAlert':
        if (tableView === 'simple') {
          return {
            cols: ['name', 'value', 'unit', 'lastValueTick', 'lastValueTick'],
            rows: [data.name, data.value, data.unit, data.lastValueTick]
          }
        }
        else {
          return {
            cols: ['name', 'type', 'value', 'unit', 'defaultValue', 'lowLimit', 'hysteresis', 'severity', 'sampleTime', 'texts', 'timeOffDelay', 'timeOnDelay', 'lastValueTick'],
            rows: [data.name, data.type, data.value, data.unit, data.defaultValue, data.lowLimit, data.hysteresis, data.severity, data.sampleTime, data.texts, data.timeOffDelay, data.timeOnDelay, data.lastValueTick]
          }
        }
      case 'ExactValuesAlert':
        if (tableView === 'simple') {
          return {
            cols: ['name', 'value', 'unit', 'lastValueTick', 'lastValueTick'],
            rows: [data.name, data.value, data.unit, data.lastValueTick]
          }
        }
        else {
          return {
            cols: ['name', 'type', 'value', 'unit', 'defaultValue', 'severity', 'sampleTime', 'texts', 'timeOffDelay', 'timeOnDelay', 'lastValueTick'],
            rows: [data.name, data.type, data.value, data.unit, data.defaultValue, data.severity, data.sampleTime, data.texts, data.timeOffDelay, data.timeOnDelay, data.lastValueTick]
          }
        }
      //custom made - without 'type' property - eventsToSendConfig, dataToSendConfig
      case 'eventsToSendConfig':
        if (tableView === 'simple') {
          return {
            cols: ['entityId', 'sourceType', 'severity'],
            rows: [data.entityId, data.sourceType, data.severity]
          }
        }
        else {
          return {
            cols: ['entityId', 'sourceId', 'source', 'sourceType', 'severity', 'sendingInterval'],
            rows: [data.entityId, data.sourceId, data.source, data.sourceType, data.severity, data.sendingInterval]
          }
        }

      case 'dataToSendConfig':
        if (tableView === 'simple') {
          return {
            cols: ['datapointId', 'dataConverter'],
            rows: [data.datapointId, data.dataConverter]
          }
        }
        else {
          return {
            cols: ['datapointId', 'dataConverter', 'qualityCodeEnabled', 'sendingInterval'],
            rows: [data.datapointId, data.dataConverter, data.qualityCodeEnabled, data.sendingInterval]
          }
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
            content: firstLevelTables.map((table, i) => (<React.Fragment key={i}><Typography variant="h6" className={classes.marginTopTable}>{t(`DevicesSelectionPage.Properties.${table.type}`)}</Typography><CollapsibleTable columns={table.cols} rows={table.rows} /></React.Fragment>))
          })

          const propertiesEntries = Object.entries(properties)
          //other tabs, traversing through object
          for (let [column, cell] of propertiesEntries) {
            if (typeof cell === 'object') {
              const traverse = traverseObject(cell, column)
              const converted = converter(traverse)
              const secondLevelTables = traverseObject(converted)
              tabs.push({
                label: t(`DevicesSelectionPage.Tabs.${column}`),
                content: secondLevelTables.map((table, i) => (<React.Fragment key={i}><Typography variant="h6" className={classes.marginTopTable}>{t(`DevicesSelectionPage.Properties.${table.type}`)}</Typography><CollapsibleTable columns={table.cols} rows={table.rows} /></React.Fragment>))
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
          <Zoom in={true} style={{ transitionDelay: '500ms' }}>
            <Tooltip title={t('DevicesSelectionPage.RefreshAllDevices')} placement="bottom">
              <IconButton aria-label="refresh" className={classes.alignTop} onClick={() => fetchDevices()} >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Zoom>
          <DevicesList />
        </Grid>
        {allDevices.length > 0 ?
          <Grid container item xs={12} sm={12} md={9} xl={10} spacing={0}>
            <Grid item xs={12} >
              <Typography variant="h4" className={classes.devicesTitleInline}>{selectedDevice.selectedDeviceID}</Typography>
              <Zoom in={true} style={{ transitionDelay: '1000ms' }}>
                <Tooltip title={t('DevicesSelectionPage.ToggleTableView')} placement="bottom">
                  <IconButton aria-label="toggle-advanced-view" className={classes.advancedViewTables} onClick={toggleTableView} >
                    <ShortTextIcon />
                  </IconButton>
                </Tooltip>
              </Zoom>
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
          : <Typography variant="h4" className={classes.devicesTitleInline}>{t('DevicesSelectionPage.NoDevicesHeader')}</Typography>}
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
  toggleTableView
}

export default connect(mapStateToProps, mapDispatchToProps)(DevicesSelectionPage)