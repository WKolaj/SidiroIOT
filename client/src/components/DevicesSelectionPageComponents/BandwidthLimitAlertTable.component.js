import React from 'react';
import { UniversalTable } from '../UniversalTable.component';
import {CollapsibleTable} from '../CollapsibleTable.component';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

export function BandwidthLimitAlertTable({ bandwidthLimitAlertArray, tableView }) {
  const { t } = useTranslation();

  let rows = []
  let cols = []
  let collapsedRows = []
  let collapsedCols = []
  let rowToBeCollapsed = []

  if (tableView === 'simple') {
    cols = [t('DevicesSelectionPage.Properties.name'), t('DevicesSelectionPage.Properties.value'), t('DevicesSelectionPage.Properties.unit'), t('DevicesSelectionPage.Properties.lastValueTick')]
  }
  else {
    //push collapsed cols
    collapsedCols = [t('DevicesSelectionPage.Properties.limitType'), t('DevicesSelectionPage.Properties.textPL'), t('DevicesSelectionPage.Properties.textEN')]

    cols = [t('DevicesSelectionPage.Properties.name'),
    t('DevicesSelectionPage.Properties.type'),
    t('DevicesSelectionPage.Properties.value'),
    t('DevicesSelectionPage.Properties.unit'),
    t('DevicesSelectionPage.Properties.defaultValue'),
    t('DevicesSelectionPage.Properties.highLimit'),
    t('DevicesSelectionPage.Properties.lowLimit'),
    t('DevicesSelectionPage.Properties.hysteresis'),
    t('DevicesSelectionPage.Properties.severity'),
    t('DevicesSelectionPage.Properties.sampleTime'),
    t('DevicesSelectionPage.Properties.timeOffDelay'),
    t('DevicesSelectionPage.Properties.timeOnDelay'),
    t('DevicesSelectionPage.Properties.variableName'),
    t('DevicesSelectionPage.Properties.lastValueTick')]
  }
  bandwidthLimitAlertArray.forEach((bandwidthLimitAlertElement, i) => {
    collapsedRows = []
    if (tableView === 'simple') {
      rows.push([bandwidthLimitAlertElement.name, bandwidthLimitAlertElement.value, bandwidthLimitAlertElement.unit, bandwidthLimitAlertElement.lastValueTick])
    }
    else {
      //push highLimit and lowLimimt properties into collapsed table
      collapsedRows.push([t('DevicesSelectionPage.Properties.highLimit'), bandwidthLimitAlertElement.texts.highLimit.pl, bandwidthLimitAlertElement.texts.highLimit.en])
      collapsedRows.push([t('DevicesSelectionPage.Properties.lowLimit'), bandwidthLimitAlertElement.texts.lowLimit.pl, bandwidthLimitAlertElement.texts.lowLimit.en])

      rowToBeCollapsed.push({ rowIndex: i, content: <UniversalTable small noElevation columns={collapsedCols} rows={collapsedRows} /> })
      rows.push([bandwidthLimitAlertElement.name, 
        bandwidthLimitAlertElement.type, 
        bandwidthLimitAlertElement.value, 
        bandwidthLimitAlertElement.unit, 
        bandwidthLimitAlertElement.defaultValue, 
        bandwidthLimitAlertElement.highLimit, 
        bandwidthLimitAlertElement.lowLimit,
        bandwidthLimitAlertElement.hysteresis, 
        bandwidthLimitAlertElement.severity,
        bandwidthLimitAlertElement.sampleTime,
        bandwidthLimitAlertElement.timeOffDelay,
        bandwidthLimitAlertElement.timeOnDelay,
        bandwidthLimitAlertElement.variableName,
        bandwidthLimitAlertElement.lastValueTick])
    }
  })
  return tableView === 'simple' ? <UniversalTable columns={cols} rows={rows} /> :
    <CollapsibleTable
      columns={cols}
      rows={rows}
      collapsedRows={rowToBeCollapsed}
      name='BandwidthLimitAlertTable'
    />
}

const mapStateToProps = (state) => {
  return {
    selectedDevice: state.DevicesListReducer,
    allDevices: state.DevicesSelectionPageReducer.devices,
    tableView: state.DevicesSelectionPageReducer.tableView
  }
}

export default connect(mapStateToProps)(BandwidthLimitAlertTable)