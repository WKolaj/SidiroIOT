import React from 'react';
import { UniversalTable } from '../UniversalTable.component';
import {CollapsibleTable} from '../CollapsibleTable.component';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

export function HighLimitAlertTable({ highLimitAlertArray, tableView }) {
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
    collapsedCols = [t('DevicesSelectionPage.Properties.textPL'), t('DevicesSelectionPage.Properties.textEN')]

    cols = [t('DevicesSelectionPage.Properties.name'),
    t('DevicesSelectionPage.Properties.type'),
    t('DevicesSelectionPage.Properties.value'),
    t('DevicesSelectionPage.Properties.unit'),
    t('DevicesSelectionPage.Properties.defaultValue'),
    t('DevicesSelectionPage.Properties.highLimit'),
    t('DevicesSelectionPage.Properties.hysteresis'),
    t('DevicesSelectionPage.Properties.severity'),
    t('DevicesSelectionPage.Properties.sampleTime'),
    t('DevicesSelectionPage.Properties.timeOffDelay'),
    t('DevicesSelectionPage.Properties.timeOnDelay'),
    t('DevicesSelectionPage.Properties.variableName'),
    t('DevicesSelectionPage.Properties.lastValueTick')]
  }
  highLimitAlertArray.forEach((highLimitAlertElement, i) => {
    collapsedRows = []
    if (tableView === 'simple') {
      rows.push([highLimitAlertElement.name, highLimitAlertElement.value, highLimitAlertElement.unit, highLimitAlertElement.lastValueTick])
    }
    else {
      //push Texts property into collapsed table
      collapsedRows.push([highLimitAlertElement.texts.pl, highLimitAlertElement.texts.en])

      rowToBeCollapsed.push({ rowIndex: i, content: <UniversalTable small noElevation columns={collapsedCols} rows={collapsedRows} /> })
      rows.push([highLimitAlertElement.name, 
        highLimitAlertElement.type, 
        highLimitAlertElement.value, 
        highLimitAlertElement.unit, 
        highLimitAlertElement.defaultValue, 
        highLimitAlertElement.highLimit, 
        highLimitAlertElement.hysteresis, 
        highLimitAlertElement.severity,
        highLimitAlertElement.sampleTime,
        highLimitAlertElement.timeOffDelay,
        highLimitAlertElement.timeOnDelay,
        highLimitAlertElement.variableName,
        highLimitAlertElement.lastValueTick])
    }
  })
  return tableView === 'simple' ? <UniversalTable columns={cols} rows={rows} /> :
    <CollapsibleTable
      columns={cols}
      rows={rows}
      collapsedRows={rowToBeCollapsed}
      name='HighLimitAlertTable'
    />
}

const mapStateToProps = (state) => {
  return {
    selectedDevice: state.DevicesListReducer,
    allDevices: state.DevicesSelectionPageReducer.devices,
    tableView: state.DevicesSelectionPageReducer.tableView
  }
}

export default connect(mapStateToProps)(HighLimitAlertTable)