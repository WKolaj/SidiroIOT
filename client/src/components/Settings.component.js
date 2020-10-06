import React from 'react';
import Grid from '@material-ui/core/Grid';
import Dropzone from './Dropzone.component';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

export default function Settings() {
  return(
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
        <Typography variant="h4">Settings</Typography>
        </Grid>
        <Grid item xs={12}>
          <Dropzone/>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Button fullWidth variant="outlined" color="primary">Load</Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Button fullWidth variant="outlined" color="secondary">Save</Button>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}