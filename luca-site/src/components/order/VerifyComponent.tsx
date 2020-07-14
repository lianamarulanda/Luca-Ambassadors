import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import line from '../../images/Logo-12-2.png';
import Button from '@material-ui/core/Button';
import { DbContext } from '../../util/api/';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    marginTop: theme.spacing(12),
    marginBottom: theme.spacing(2),
  },
  button: {
    textTransform: "none",
    marginTop:'15px'
  },
  resend: {
    marginTop:'15px',
    color: '#17A697'
  },
}));

export default function VerifyEmail() {
  const classes = useStyles();
  const api = React.useContext(DbContext);
  const [resend, setResend] = React.useState(false);

  const resendEmail = async () => {
    await api.sendEmailVerification();
    setResend(true);
  };
  
  return (
    <div className={classes.root}>
      <Container component="main" className={classes.main}>
        <Typography variant="h5" component="h2" style={{fontWeight:100}}>
          Please verify your email in order to use this service
        </Typography>
        <img src={line} style={{height: '75px', width : '175px', marginTop:'50px'}} />
        <Grid item style={{marginTop:'30px', textAlign: 'center'}}>
        </Grid>
        <Button onClick={resendEmail} variant="outlined" color="primary" className={classes.button}>
          Resend email
        </Button>
        { resend && 
          <Grid item className={classes.resend}> 
            <Typography variant="overline"> Email has been resent! It may take a few minutes to arrive.</Typography>
          </Grid>
        }
      </Container>
    </div>
  );
}