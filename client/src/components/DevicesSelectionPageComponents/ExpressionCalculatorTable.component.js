import React from 'react';
import { UniversalTable } from '../UniversalTable.component';
import {CollapsibleTable} from '../CollapsibleTable.component';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

export function ExpressionCalculatorTable({ expressionCalcElementsArray, selectedDevice, allDevices, tableView }) {
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
    collapsedCols = [t('DevicesSelectionPage.Properties.parameter'), t('DevicesSelectionPage.Properties.type'), t('DevicesSelectionPage.Properties.value'), t('DevicesSelectionPage.Properties.elementName')]

    cols = [t('DevicesSelectionPage.Properties.name'),
    t('DevicesSelectionPage.Properties.type'),
    t('DevicesSelectionPage.Properties.value'),
    t('DevicesSelectionPage.Properties.unit'),
    t('DevicesSelectionPage.Properties.defaultValue'),
    t('DevicesSelectionPage.Properties.expression'),
    t('DevicesSelectionPage.Properties.sampleTime'),
    t('DevicesSelectionPage.Properties.lastValueTick')]
  }
  expressionCalcElementsArray.forEach((expressionCalcElement, i) => {
    collapsedRows = []
    if (tableView === 'simple') {
      rows.push([expressionCalcElement.name, expressionCalcElement.value, expressionCalcElement.unit, expressionCalcElement.lastValueTick])
    }
    else {
      //push expression calculator's parameters into collapsed table
      for (const [key, obj] of Object.entries(expressionCalcElement.parameters)) {
        if (obj.hasOwnProperty('elementId')) {
          expressionCalcElement = {
            ...expressionCalcElement,
            parameters: {
              ...expressionCalcElement.parameters,
              [key]: {
                ...expressionCalcElement.parameters[key],
                elementId: device.variables[obj.elementId] !== undefined ? device.variables[obj.elementId].name : ''
              }
            }
          }
        }
        collapsedRows.push([key, obj.type, obj.value, expressionCalcElement.parameters[key].elementId])
      }
      rowToBeCollapsed.push({ rowIndex: i, content: <UniversalTable small noElevation columns={collapsedCols} rows={collapsedRows} /> })
      rows.push([expressionCalcElement.name, expressionCalcElement.type, expressionCalcElement.value, expressionCalcElement.unit, expressionCalcElement.defaultValue, expressionCalcElement.expression, expressionCalcElement.sampleTime, expressionCalcElement.lastValueTick])
    }
  })
  return tableView === 'simple' ? <UniversalTable columns={cols} rows={rows} /> :
    <CollapsibleTable
      columns={cols}
      rows={rows}
      collapsedRows={rowToBeCollapsed}
      name='ExpressionCalculatorTable'
    />
}

const mapStateToProps = (state) => {
  return {
    selectedDevice: state.DevicesListReducer,
    allDevices: state.DevicesSelectionPageReducer.devices,
    tableView: state.DevicesSelectionPageReducer.tableView
  }
}

export default connect(mapStateToProps)(ExpressionCalculatorTable)