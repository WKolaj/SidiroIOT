import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ActivateService from '../../services/activate.service';
import { refreshDeviceParams } from '../../actions/DevicesSelectionPage.action';

 function StandardBottomToolbar({ selectedDevice, allDevices, refreshDeviceParams }) {
  const { t } = useTranslation();

  const activateDevice = (activate, device) => {
    ActivateService.activateDevice(activate, device).then(res => {
      if (res.status === 200) {
        refreshDeviceParams(res.data)
      }
    })
  }
  
  const isActive = () => {
    if (selectedDevice.selectedDeviceID !== '' && allDevices[selectedDevice.selectedDeviceID] !== undefined) {
      return allDevices[selectedDevice.selectedDeviceID].isActive
    }
    else {
      return null
    }
  }

  return (
    <React.Fragment>
      <Grid item xs={12} sm={6}>
        <Typography variant="h5">{t('DevicesSelectionPage.Status')}: {isActive() ? t('DevicesSelectionPage.StatusConnected') : t('DevicesSelectionPage.StatusDisconnected')}</Typography>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Button disabled={isActive()} fullWidth variant="contained" color="primary" onClick={()=>activateDevice(true, selectedDevice.selectedDeviceID)}>{t('DevicesSelectionPage.Connect')}</Button>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Button disabled={!isActive()} fullWidth variant="contained" color="secondary" onClick={()=>activateDevice(false, selectedDevice.selectedDeviceID)}>{t('DevicesSelectionPage.Disconnect')}</Button>
      </Grid>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    selectedDevice: state.DevicesListReducer,
    allDevices: state.DevicesSelectionPageReducer.devices
  }
}

const mapDispatchToProps = {
  refreshDeviceParams
}

export default connect(mapStateToProps, mapDispatchToProps)(StandardBottomToolbar)