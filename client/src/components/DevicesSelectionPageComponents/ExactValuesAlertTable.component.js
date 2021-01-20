import React from 'react';
import { UniversalTable } from '../UniversalTable.component';
import {CollapsibleTable} from '../CollapsibleTable.component';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

export function ExactValuesAlertTable({ exactValuesAlertArray, tableView }) {
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
    collapsedCols = [t('DevicesSelectionPage.Properties.alertValue'), t('DevicesSelectionPage.Properties.textPL'), t('DevicesSelectionPage.Properties.textEN')]

    cols = [t('DevicesSelectionPage.Properties.name'),
    t('DevicesSelectionPage.Properties.type'),
    t('DevicesSelectionPage.Properties.value'),
    t('DevicesSelectionPage.Properties.unit'),
    t('DevicesSelectionPage.Properties.defaultValue'),
    t('DevicesSelectionPage.Properties.severity'),
    t('DevicesSelectionPage.Properties.sampleTime'),
    t('DevicesSelectionPage.Properties.timeOffDelay'),
    t('DevicesSelectionPage.Properties.timeOnDelay'),
    t('DevicesSelectionPage.Properties.alertValues'),
    t('DevicesSelectionPage.Properties.variableName'),
    t('DevicesSelectionPage.Properties.lastValueTick')]
  }
  exactValuesAlertArray.forEach((exactValuesAlertElement, i) => {
    //alertValues array toString
    exactValuesAlertElement = {
      ...exactValuesAlertElement,
      alertValues: `[${exactValuesAlertElement.alertValues}]`
    }
    collapsedRows = []
    if (tableView === 'simple') {
      rows.push([exactValuesAlertElement.name, exactValuesAlertElement.value, exactValuesAlertElement.unit, exactValuesAlertElement.lastValueTick])
    }
    else {
      //push alert values into collapsed table
      for (const [key, obj] of Object.entries(exactValuesAlertElement.texts)) {
        collapsedRows.push([key, obj.pl, obj.en])
      }

      rowToBeCollapsed.push({ rowIndex: i, content: <UniversalTable small noElevation columns={collapsedCols} rows={collapsedRows} /> })
      rows.push([exactValuesAlertElement.name,
      exactValuesAlertElement.type,
      exactValuesAlertElement.value,
      exactValuesAlertElement.unit,
      exactValuesAlertElement.defaultValue,
      exactValuesAlertElement.severity,
      exactValuesAlertElement.sampleTime,
      exactValuesAlertElement.timeOffDelay,
      exactValuesAlertElement.timeOnDelay,
      exactValuesAlertElement.alertValues,
      exactValuesAlertElement.variableName,
      exactValuesAlertElement.lastValueTick])
    }
  })
  return tableView === 'simple' ? <UniversalTable columns={cols} rows={rows} /> :
    <CollapsibleTable
      columns={cols}
      rows={rows}
      collapsedRows={rowToBeCollapsed}
      name='ExactValuesAlertTable'
    />
}

const mapStateToProps = (state) => {
  return {
    selectedDevice: state.DevicesListReducer,
    allDevices: state.DevicesSelectionPageReducer.devices,
    tableView: state.DevicesSelectionPageReducer.tableView
  }
}

export default connect(mapStateToProps)(ExactValuesAlertTable)