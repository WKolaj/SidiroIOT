import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import DetailsIcon from '@material-ui/icons/Details';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import { toggleTableView } from '../../actions/DevicesSelectionPage.action';

const useStyles = makeStyles((theme) => ({
  devicesTitleInline: {
    display: 'inline-block'
  },
  toggleTableView: {
    verticalAlign: 'baseline'
  }
}));

function DeviceDetailsTitle({ selectedDevice, allDevices, toggleTableView }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const device = allDevices[selectedDevice.selectedDeviceID]

  return (
    <React.Fragment>
      <Typography variant="h4" className={classes.devicesTitleInline}>{device.name}</Typography>
      <Tooltip title={t('DevicesSelectionPage.ToggleTableView')} placement="bottom">
        <IconButton className={classes.toggleTableView} aria-label="expand-table" onClick={() => toggleTableView()} >
          <DetailsIcon />
        </IconButton>
      </Tooltip>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    selectedDevice: state.DevicesListReducer,
    allDevices: state.DevicesSelectionPageReducer.devices,
  }
}
const mapDispatchToProps = {
  toggleTableView
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceDetailsTitle)