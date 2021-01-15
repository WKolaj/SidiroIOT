import React from 'react';
import { UniversalTable } from '../UniversalTable.component';
import CollapsibleTable from '../CollapsibleTable.component';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

export function LowLimitAlertTable({ lowLimitAlertArray, tableView }) {
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
    t('DevicesSelectionPage.Properties.lastValueTick')]
  }
  lowLimitAlertArray.forEach((lowLimitAlertElement, i) => {
    collapsedRows = []
    if (tableView === 'simple') {
      rows.push([lowLimitAlertElement.name, lowLimitAlertElement.value, lowLimitAlertElement.unit, lowLimitAlertElement.lastValueTick])
    }
    else {
      //push Texts property contents into collapsed table
      collapsedRows.push([lowLimitAlertElement.texts.pl, lowLimitAlertElement.texts.en])

      rowToBeCollapsed.push({ rowIndex: i, content: <UniversalTable small noElevation columns={collapsedCols} rows={collapsedRows} /> })
      rows.push([lowLimitAlertElement.name, 
        lowLimitAlertElement.type, 
        lowLimitAlertElement.value, 
        lowLimitAlertElement.unit, 
        lowLimitAlertElement.defaultValue, 
        lowLimitAlertElement.highLimit, 
        lowLimitAlertElement.hysteresis, 
        lowLimitAlertElement.severity,
        lowLimitAlertElement.sampleTime,
        lowLimitAlertElement.timeOffDelay,
        lowLimitAlertElement.timeOnDelay,
        lowLimitAlertElement.lastValueTick])
    }
  })
  return tableView === 'simple' ? <UniversalTable columns={cols} rows={rows} /> :
    <CollapsibleTable
      columns={cols}
      rows={rows}
      collapsedRows={rowToBeCollapsed}
    />
}

const mapStateToProps = (state) => {
  return {
    selectedDevice: state.DevicesListReducer,
    allDevices: state.DevicesSelectionPageReducer.devices,
    tableView: state.DevicesSelectionPageReducer.tableView
  }
}

export default connect(mapStateToProps)(LowLimitAlertTable)