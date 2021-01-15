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
    [`${theme.breakpoints.down('sm')} and (orientation: portrait)`]: {
      marginBottom: theme.spacing(8)
    },
  }
}));

function MBDeviceDisplay({ selectedDevice, allDevices, tableView }) {
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
          [t(`DevicesSelectionPage.Properties.portNumber`), `${device.portNumber}`],
          [t(`DevicesSelectionPage.Properties.isActive`), `${device.isActive}`],
          [t(`DevicesSelectionPage.Properties.isConnected`), `${device.isConnected}`],
          [t(`DevicesSelectionPage.Properties.timeout`), `${device.timeout}`],
        ]
      }
    }
  }
  //modbus variables table inside VARIABLES TAB
  const renderModbusVariablesTable = (variables) => {
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
      t('DevicesSelectionPage.Properties.length'),
      t('DevicesSelectionPage.Properties.offset'),
      t('DevicesSelectionPage.Properties.read/write'),
      t('DevicesSelectionPage.Properties.group'),
      t('DevicesSelectionPage.Properties.function'),
      t('DevicesSelectionPage.Properties.sampleTime'),
      t('DevicesSelectionPage.Properties.unitID'),
      t('DevicesSelectionPage.Properties.lastValueTick'),
      ]
    }
    variables.forEach(variable => {
      //modbus variables' specific properties, needed to sort out here
      if (variable.read !== undefined && variable.write !== undefined && variable.readAsSingle !== undefined && variable.writeAsSingle !== undefined) {
        variable = {
          ...variable,
          readWrite: variable.read ? 'Read' : 'Write',
          readWriteAsSingle: variable.read ? 'readAsSingle' : 'writeAsSingle',
          readWriteFCode: variable.read ? 'readFCode' : 'writeFCode'
        }
      }

      if (tableView === 'simple') {
        rows.push([variable.name, variable.value, variable.unit, variable.lastValueTick])
      }
      else {
        rows.push([variable.name, variable.type, variable.value, variable.unit, variable.defaultValue, variable.length, variable.offset, variable.readWrite, `${!variable[variable.readWriteAsSingle]}`, variable[variable.readWriteFCode], variable.sampleTime, variable.unitID, variable.lastValueTick])
      }
    })
    const sortedRows = sortRowsBy(rows, cols, t('DevicesSelectionPage.Properties.name'), 'MB', t('DevicesSelectionPage.Properties.unitID'), t('DevicesSelectionPage.Properties.function'), t('DevicesSelectionPage.Properties.offset'))

    return <UniversalTable columns={cols} rows={sortedRows} className={classes.bottomMargin} />
  }

  /////////////////////////////////////////////////////////////////////

  //rendering whole VARIABLES TAB
  const renderVariablesTabContent = () => {
    //group modbus variables in one table and DeviceConnectionVariable in other table 
    //toString booleans, lastValueTick to date, arrays to string, in order to avoid further processing duplicates in separate functions
    const variables = Object.values(device.variables).map(variable => {
      return {
        ...variable,
        value: variable.type === 'MBByteArray' ? `[${variable.value}]` : `${variable.value}`,
        defaultValue: variable.type === 'MBByteArray' ? `[${variable.defaultValue}]` : `${variable.defaultValue}`,
        lastValueTick: variable.lastValueTick === 0 ? '' : formatDateTime(new Date(parseFloat(variable.lastValueTick) * 1000))
      }
    })

    const modbusVariables = variables.filter(variable => variable.type !== 'DeviceConnectionVariable')
    const deviceConnectionVariables = variables.filter(variable => variable.type === 'DeviceConnectionVariable')

    return (
      <React.Fragment>
        {deviceConnectionVariables.length > 0 ?
          <React.Fragment>
            <Typography variant="h6" className={classes.topMargin}>{t('DevicesSelectionPage.Properties.DeviceConnectionVariable')}</Typography>
            <DeviceConnectionVariableTable deviceConnectionVariablesArray={deviceConnectionVariables} />
          </React.Fragment>
          : null}
        {modbusVariables.length > 0 ?
          <React.Fragment>
            <Typography variant="h6" className={classes.topMargin}>{t('DevicesSelectionPage.Properties.MBVariablesGroup')}</Typography>
            {renderModbusVariablesTable(modbusVariables)}
          </React.Fragment>
          : null}
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <DeviceDetailsTitle />
        </Grid>
        <Grid item xs={12}>
          <UniversalTabs
            name="MBDevice"
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
            ]}
          />
        </Grid>
        <Grid container item xs={12} spacing={1} className={classes.controlButtons}>
          <StandardBottomToolbar />
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

export default connect(mapStateToProps)(MBDeviceDisplay)