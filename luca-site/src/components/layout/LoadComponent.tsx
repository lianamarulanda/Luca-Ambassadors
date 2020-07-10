import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import line from '../images/Logo-12-2.png';

const { Heart } = require('react-spinners-css');

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    justifyContent: 'center'
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
}));


export default function LoadComponent() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Container component="main" className={classes.main}>
        <Grid item>
          <Grid container style={{justifyContent:'center'}}>
            <Heart color="#159897" />
          </Grid>
          <img src={line} style={{height: '75px', width : '180px'}} />
          <Grid container style={{justifyContent:'center'}}>
            <Typography variant="h5" component="h2" style={{fontWeight:100, color:'#515c5c', fontFamily:'helvetica'}}>
              Be the
            </Typography>
            <Typography variant="h5" component="h2" style={{fontWeight:600, color:'#159897', fontFamily:'helvetica', marginLeft:'6px'}}>
              change.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </div>
  );

}