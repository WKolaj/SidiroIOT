import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { toggleTableView } from '../../actions/DevicesSelectionPage.action';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles((theme) => ({
  devicesTitleInline: {
    display: 'inline-block'
  },
  switch: {
    textAlign: 'right'
  }
}));

function DeviceDetailsTitle({ selectedDevice, allDevices, toggleTableView, tableView }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const device = allDevices[selectedDevice.selectedDeviceID]

  const checked = () => {
    return tableView === 'simple' ? false : true
  }

  return (
    <React.Fragment>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignContent="flex-end">
        <Grid item xs={12} sm={6}>
          <Typography variant="h4" className={classes.devicesTitleInline}>{device.name}</Typography>
        </Grid>
        <Grid item xs={12} sm={6} className={classes.switch}>
          <FormControlLabel
            control={<Switch checked={checked()} onChange={() => toggleTableView()} />}
            label={t('DevicesSelectionPage.TableSwitchAdvancedView')}
          />
        </Grid>
      </Grid>


      <Divider />
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
const mapDispatchToProps = {
  toggleTableView
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceDetailsTitle)