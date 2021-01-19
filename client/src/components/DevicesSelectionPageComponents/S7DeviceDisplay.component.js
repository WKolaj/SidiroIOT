import React from 'react';
import UniversalTabs from '../UniversalTabs.component';
import { UniversalTable } from '../UniversalTable.component';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import DeviceDetailsTitle from './DeviceDetailsTitle.component';
import Typography from '@material-ui/core/Typography';
import { formatDateTime } from '../../utilities/formatDateTime.utility';
import { sortRowsBy } from '../../utilities/sortRows.utility';
import DeviceConnectionVariableTable from './DeviceConnectionVariableTable.component';
import EdgeComputingTabContent from './EdgeComputingTabContent.component';
import AlertsTabContent from './AlertsTabContent.component';
import StandardBottomToolbar from './StandardBottomToolbar.component';

const useStyles = makeStyles((theme) => ({
  topMargin: {
    marginTop: theme.spacing(2)
  },
  controlButtons: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2)
  }
}));

function S7DeviceDisplay({ selectedDevice, allDevices, tableView }) {
  const { t } = useTranslation();
  const classes = useStyles();

  const device = allDevices[selectedDevice.selectedDeviceID]

  //table columns ordering functions //////////////////////////////////////
  //info tab is 1 table only so this renders whole INFO TAB
  const renderInfoTabContent = () => {
    if (tableView === 'simple') {
      return {
        columns: [t('DevicesSelectionPage.Properties.genericParameterTableHeader'), t('DevicesSelectionPage.Properties.genericValueTableHeader')],
        rows: [
          [t(`DevicesSelectionPage.Properties.name`), `${device.name}`],
          [t(`DevicesSelectionPage.Properties.isActive`), `${device.isActive}`],
          [t(`DevicesSelectionPage.Properties.isConnected`), `${device.isConnected}`]
        ]
      }
    }
    else {
      return {
        columns: [t('DevicesSelectionPage.Properties.genericParameterTableHeader'), t('DevicesSelectionPage.Properties.genericValueTableHeader')],
        rows: [
          [t(`DevicesSelectionPage.Properties.name`), `${device.name}`],
          [t(`DevicesSelectionPage.Properties.type`), `${device.type}`],
          [t(`DevicesSelectionPage.Properties.ipAddress`), `${device.ipAddress}`],
          [t(`DevicesSelectionPage.Properties.isActive`), `${device.isActive}`],
          [t(`DevicesSelectionPage.Properties.isConnected`), `${device.isConnected}`],
          [t(`DevicesSelectionPage.Properties.rack`), `${device.rack}`],
          [t(`DevicesSelectionPage.Properties.slot`), `${device.slot}`],
          [t(`DevicesSelectionPage.Properties.timeout`), `${device.timeout}`],
        ]
      }
    }
  }
  //S7 variables table inside VARIABLES TAB
  const renderS7VariablesTable = (variables) => {
    let rows = []
    let cols = []
    if (tableView === 'simple') {
      cols = [t('DevicesSelectionPage.Properties.name'), t('DevicesSelectionPage.Properties.value'), t('DevicesSelectionPage.Properties.unit'), t('DevicesSelectionPage.Properties.lastValueTick')]
    }
    else {
      cols = [t('DevicesSelectionPage.Properties.name'),
      t('DevicesSelectionPage.Properties.type'),
      t('DevicesSelectionPage.Properties.value'),
      t('DevicesSelectionPage.Properties.unit'),
      t('DevicesSelectionPage.Properties.defaultValue'),
      t('DevicesSelectionPage.Properties.dbNumber'),
      t('DevicesSelectionPage.Properties.offset'),
      t('DevicesSelectionPage.Properties.length'),
      t('DevicesSelectionPage.Properties.memoryType'),
      t('DevicesSelectionPage.Properties.read/write'),
      t('DevicesSelectionPage.Properties.group'),
      t('DevicesSelectionPage.Properties.sampleTime'),
      t('DevicesSelectionPage.Properties.lastValueTick'),
      ]
    }
    variables.forEach(variable => {
      //S7 variables' specific properties, needed to sort out here
      if (variable.read !== undefined && variable.write !== undefined && variable.readAsSingle !== undefined && variable.writeAsSingle !== undefined) {
        variable = {
          ...variable,
          value: S7VariablesConverter(variable),
          readWrite: variable.read ? 'Read' : 'Write',
          readWriteAsSingle: variable.read ? 'readAsSingle' : 'writeAsSingle'
        }
      }

      if (tableView === 'simple') {
        rows.push([variable.name, variable.value, variable.unit, variable.lastValueTick])
      }
      else {
        rows.push([variable.name, variable.type, variable.value, variable.unit, variable.defaultValue, variable.dbNumber, variable.offset, variable.length, variable.memoryType, variable.readWrite, `${!variable[variable.readWriteAsSingle]}`, variable.sampleTime, variable.lastValueTick])
      }
    })
    const sortedRows = sortRowsBy(rows, cols, t('DevicesSelectionPage.Properties.name'), 'S7', t('DevicesSelectionPage.Properties.unitID'), t('DevicesSelectionPage.Properties.function'), t('DevicesSelectionPage.Properties.offset'))

    return <UniversalTable columns={cols} rows={sortedRows} />
  }

  /////////////////////////////////////////////////////////////////////

  const S7VariablesConverter = (variable) => {
    switch(variable.type) {
      case 'S7ByteArray':
        return `[${variable.value}]`
      case 'S7DTL':
        return formatDateTime(new Date(parseFloat(variable.value)))
      case 'S7Real':
        return parseFloat(variable.value).toFixed(3)
      default:
        //Integers
        return variable.value
    }
  }

  //rendering whole VARIABLES TAB
  const renderVariablesTabContent = () => {
    //group S7 variables in one table and DeviceConnectionVariable in other table 
    //toString booleans, lastValueTick to date, arrays to string, in order to avoid further processing duplicates in separate functions
    const variables = Object.values(device.variables).map(variable => {
      return {
        ...variable,
        defaultValue: variable.type === 'S7ByteArray' ? `[${variable.defaultValue}]` : `${variable.defaultValue}`,
        lastValueTick: variable.lastValueTick === 0 ? '' : formatDateTime(new Date(parseFloat(variable.lastValueTick) * 1000))
      }
    })

    const s7Variables = variables.filter(variable => variable.type !== 'DeviceConnectionVariable')
    const deviceConnectionVariables = variables.filter(variable => variable.type === 'DeviceConnectionVariable')

    return (
      <React.Fragment>
        {deviceConnectionVariables.length > 0 ?
          <React.Fragment>
            <Typography variant="h6" className={classes.topMargin}>{t('DevicesSelectionPage.Properties.DeviceConnectionVariable')}</Typography>
            <DeviceConnectionVariableTable deviceConnectionVariablesArray={deviceConnectionVariables} />
          </React.Fragment>
          : null}
        {s7Variables.length > 0 ?
          <React.Fragment>
            <Typography variant="h6" className={classes.topMargin}>{t('DevicesSelectionPage.Properties.S7VariablesGroup')}</Typography>
            {renderS7VariablesTable(s7Variables)}
          </React.Fragment>
          : null}
      </React.Fragment>
    )
  }

  //Main render function
  return (
    <React.Fragment>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <DeviceDetailsTitle />
        </Grid>
        <Grid container item xs={12} spacing={1} className={classes.controlButtons}>
          <StandardBottomToolbar />
        </Grid>
        <Grid item xs={12}>
          <UniversalTabs
            name="S7Device"
            tabs={[
              {
                label: t('DevicesSelectionPage.Tabs.info'),
                content: <UniversalTable {...renderInfoTabContent()} />
              },
              {
                label: t('DevicesSelectionPage.Tabs.variables'),
                content: renderVariablesTabContent()
              },
              {
                label: t('DevicesSelectionPage.Tabs.calcElements'),
                content: <EdgeComputingTabContent calcElementsObject={device.calcElements} />
              },
              {
                label: t('DevicesSelectionPage.Tabs.alerts'),
                content: <AlertsTabContent alertElementsObject={device.alerts} />
              }
            ]} />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    selectedDevice: state.DevicesListReducer,
    allDevices: state.DevicesSelectionPageReducer.devices,
    tableView: state.DevicesSelectionPageReducer.tableView
  }
}

export default connect(mapStateToProps)(S7DeviceDisplay)