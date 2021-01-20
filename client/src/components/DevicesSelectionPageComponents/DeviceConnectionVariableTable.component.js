import React from 'react';
import { UniversalTable } from '../UniversalTable.component';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

export function DeviceConnectionVariableTable({ deviceConnectionVariablesArray, tableView }) {
  const { t } = useTranslation();

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
  deviceConnectionVariablesArray.forEach(variable => {
    if (tableView === 'simple') {
      rows.push([variable.name, `${variable.value}`, variable.unit, variable.lastValueTick])
    }
    else {
      rows.push([variable.name, variable.type, `${variable.value}`, variable.unit, variable.defaultValue, variable.sampleTime, variable.lastValueTick])
    }
  })
  return <UniversalTable columns={cols} rows={rows} />
}

const mapStateToProps = (state) => {
  return {
    tableView: state.DevicesSelectionPageReducer.tableView
  }
}

export default connect(mapStateToProps)(DeviceConnectionVariableTable)