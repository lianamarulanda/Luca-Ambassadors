import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import errorPic from '../images/errorPic.jpg';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: `url(${errorPic})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(4, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    marginTop: '200px',
    fontWeight: 500,
    color: '#159897',
    fontFamily: 'helvetica',
  },
  gridTitle: {
    textAlign: 'left',
    padding: '50px',
  },
  subText: {
    fontWeight: 100,
    color: '#515c5c',
    fontFamily: 'helvetica'
  },
  button: {
    color: '#6F618C',
    border: 'solid 1px #6F618C',
  }
}));

function LoginComponent() {
  const classes = useStyles();
  const history = useHistory();

  const redirect = (link: string) => {
    history.push(`/${link}`);
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={12} sm={8} md={6} component={Paper} style={{ backgroundColor: '#FAFAFA' }} elevation={6} square>
        <div className={classes.paper}>
          <Grid container className={classes.gridTitle} direction={'column'} spacing={5}>
            <Grid item>
              <Typography className={classes.title} component="h1" variant="h1">
                Oops...
                </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h5" component="h2" className={classes.subText}>
                Something went wrong! Please try again.
                </Typography>
            </Grid>
            <Grid item>
              <Grid container direction={'row'} spacing={5}>
                <Grid item>
                  <Button variant="outlined" className={classes.button} onClick={() => redirect("dashboard")}>
                    Back to Home
                    </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" className={classes.button}>
                    Contact Us
                    </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Grid>
      <Grid item xs={false} sm={4} md={6} className={classes.image} />
    </Grid>
  );
}


export default LoginComponent;
