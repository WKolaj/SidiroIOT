import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import HighLimitAlertTable from './HighLimitAlertTable.component';
import LowLimitAlertTable from './LowLimitAlertTable.component';
import BandwidthLimitAlertTable from './BandwidthLimitAlertTable.component';
import ExactValuesAlertTable from './ExactValuesAlertTable.component';
import { formatDateTime } from '../../utilities/formatDateTime.utility';

const useStyles = makeStyles((theme) => ({
  topMargin: {
    marginTop: theme.spacing(2)
  },
  alertActive: {
    color: 'red'
  }
}));

function EdgeComputingTabContent({ alertElementsObject, selectedDevice, allDevices }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const device = allDevices[selectedDevice.selectedDeviceID]

  const alertValueConverter = (alertValue) => {
    switch (typeof alertValue) {
      case 'number':
        return parseFloat(alertValue).toFixed(3)
      case 'undefined':
        return ''
      default:
        return `${alertValue}`
    }
  }

  const alertElements = Object.values(alertElementsObject).map(alert => {
    return {
      ...alert,
      variableName: device.variables[alert.variableID] !== undefined ? device.variables[alert.variableID].name : '',
      value: alert.value === null ?
        t('DevicesSelectionPage.Properties.inactive')
        :
        <span className={classes.alertActive}>{t('DevicesSelectionPage.Properties.active')} ({alertValueConverter(device.variables[alert.variableID]!==undefined? device.variables[alert.variableID].value : '')})</span>,
      defaultValue: alert.defaultValue === null ? t('DevicesSelectionPage.Properties.inactive') : t('DevicesSelectionPage.Properties.active'),
      lastValueTick: alert.lastValueTick === 0 ? '' : formatDateTime(new Date(parseFloat(alert.lastValueTick) * 1000))
    }
  })
  const highLimitAlerts = alertElements.filter(alert => alert.type === 'HighLimitAlert')
  const lowLimitAlerts = alertElements.filter(alert => alert.type === 'LowLimitAlert')
  const bandWidthLimitAlerts = alertElements.filter(alert => alert.type === 'BandwidthLimitAlert')
  const exactValuesAlerts = alertElements.filter(alert => alert.type === 'ExactValuesAlert')

  return (
    <React.Fragment>
      {highLimitAlerts.length > 0 ?
        <React.Fragment>
          <Typography variant="h6" className={classes.topMargin}>{t('DevicesSelectionPage.Properties.HighLimitAlert')}</Typography>
          <HighLimitAlertTable highLimitAlertArray={highLimitAlerts} />
        </React.Fragment>
        : null}
      {lowLimitAlerts.length > 0 ?
        <React.Fragment>
          <Typography variant="h6" className={classes.topMargin}>{t('DevicesSelectionPage.Properties.LowLimitAlert')}</Typography>
          <LowLimitAlertTable lowLimitAlertArray={lowLimitAlerts} />
        </React.Fragment>
        : null}
      {bandWidthLimitAlerts.length > 0 ?
        <React.Fragment>
          <Typography variant="h6" className={classes.topMargin}>{t('DevicesSelectionPage.Properties.BandwidthLimitAlert')}</Typography>
          <BandwidthLimitAlertTable bandwidthLimitAlertArray={bandWidthLimitAlerts} />
        </React.Fragment>
        : null}
      {exactValuesAlerts.length > 0 ?
        <React.Fragment>
          <Typography variant="h6" className={classes.topMargin}>{t('DevicesSelectionPage.Properties.ExactValuesAlert')}</Typography>
          <ExactValuesAlertTable exactValuesAlertArray={exactValuesAlerts} />
        </React.Fragment>
        : null}
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

export default connect(mapStateToProps)(EdgeComputingTabContent)