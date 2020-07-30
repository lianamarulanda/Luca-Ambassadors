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
import LoadComponent from '../layout/LoadComponent';
import register from '../../images/register.jpg';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton'
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: `url(${register})`,
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
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  signIn: {
    textAlign: 'right',
    alignItems: 'right',
    padding: theme.spacing(4)
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: '#BF7C63',
    width: '50%',
    borderRadius: "5em",
    padding: 9,
    textTransform: "none",
    fontWeight: 500,
    '&:hover': {
      backgroundColor: '#8C7264',
    },
  },
  gridTitle: {
    textAlign: 'left',
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

// Object.freeze() locks the current properties, so that the only
// available states are email and password, and cant be removed / added later on
const initialFormData = Object.freeze({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  discountCode: "",
  specialCode: "",
});

export default function RegisterComponent() {
  const classes = useStyles();
  const history = useHistory();
  const api = React.useContext(DbContext);
  const [error, setError] = React.useState("");
  const [load, setLoad] = React.useState(false);

  // React.useState() initializes our state,
  // a state is a collection of private variables used by the current component

  // const [stateName, functionToUpdateState]
  // stateName: the name of the internal state
  // functionToUpdateState: the name of the function that will be called whenever we want to update
  // this state
  const [formData, updateFormData] = React.useState(initialFormData);

  // updateFormData requires us to specify all the values we want in the updated state
  // Omitting a single key-value pair erases it (makes it empty i.e. "") even if initialized to something not empty
  const handleChange = (event: any) => {
    updateFormData({
      ...formData, // gets current state values, prevents from resetting key-val pair

      // if we change email field, [email] = testEmail@email
      [event.target.name]: event.target.value.trim()
    });
  };

  const handleRegistration = (event: any) => {
    event.preventDefault()
    if (formData.firstName === "" || formData.lastName === "" || formData.discountCode === "")
      setError("Please fill out all required fields!");
    else {
      setLoad(true);
      api.createUser(formData.firstName, formData.lastName, formData.email, formData.password, formData.discountCode, formData.specialCode)
        .then(() => {
          history.push('/verify');
        })
        .catch((error: string) => {
          setLoad(false);
          setError(error);
        });
    }
  };

  if (load) {
    return <LoadComponent />
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
        <Grid item className={classes.signIn}>
          <Link href="/login" className={classes.signIn} variant="body2">
            {"Already have an account? Sign in"}
          </Link>
        </Grid>
        <div className={classes.paper}>
          <Grid style={{ alignItems: 'center' }}>
            <Grid item className={classes.gridTitle}>
              <Typography className={classes.title} component="h1" variant="h3">
                Sign up
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
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    autoComplete="fname"
                    name="firstName"
                    variant="outlined"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="lname"
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  margin="normal"
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  margin="normal"
                  fullWidth
                  id="discountCode"
                  label="Ambassador Code"
                  name="discountCode"
                  autoComplete="discount-code"
                  onChange={handleChange}
                />
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="specialCode"
                    label="Special Code"
                    name="specialCode"
                    autoComplete="special-code"
                    onChange={handleChange}
                  />
                </Grid>
                <Tooltip
                  title={<Typography variant="subtitle1">If you have received a Special Code, type it in here. Otherwise, leave it blank</Typography>}
                  style={{ backgroundColor: 'transparent' }}
                >
                  <IconButton aria-label="info">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={handleRegistration}
                >
                  Sign Up
                </Button>
              </Grid>
              <Box mt={14} style={{ alignSelf: 'center' }}>
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
