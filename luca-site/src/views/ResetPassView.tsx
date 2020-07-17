import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { DbContext } from '../util/api/';
import { useHistory } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import FlowerBg from '../images/flowers.jpg';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: `url(${FlowerBg})`,
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
    marginTop: '50px',
    // marginRight: '350px',
    marginBottom: '50px',
    fontWeight: 100,
    color: '#4f4f4f',
    fontFamily: 'serif',
  },
  gridTitle : {
    textAlign: 'left',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  signUp: {
    textAlign: 'right',
    padding: theme.spacing(4)
  },
  signIn: {
    textAlign: 'left',
    padding: theme.spacing(4)
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: '#D9BBB0',
    width: '50%',
    borderRadius: "5em",
    padding: 9,
    textTransform: "none",
    fontWeight: 500,
    '&:hover': {
      backgroundColor: '#bfa298',
    }
  },
  sentEmail: {
    marginTop:'15px',
    color: '#17A697'
  }
}));

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://luca-love.com/">
        Luca Love Bracelets
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const initialFormData = Object.freeze({
  email: "",
});

function ResetPassView() {
  const classes = useStyles();
  const history = useHistory();
  const api = React.useContext(DbContext);
  // state handling
  const [formData, updateFormData] = React.useState(initialFormData);
  const [error, setError] = React.useState("");
  const [sentEmail, setSent] = React.useState(false);

  const handleChange = (event: any) => {
    updateFormData({
        ...formData, // gets current state values, prevents from resetting key-val pair

        // if we change email field, [email] = testEmail@email
        [event.target.name]: event.target.value.trim()
    });
  };

  const handlePassReset = async () => {
    api.sendPassReset(formData.email)
      .then(() => {
        setError("");
        setSent(true);
      })
      .catch((error: string) => {
        setSent(false);
        setError(error);
      });
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={6} className={classes.image} />
      <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Link href="/login" className={classes.signIn} variant="body2">
            {"Sign in"}
          </Link>
          <Link href="/register" className={classes.signUp} variant="body2">
            {"Sign up"}
          </Link>
        </Grid>
        <div className={classes.paper}>
          <Grid style={{alignItems: 'center', justifyContent:'center'}}>
            <Grid item className={classes.gridTitle}>
              <Typography className={classes.title} gutterBottom={true} component="h1" variant="h3">
                Forgot Password?
              </Typography>
              <Typography gutterBottom={true} component="h1" variant="subtitle2">
                Please enter the email you used to create an account
              </Typography>
              <Typography gutterBottom={true} component="h1" variant="subtitle2">
                and we'll send you a link to reset your password.
              </Typography>
            </Grid>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={handleChange}
              />
              <Grid item>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={handlePassReset}
                >
                  Submit
                </Button>
              </Grid>
              { error !== "" && 
              <div>
                <Typography variant="overline" color="error" display="block" gutterBottom>
                  { error }
                </Typography>
              </div>
              }
              { sentEmail && 
                <Grid item className={classes.sentEmail}> 
                  <Typography variant="overline"> Email has been sent! It may take a few minutes to arrive.</Typography>
                </Grid>
              }
              <Box mt={33} style={{alignSelf:'center'}}>
                <Copyright />
              </Box>
            </form>
          </Grid>
        </div>
      </Grid>
    </Grid>
  );
}


export default ResetPassView;
