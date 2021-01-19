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

function InternalDeviceDisplay({ selectedDevice, allDevices, tableView }) {
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
          [t(`DevicesSelectionPage.Properties.isActive`), `${device.isActive}`]
        ]
      }
    }
    else {
      return {
        columns: [t('DevicesSelectionPage.Properties.genericParameterTableHeader'), t('DevicesSelectionPage.Properties.genericValueTableHeader')],
        rows: [
          [t(`DevicesSelectionPage.Properties.name`), `${device.name}`],
          [t(`DevicesSelectionPage.Properties.type`), `${device.type}`],
          [t(`DevicesSelectionPage.Properties.isActive`), `${device.isActive}`]
        ]
      }
    }
  }
  //AssociatedVariable variables table inside VARIABLES TAB
  const renderAssociatedVariablesTable = (variables) => {
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
      t('DevicesSelectionPage.Properties.sampleTime'),
      t('DevicesSelectionPage.Properties.associatedDeviceIDName'),
      t('DevicesSelectionPage.Properties.associatedElementIDName'),
      t('DevicesSelectionPage.Properties.lastValueTick'),
      ]
    }
    variables.forEach(variable => {
      //associate associatedDeviceID with corresponding device name and associatedElementID with its property name
      variable = {
        ...variable,
        associatedDeviceIDName: allDevices[variable.associatedDeviceID] !== undefined ? allDevices[variable.associatedDeviceID].name : '',
        associatedElementIDName: allDevices[variable.associatedDeviceID] !== undefined && allDevices[variable.associatedDeviceID].variables[variable.associatedElementID] !== undefined ? allDevices[variable.associatedDeviceID].variables[variable.associatedElementID].name : ''
      }
      if (tableView === 'simple') {
        rows.push([variable.name, variable.value, variable.unit, variable.lastValueTick])
      }
      else {
        rows.push([variable.name, variable.type, variable.value, variable.unit, variable.defaultValue, variable.sampleTime, variable.associatedDeviceIDName, variable.associatedElementIDName, variable.lastValueTick])
      }
    })

    return <UniversalTable columns={cols} rows={rows} className={classes.bottomMargin} />
  }

  const renderHardwareUsageVariablesTable = (variables) => {
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
      t('DevicesSelectionPage.Properties.sampleTime'),
      t('DevicesSelectionPage.Properties.lastValueTick'),
      ]
    }
    variables.forEach(variable => {
      //override toFixed(3) to toFixed(2) for HW usage
      variable = {
        ...variable,
        value: parseFloat(variable.value).toFixed(2),
      }

      if (tableView === 'simple') {
        rows.push([variable.name, variable.value, variable.unit, variable.lastValueTick])
      }
      else {
        rows.push([variable.name, variable.type, variable.value, variable.unit, variable.defaultValue, variable.sampleTime, variable.lastValueTick])
      }
    })

    return <UniversalTable columns={cols} rows={rows} className={classes.bottomMargin} />
  }
  /////////////////////////////////////////////////////////////////////

  //rendering whole VARIABLES TAB
  const renderVariablesTabContent = () => {
    //group AssociatedVariable variables in one table and rest in other table 
    //lastValueTick in order to avoid further processing duplicates in separate functions
    const variables = Object.values(device.variables).map(variable => {
      return {
        ...variable,
        value: !isNaN(variable.value) ? parseFloat(variable.value).toFixed(3) : `${variable.value}`,
        lastValueTick: variable.lastValueTick === 0 ? '' : formatDateTime(new Date(parseFloat(variable.lastValueTick) * 1000))
      }
    })

    const associatedVariables = variables.filter(variable => variable.type === 'AssociatedVariable')
    const hardwareUsageVariables = variables.filter(variable => variable.type !== 'AssociatedVariable')

    return (
      <React.Fragment>
        {associatedVariables.length > 0 ?
          <React.Fragment>
            <Typography variant="h6" className={classes.topMargin}>{t('DevicesSelectionPage.Properties.AssociatedVariable')}</Typography>
            {renderAssociatedVariablesTable(associatedVariables)}
          </React.Fragment>
          : null}
        {hardwareUsageVariables.length > 0 ?
          <React.Fragment>
            <Typography variant="h6" className={classes.topMargin}>{t('DevicesSelectionPage.Properties.hardwareUsage')}</Typography>
            {renderHardwareUsageVariablesTable(hardwareUsageVariables)}
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
        <Grid container item xs={12} spacing={1} className={classes.controlButtons}>
          <StandardBottomToolbar />
        </Grid>
        <Grid item xs={12}>
          <UniversalTabs
            name="InternalDevice"
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

export default connect(mapStateToProps)(InternalDeviceDisplay)