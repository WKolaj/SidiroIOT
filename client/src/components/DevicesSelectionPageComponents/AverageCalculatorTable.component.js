import React from 'react';
import { UniversalTable } from '../UniversalTable.component';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

export function AverageCalculatorTable({ averageCalcElementsArray, selectedDevice, allDevices, tableView }) {
  const { t } = useTranslation();
  const device = allDevices[selectedDevice.selectedDeviceID]

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
    t('DevicesSelectionPage.Properties.factor'),
    t('DevicesSelectionPage.Properties.sampleTime'),
    t('DevicesSelectionPage.Properties.calculationInterval'),
    t('DevicesSelectionPage.Properties.variableName'),
    t('DevicesSelectionPage.Properties.lastValueTick'),
    ]
  }
  averageCalcElementsArray.forEach(calcElement => {
    //associate variableID with variable name
    calcElement = {
      ...calcElement,
      variableIDName: device.variables[calcElement.variableID] !== undefined ? device.variables[calcElement.variableID].name : ''
    }

    if (tableView === 'simple') {
      rows.push([calcElement.name, calcElement.value, calcElement.unit, calcElement.lastValueTick])
    }
    else {
      rows.push([calcElement.name, calcElement.type, calcElement.value, calcElement.unit, calcElement.defaultValue, calcElement.factor, calcElement.sampleTime, calcElement.calculationInterval, calcElement.variableIDName, calcElement.lastValueTick])
    }
  })
  return (
    <UniversalTable columns={cols} rows={rows} />
  )
}

const mapStateToProps = (state) => {
  return {
    selectedDevice: state.DevicesListReducer,
    allDevices: state.DevicesSelectionPageReducer.devices,
    tableView: state.DevicesSelectionPageReducer.tableView
  }
}

export default connect(mapStateToProps)(AverageCalculatorTable)