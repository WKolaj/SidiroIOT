import React from 'react';
import { UniversalTable } from '../UniversalTable.component';
import {CollapsibleTable} from '../CollapsibleTable.component';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

export function SumCalculatorTable({ sumCalcElementsArray, selectedDevice, allDevices, tableView }) {
  const { t } = useTranslation();
  const device = allDevices[selectedDevice.selectedDeviceID]

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
    collapsedCols = [t('DevicesSelectionPage.Properties.variableNames'), t('DevicesSelectionPage.Properties.factor')]

    cols = [t('DevicesSelectionPage.Properties.name'),
    t('DevicesSelectionPage.Properties.type'),
    t('DevicesSelectionPage.Properties.value'),
    t('DevicesSelectionPage.Properties.unit'),
    t('DevicesSelectionPage.Properties.defaultValue'),
    t('DevicesSelectionPage.Properties.sampleTime'),
    t('DevicesSelectionPage.Properties.lastValueTick')]
  }
  sumCalcElementsArray.forEach((sumElement, i) => {
    collapsedRows = []
    if (tableView === 'simple') {
      rows.push([sumElement.name, sumElement.value, sumElement.unit, sumElement.lastValueTick])
    }
    else {
      //push variableIDs into collapsed table
      sumElement.variableIDs.forEach(el => {
        //associate variableID with variable name
        el = {
          ...el,
          variableID: device.variables[el.variableID] !== undefined ? device.variables[el.variableID].name : ''
        }
        collapsedRows.push([el.variableID, el.factor])
      })
      rowToBeCollapsed.push({ rowIndex: i, content: <UniversalTable small noElevation columns={collapsedCols} rows={collapsedRows} /> })
      rows.push([sumElement.name, sumElement.type, sumElement.value, sumElement.unit, sumElement.defaultValue, sumElement.sampleTime, sumElement.lastValueTick])
    }
  })
  return tableView === 'simple' ? <UniversalTable columns={cols} rows={rows} /> :
    <CollapsibleTable
      columns={cols}
      rows={rows}
      collapsedRows={rowToBeCollapsed}
      name='SumCalculatorTable'
    />
}

const mapStateToProps = (state) => {
  return {
    selectedDevice: state.DevicesListReducer,
    allDevices: state.DevicesSelectionPageReducer.devices,
    tableView: state.DevicesSelectionPageReducer.tableView
  }
}

export default connect(mapStateToProps)(SumCalculatorTable)