import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DevicesList from './DevicesList.component';
import DeviceSelectionTabs from './UniversalTabs.component';
import { connect } from 'react-redux';
import UniversalTable from './UniversalTable.component';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(3)
  },
}));

function DevicesSelectionPage(props) {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={3}>
          <Typography variant="h4" className={classes.title}>{t('DevicesSelectionPage.DevicesTitle')}</Typography>
          <DevicesList />
        </Grid>
        <Grid container item xs={12} sm={12} md={9} spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" className={classes.title}>{props.selectedDevice.selectedDeviceName}</Typography>
            <React.Fragment>
              {props.selectedDevice.selectedDeviceType === 'Meter' ?
                <DeviceSelectionTabs
                  name='meterTabs'
                  tabs={[
                    {
                      label: t('DevicesSelectionPage.DatapointsTab'),
                      content: <UniversalTable columns={['Parameter', 'type', 'sampleTime', 'offset', 'length', 'fCode', 'Unit', 'Value']} rows={[['Voltage', 'double', '1', '1', '1', '1', 'V', '230'], ['Voltage', 'double', '1', '1', '1', '1', 'V', '230']]} />
                    },
                    {
                      label: t('DevicesSelectionPage.EdgecomputingTab'),
                      content: <UniversalTable columns={['Parameter', 'type', 'sampleTime', 'calcInterval', 'variableName', 'factor', 'overflow', 'unit', 'value']} rows={[['Voltage', 'double', '1', '60', 'varname', 'factor1', 'overflow1', 'V', '230'], ['Voltage', 'double', '1', '60', 'varname', 'factor1', 'overflow1', 'V', '230']]} />
                    },
                    {
                      label: t('DevicesSelectionPage.EventsTab'),
                      content: <UniversalTable columns={['Parameter', 'Limit', 'Value', 'textPL', 'textEN', 'severity']} rows={[['Voltage', 'Lower limit', '180', 'Przekroczenie dolnego progu', 'Lower threshold exceeding', 'Warning'], ['Voltage', 'Lower limit', '180', 'Przekroczenie dolnego progu', 'Lower threshold exceeding', 'Warning']]} />
                    }
                  ]} />
                :
                <DeviceSelectionTabs
                  name="mindsphereTabs"
                  tabs={[{ label: t('DevicesSelectionPage.DatapointsTab'), content: <UniversalTable columns={['Name', 'Parameter', 'ConfigId', 'DpId', 'Interval', 'Format', 'Length', 'Unit', 'Value']} rows={[['Meter1', 'Voltage', '1', '1', '1min', 'double', '32', 'V', '230'], ['Meter1', 'Voltage', '1', '1', '1min', 'double', '32', 'V', '230']]} /> },
                  { label: t('DevicesSelectionPage.EventsTab'), content: <UniversalTable columns={['Name', 'Parameter', 'Limit', 'TextPL', 'TextEN', 'Severity']} rows={[['Meter1', 'Voltage', 'Upper limit', 'Przekroczenie', 'Exceeding', 'Warning']]} /> }]}
                />
              }

            </React.Fragment>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h5">{t('DevicesSelectionPage.Status')}: {t('DevicesSelectionPage.StatusConnected')}</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button fullWidth variant="contained" color="primary">{t('DevicesSelectionPage.Connect')}</Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button fullWidth variant="contained" color="secondary">{t('DevicesSelectionPage.Disconnect')}</Button>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    selectedDevice: state.DevicesListReducer
  }
}

export default connect(mapStateToProps)(DevicesSelectionPage)