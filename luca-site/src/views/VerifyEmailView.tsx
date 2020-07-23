import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Grid from '@material-ui/core/Grid';
import line from '../images/Logo-12-2.png';
import Button from '@material-ui/core/Button';
import { DbContext } from '../util/api';
import image1 from '../images/image1.jpg';
import image2 from '../images/image2.jpg';
import image3 from '../images/image3.jpg';
import image4 from '../images/image4.jpg';
import image5 from '../images/image5.jpg';
import image6 from '../images/image6.jpg';
import image7 from '../images/image7.jpg';
import image8 from '../images/image8.jpg';
import image9 from '../images/image9.jpg';

const tileData = [
  {
    img: image1
  },
  {
    img: image2
  },
  {
    img: image3
  },
  {
    img: image4
  },
  {
    img: image5
  },
  {
    img: image6
  },
  {
    img: image7
  },
  {
    img: image8
  },
  {
    img: image9
  }
];

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  gridList: {
    width: 500,
    height: 'auto',
    overflowY: 'auto',
  },
  button: {
    textTransform: "none",
    marginTop: '15px'
  },
  resend: {
    marginTop: '15px',
    color: '#17A697'
  }
}));

export default function VerifyEmail() {
  const classes = useStyles();
  const api = React.useContext(DbContext);
  const [resend, setResend] = React.useState(false);
  const [verified, setVerified] = React.useState(false);
  const [error, setError] = React.useState(false);


  React.useEffect(() => {
    if (api.checkEmailVerification()) {
      setVerified(true);
    }
  }, [api]);

  if (verified) {
    return (
      <Typography> Email has already been verified! </Typography>
    );
  }

  const resendEmail = async () => {
    api.sendEmailVerification()
      .then(() => {
        setError(false);
        setResend(true);
      })
      .catch((error: any) => {
        setResend(false);
        setError(true);
      })
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Container component="main" className={classes.main}>
        <Typography variant="h4" component="h1" style={{ fontWeight: 100 }}>
          Welcome to the Luca Love Ambassadors familia :)
        </Typography>
        <img src={line} style={{ height: '75px', width: '175px' }} />
        <Typography variant="h5" component="h2" style={{ fontWeight: 100 }}>
          {"Check your email to verify your account"}
        </Typography>
        <Grid container style={{ justifyContent: 'center' }}>
          <GridList style={{ marginTop: '50px' }} cellHeight={160} className={classes.gridList} cols={3}>
            {tileData.map((tile) => (
              <GridListTile key={tile.img} cols={1}>
                <img src={tile.img} />
              </GridListTile>
            ))}
          </GridList>
        </Grid>
        <Grid item style={{ marginTop: '30px', textAlign: 'center' }}>
          <Link href="/login" variant="body1">Once you have verified your email, click here to login.</Link>
        </Grid>
        <Button onClick={resendEmail} variant="outlined" color="primary" className={classes.button}>
          Resend email
        </Button>
        {resend &&
          <Grid item className={classes.resend}>
            <Typography variant="overline"> Email has been resent! It may take a few minutes to arrive.</Typography>
          </Grid>
        }
        {error &&
          <Grid item>
            <Typography variant="overline" color="error">
              An error occurred with resending the email! Please try again.
            </Typography>
          </Grid>
        }
      </Container>
    </div>
  );
}