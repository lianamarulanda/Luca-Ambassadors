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


const tileData = [
  {
   img: 'https://scontent-iad3-1.cdninstagram.com/v/t51.29350-15/105493832_300706381102703_8033152533069920244_n.jpg?_nc_cat=107&_nc_sid=8ae9d6&_nc_ohc=hOvdO7s3FEYAX_6AqKs&_nc_ht=scontent-iad3-1.cdninstagram.com&oh=5998b19b1ca568da6bf0e62e934185f2&oe=5F2A06BB'
  },
  {
    img: 'https://scontent.ftpa1-2.fna.fbcdn.net/v/t31.0-8/28701189_1600706866723663_4562909647058257910_o.jpg?_nc_cat=100&_nc_sid=9267fe&_nc_ohc=hxOiawgIUysAX9qCM0d&_nc_ht=scontent.ftpa1-2.fna&oh=a265ecaefd8ba15a377f9fc231508c88&oe=5F2C5564'
  },
  {
    img: 'https://images-ext-1.discordapp.net/external/8E5Sflz8M9PoloEBXSVxPLtrkDPyOkUG1t4tSL1xKVk/%3F_nc_cat%3D109%26_nc_sid%3D2c4854%26_nc_ohc%3DMujlhrh4IG4AX9jDFvN%26_nc_ht%3Dscontent.ftpa1-1.fna%26oh%3D60e421f601cee23e50354377c1e7f53b%26oe%3D5F2C03F3/https/scontent.ftpa1-1.fna.fbcdn.net/v/t31.0-8/21125796_1417378191723199_1715898478894948298_o.jpg?width=879&height=940'
  },
  {
    img: 'https://scontent.ftpa1-1.fna.fbcdn.net/v/t1.0-9/94640842_2812739828853688_8871817667913187328_o.jpg?_nc_cat=108&_nc_sid=9267fe&_nc_ohc=brEgOpmYQMAAX91bnDr&_nc_ht=scontent.ftpa1-1.fna&oh=4da72cc664ff59e3d53e801ce3f60dc9&oe=5F29694E'
  },
  {
    img: 'https://scontent.ftpa1-1.fna.fbcdn.net/v/t1.0-9/78647683_2535062266621447_2074910267044528128_o.jpg?_nc_cat=101&_nc_sid=9267fe&_nc_ohc=SI-6Nh3iR6kAX9WQmIs&_nc_ht=scontent.ftpa1-1.fna&oh=72317e31ca8005c1f63ff2ee04e3ae40&oe=5F2911EE'
  },
  {
    img: 'https://scontent.ftpa1-1.fna.fbcdn.net/v/t1.0-9/69618114_2334496703344672_3688484619218321408_o.jpg?_nc_cat=107&_nc_sid=9267fe&_nc_ohc=g4KYOC-QwMUAX_G8pvl&_nc_ht=scontent.ftpa1-1.fna&oh=f7076382ead108e17938565b5d5ad740&oe=5F2BEAF2'
  },
  {
    img: 'https://scontent.ftpa1-2.fna.fbcdn.net/v/t1.0-9/59928247_2143993169061694_7264478461496918016_o.jpg?_nc_cat=100&_nc_sid=9267fe&_nc_ohc=Ty4VKmUJfNIAX_zClwn&_nc_ht=scontent.ftpa1-2.fna&oh=2ca5ba75a036f8c40804892af592643b&oe=5F2A895C'
  },
  {
    img: 'https://scontent.ftpa1-2.fna.fbcdn.net/v/t1.0-9/67519074_2265612426899767_5631869385497903104_o.jpg?_nc_cat=103&_nc_sid=9267fe&_nc_ohc=zOOJRYoIvkIAX_c931O&_nc_ht=scontent.ftpa1-2.fna&oh=7aff3102c7aa0cf80132b67960e5a1b2&oe=5F2982EB'
  },
  {
    img: 'https://scontent.ftpa1-1.fna.fbcdn.net/v/t1.0-9/73153144_2408500869277588_9015068077208895488_n.jpg?_nc_cat=110&_nc_sid=9267fe&_nc_ohc=xKNhph41xQwAX9fK4x5&_nc_ht=scontent.ftpa1-1.fna&oh=124c5590a82535db8bad767245c53a9b&oe=5F2AC63F'
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
    marginTop:'15px'
  },
  resend: {
    marginTop:'15px',
    color: '#17A697'
  }
}));

export default function VerifyEmail() {
  const classes = useStyles();
  const api = React.useContext(DbContext);
  const [resend, setResend] = React.useState(false);
  const [verified, setVerified] = React.useState(false);

  React.useEffect(() => {
    if (api.checkEmailVerification()) {
      setVerified(true);
    }
  }, [api]);

  if (verified){
    return (
      <Typography> Email has already been verified! </Typography>
    );
  }

  const resendEmail = async () => {
    await api.sendEmailVerification();
    setResend(true);
  };
  
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Container component="main" className={classes.main}>
        <Typography variant="h4" component="h1" style={{fontWeight:100}}>
          Welcome to the Luca Love Ambassadors familia :)
        </Typography>
        <img src={line} style={{height: '75px', width : '175px'}} />
        <Typography variant="h5" component="h2" style={{fontWeight:100}}>
          {"Check your email to verify your account"}
        </Typography>
        <Grid container style={{justifyContent:'center'}}>
          <GridList style={{marginTop: '50px'}} cellHeight={160} className={classes.gridList} cols={3}>
          {tileData.map((tile) => (
            <GridListTile key={tile.img} cols={1}>
              <img src={tile.img} />
            </GridListTile>
          ))}
          </GridList>
        </Grid>
        <Grid item style={{marginTop:'30px', textAlign: 'center'}}>
          <Link href="/login" variant="body1">Once you have verified your email, click here to login.</Link>
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