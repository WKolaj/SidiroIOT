import React from 'react';
import UniversalTabs from '../UniversalTabs.component';
import { UniversalTable } from '../UniversalTable.component';
import {CollapsibleTable} from '../CollapsibleTable.component';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { formatDateTime } from '../../utilities/formatDateTime.utility';
import DeviceDetailsTitle from './DeviceDetailsTitle.component';
import EdgeComputingTabContent from './EdgeComputingTabContent.component';
import AlertsTabContent from './AlertsTabContent.component';
import MSAgentBottomToolbar from './MSAgentBottomToolbar.component';

const useStyles = makeStyles((theme) => ({
  topMargin: {
    marginTop: theme.spacing(2)
  },
  controlButtons: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2)
  }
}));

function MSAgentDeviceDisplay({ selectedDevice, allDevices, tableView }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const device = allDevices[selectedDevice.selectedDeviceID]

  //this tab is 1 table only so this renders whole INFO TAB
  const renderInfoTabContent = () => {
    if (tableView === 'simple') {
      return {
        columns: [t('DevicesSelectionPage.Properties.genericParameterTableHeader'), t('DevicesSelectionPage.Properties.genericValueTableHeader')],
        rows: [
          [t(`DevicesSelectionPage.Properties.name`), `${device.name}`],
          [t(`DevicesSelectionPage.Properties.boarded`), `${device.boarded}`],
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
          [t(`DevicesSelectionPage.Properties.boarded`), `${device.boarded}`],
          [t(`DevicesSelectionPage.Properties.isActive`), `${device.isActive}`],
          [t(`DevicesSelectionPage.Properties.dataStorageSize`), `${device.dataStorageSize}`],
          [t(`DevicesSelectionPage.Properties.eventStorageSize`), `${device.eventStorageSize}`],
          [t(`DevicesSelectionPage.Properties.numberOfDataFilesToSend`), `${device.numberOfDataFilesToSend}`],
          [t(`DevicesSelectionPage.Properties.numberOfEventFilesToSend`), `${device.numberOfEventFilesToSend}`],
          [t(`DevicesSelectionPage.Properties.numberOfSendDataRetries`), `${device.numberOfSendDataRetries}`],
          [t(`DevicesSelectionPage.Properties.numberOfSendEventRetries`), `${device.numberOfSendEventRetries}`],
          [t(`DevicesSelectionPage.Properties.sendDataFileInterval`), `${device.sendDataFileInterval}`],
          [t(`DevicesSelectionPage.Properties.sendEventFileInterval`), `${device.sendEventFileInterval}`]
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

  //rendering whole VARIABLES TAB
  const renderVariablesTabContent = () => {
    //group AssociatedVariable variables in one table and rest in other table 
    //lastValueTick in order to avoid further processing duplicates in separate functions
    const variables = Object.values(device.variables).map(variable => {
      return {
        ...variable,
        value: !isNaN(variable.value)? parseFloat(variable.value).toFixed(3) : `${variable.value}`,
        lastValueTick: variable.lastValueTick === 0 ? '' : formatDateTime(new Date(parseFloat(variable.lastValueTick) * 1000))
      }
    })

    const associatedVariables = variables.filter(variable => variable.type === 'AssociatedVariable')

    return (
      <React.Fragment>
        {associatedVariables.length > 0 ?
          <React.Fragment>
            <Typography variant="h6" className={classes.topMargin}>{t('DevicesSelectionPage.Properties.AssociatedVariable')}</Typography>
            {renderAssociatedVariablesTable(associatedVariables)}
          </React.Fragment>
          : null}
      </React.Fragment>
    )
  }

  //render DATA SENT TAB CONTENT
  //this tab is 1 table only so this renders whole DATA SENT TAB
  const renderDataSentTabContent = () => {
    let rows = []
    let cols = []
    let collapsedRows = []
    let collapsedCols = []
    let rowToBeCollapsed = []

    if (tableView === 'simple') {
      cols = [t('DevicesSelectionPage.Properties.deviceName'), t('DevicesSelectionPage.Properties.elementName'), t('DevicesSelectionPage.Properties.sendingInterval')]
    }
    else {
      //push collapsed cols
      collapsedCols = [t('DevicesSelectionPage.Properties.conversionType'), t('DevicesSelectionPage.Properties.precision')]

      cols = [t('DevicesSelectionPage.Properties.deviceName'),
      t('DevicesSelectionPage.Properties.elementName'),
      t('DevicesSelectionPage.Properties.qualityCodeEnabled'),
      t('DevicesSelectionPage.Properties.sendingInterval'),
      t('DevicesSelectionPage.Properties.datapointId')
      ]
    }
    Object.values(device.dataToSendConfig).forEach((dataConfig, i) => {
      collapsedRows = []
      //associate deviceId with corresponding device name and elementId with its variable's name
      dataConfig = {
        ...dataConfig,
        qualityCodeEnabled: `${dataConfig.qualityCodeEnabled}`,
        associatedDeviceIDName: allDevices[dataConfig.deviceId] !== undefined ? allDevices[dataConfig.deviceId].name : '',
        associatedElementIDName: allDevices[dataConfig.deviceId] !== undefined && allDevices[dataConfig.deviceId].variables[dataConfig.elementId] !== undefined ? allDevices[dataConfig.deviceId].variables[dataConfig.elementId].name : ''
      }
      if (tableView === 'simple') {
        rows.push([dataConfig.associatedDeviceIDName, dataConfig.associatedElementIDName, dataConfig.sendingInterval])
      }
      else {
        //push Texts property contents into collapsed table
        collapsedRows.push([dataConfig.dataConverter.conversionType, dataConfig.dataConverter.precision])
        rowToBeCollapsed.push({ rowIndex: i, content: <UniversalTable small noElevation columns={collapsedCols} rows={collapsedRows} /> })

        rows.push([dataConfig.associatedDeviceIDName, dataConfig.associatedElementIDName, dataConfig.qualityCodeEnabled, dataConfig.sendingInterval, dataConfig.datapointId])
      }
    })

    return tableView === 'simple' ? <UniversalTable columns={cols} rows={rows} /> :
      <CollapsibleTable
        columns={cols}
        rows={rows}
        collapsedRows={rowToBeCollapsed}
        name='MSAgentDataSent'
      />
  }

  //render EVENTS SENT TAB CONTENT
  //this tab is 1 table only so this renders whole EVENTS SENT TAB
  const renderEventsSentTabContent = () => {
    let rows = []
    let cols = []

    if (tableView === 'simple') {
      cols = [t('DevicesSelectionPage.Properties.deviceName'), t('DevicesSelectionPage.Properties.elementName'), t('DevicesSelectionPage.Properties.sendingInterval')]
    }
    else {
      cols = [t('DevicesSelectionPage.Properties.deviceName'),
      t('DevicesSelectionPage.Properties.elementName'),
      t('DevicesSelectionPage.Properties.sendingInterval'),
      t('DevicesSelectionPage.Properties.source'),
      t('DevicesSelectionPage.Properties.severity'),
      t('DevicesSelectionPage.Properties.entityId'),
      t('DevicesSelectionPage.Properties.correlationId'),
      t('DevicesSelectionPage.Properties.code'),
      t('DevicesSelectionPage.Properties.acknowledged')
      ]
    }
    Object.values(device.eventsToSendConfig).forEach((eventConfig, i) => {
      //associate deviceId with corresponding device name and elementId with its variable's name
      eventConfig = {
        ...eventConfig,
        associatedDeviceIDName: allDevices[eventConfig.deviceId] !== undefined ? allDevices[eventConfig.deviceId].name : '',
        associatedElementIDName: allDevices[eventConfig.deviceId] !== undefined && allDevices[eventConfig.deviceId].alerts[eventConfig.elementId] !== undefined ? allDevices[eventConfig.deviceId].alerts[eventConfig.elementId].name : '',
        //make sure the following exist, if not set them empty string
        source: eventConfig.source !==undefined ? eventConfig.source : '',
        code: eventConfig.code !==undefined ? eventConfig.code : '',
        acknowledged: eventConfig.acknowledged !== undefined ? `${eventConfig.acknowledged}` : '',
        correlationId: eventConfig.correlationId !== undefined ? eventConfig.correlationId : ''

      }
      if (tableView === 'simple') {
        rows.push([eventConfig.associatedDeviceIDName, eventConfig.associatedElementIDName, eventConfig.sendingInterval])
      }
      else {
        rows.push([eventConfig.associatedDeviceIDName, eventConfig.associatedElementIDName, eventConfig.sendingInterval, eventConfig.source, eventConfig.severity, eventConfig.entityId, eventConfig.correlationId, eventConfig.code, eventConfig.acknowledged])
      }
    })

    return <UniversalTable columns={cols} rows={rows} />
  }

  return (
    <React.Fragment>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <DeviceDetailsTitle />
        </Grid>
        <Grid container item xs={12} spacing={1} className={classes.controlButtons}>
          <MSAgentBottomToolbar />
        </Grid>
        <Grid item xs={12}>
          <UniversalTabs
            name="MSAgentDevice"
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
              },
              {
                label: t('DevicesSelectionPage.Tabs.dataToSendConfig'),
                content: renderDataSentTabContent()
              },
              {
                label: t('DevicesSelectionPage.Tabs.eventsToSendConfig'),
                content: renderEventsSentTabContent()
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

export default connect(mapStateToProps)(MSAgentDeviceDisplay)