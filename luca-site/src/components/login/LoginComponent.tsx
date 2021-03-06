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
import { DbContext } from '../../util/api';
import { useHistory } from 'react-router-dom';
import loginPhoto from '../../images/loginPhoto.jpg';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: `url(${loginPhoto})`,
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
    marginBottom: '50px',
    fontWeight: 100,
    color: '#4f4f4f',
    fontFamily: 'serif',
  },
  gridTitle: {
    textAlign: 'left',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  signUp: {
    textAlign: 'right',
    alignItems: 'right',
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
  password: "",
});

function LoginComponent() {
  const classes = useStyles();
  const history = useHistory();
  const api = React.useContext(DbContext);
  // state handling
  const [formData, updateFormData] = React.useState(initialFormData);
  const [error, setError] = React.useState("");

  const handleChange = (event: any) => {
    updateFormData({
      ...formData, // gets current state values, prevents from resetting key-val pair

      // if we change email field, [email] = testEmail@email
      [event.target.name]: event.target.value.trim()
    });
  };

  const handleLogin = async (event: any) => {
    event.preventDefault()
    api.loginUser(formData.email, formData.password)
      .then(() => {
        history.push("/dashboard");
      })
      .catch((error: string) => {
        setError(error);
      });
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
        <Grid item className={classes.signUp}>
          <Link href="/register" className={classes.signUp} variant="body2">
            {"Don't have an account? Sign up"}
          </Link>
        </Grid>
        <div className={classes.paper}>
          <Grid style={{ alignItems: 'center' }}>
            <Grid item className={classes.gridTitle}>
              <Typography className={classes.title} component="h1" variant="h3">
                Sign in
              </Typography>
              {error !== "" &&
                <div>
                  <Typography variant="overline" color="error" display="block" gutterBottom>
                    {error}
                  </Typography>
                </div>
              }
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
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleChange}
              />
              <Grid item>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={handleLogin}
                >
                  Sign In
                </Button>
              </Grid>
              <Grid container style={{ alignSelf: 'center' }}>
                <Grid item xs style={{ alignSelf: 'center' }}>
                  <Link href="/resetpassword" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>
              <Box mt={25} style={{ alignSelf: 'center' }}>
                <Copyright />
              </Box>
            </form>
          </Grid>
        </div>
      </Grid>
      <Grid item xs={false} sm={4} md={6} className={classes.image} />
    </Grid>
  );
}


export default LoginComponent;
