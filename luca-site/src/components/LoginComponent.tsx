import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { DbContext } from '../util/api';
import { useHistory } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/73414117_186091762583756_3668277161097506400_n.jpg?_nc_cat=105&_nc_sid=8ae9d6&_nc_ohc=Pb3m2nm7U1AAX_XgVpk&_nc_ht=scontent-iad3-1.cdninstagram.com&oh=f3abf00d24fb16b1ca040fef73512e86&oe=5EE25105)',
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
    marginRight: '350px',
    marginBottom: '50px',
    fontWeight: 100,
    color: '#4f4f4f',
    fontFamily: 'serif',
  },
  form: {
    width: '70%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  signUp: {
    marginLeft: '450px',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: '#168C80',
    width: '50%',
    borderRadius: "5em",
    padding: 9,
    textTransform: "none",
    fontWeight: 500,
    '&:hover': {
      backgroundColor: '#10675E',
    }
  },
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

  const handleChange = (event: any) => {
    updateFormData({
        ...formData, // gets current state values, prevents from resetting key-val pair

        // if we change email field, [email] = testEmail@email
        [event.target.name]: event.target.value.trim()
    });
  };

  // loginUser api will get called here
  const handleLogin = async (event: any) => {
    event.preventDefault()
    // debug print statement
    console.log(formData);

    api.loginUser(formData.email, formData.password)
      .then((loggedIn: boolean) => {
        if (loggedIn) {
          api.checkAdminStatus()
            .then((isAdmin: boolean) => {
              if (!isAdmin) {
                history.push("/dashboard");
              } else {
                // go to admin home page
              }
            })
        } else {
          // show error 
        }
      });
};


  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Grid item>
            <Link href="/register" className={classes.signUp} variant="body2">
              {"Don't have an account? Sign up"}
            </Link>
          </Grid>
          <Typography className={classes.title} component="h1" variant="h3">
                Sign in
          </Typography>
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
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
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
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
            <Box mt={35}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
      <Grid item xs={false} sm={4} md={6} className={classes.image} />
    </Grid>
  );
}


export default LoginComponent;
