import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { DbContext } from '../../util/api';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton'
import InfoIcon from '@material-ui/icons/Info';


const useStyles = makeStyles({
  root: {
    minWidth: 275,
    alignItems: "left",
    textAlign: "left"
  },
  title: {
    fontWeight: 'bolder',
    textAlign: 'left',
    fontSize: 17
  },
  uploadSuccess: {
    color: '#2E5941'
  }
});

export default function BannerComponent() {
  const classes = useStyles();
  const api = React.useContext(DbContext);
  const [banner, setBanner] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  
  React.useEffect(() => {
    api.getBanner()
      .then((banner: string) => {
        setBanner(banner);
      })
      .catch(() => {
        // no banner was found.
      });
  }, []);

  const handleChange = (event: any) => {
    var value = event.target.value;
    setBanner(value);
  };

  const submitBanner = () => {
    
    if (banner === "") {
      setMessage("");
      setError("Banner is empty!");
      return;
    } else if (banner.length > 90) {
      setMessage("");
      setError("Banner character limit is 90!");
      return;
    }

    api.createBanner(banner)
      .then((status: string) => {
        setError("");
        setMessage(status);
      })
      .catch((error: string) => {
        setMessage("");
        setError(error);
      })
  }

  const deleteBanner = () => {
    api.deleteBanner()
      .then((status: string) => {
        setError("");
        setMessage(status);
      })
      .catch((error: string) => {
        setMessage("");
        setError(error);
      })
  }

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid item style={{justifyItems: 'left'}}>
          <Grid container direction="row">
            <Typography className={classes.title} gutterBottom variant="subtitle2">
                {"Current Banner"}
            </Typography>
            <Tooltip 
            title={<Typography variant="body1">
               Banners appear at the top of an ambassador's homepage. The character limit for a banner is 90.
               </Typography>}
            >
              <IconButton aria-label="delete" style={{padding:'0px', marginLeft:'10px', marginBottom:'5px'}}>
                <InfoIcon fontSize="small"/>
              </IconButton>
            </Tooltip>
          </Grid>
            {/* <Typography style={{textAlign:'left'}} variant="subtitle2">
              {banner}
            </Typography> */}
          { message !== "" &&
            <Typography variant="overline" className={classes.uploadSuccess} gutterBottom>
              { message }
            </Typography>
          }
          { error !== "" &&
            <Typography variant="overline" color="error" display="block" gutterBottom>
              { error }
            </Typography>
          }
          <TextField
            id="filled-required"
            multiline
            margin="dense"
            rows={1}
            fullWidth
            rowsMax={3}
            value={banner}
            style={{marginBottom:'30px', marginTop:'20px', justifySelf:'left'}}
            onChange={handleChange}
            helperText = {banner.length}
          />
          <Grid container direction="row" alignItems="center">
            <Grid item style={{justifySelf: 'left'}}>
              <Button onClick={submitBanner} variant="outlined" size="small">Save</Button>
            </Grid>
            <Grid item style={{padding:'10px'}}>
              <Button onClick={deleteBanner} variant="outlined" size="small">Delete Current Banner</Button>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}