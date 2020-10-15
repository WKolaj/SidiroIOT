import React from 'react';
import Grid from '@material-ui/core/Grid';
import Dropzone from './Dropzone.component';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';

export default function Settings() {
  const { t } = useTranslation()
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">{t('SettingsPage.Title')}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Dropzone />
        </Grid>
        <Grid item xs={6} sm={6} md={4} lg={2}>
          <Button fullWidth variant="contained" color="primary">{t('SettingsPage.LoadButton')}</Button>
        </Grid>
        <Grid item xs={6} sm={6} md={4} lg={2}>
          <Button fullWidth variant="contained" color="secondary">{t('SettingsPage.SaveButton')}</Button>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}