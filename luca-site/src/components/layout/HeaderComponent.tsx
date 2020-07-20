import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import flowerbg from '../../images/flowerbg.jpg';
import dashboard from '../../images/dashboard2.jpg';
import settings from '../../images/settings.jpg';

export default function HeaderComponent(props: any) {

  var imageUrl = ""
  switch (props.component) {
    case "download": {
      imageUrl = flowerbg;
      break;
    }
    case "order": {
      imageUrl = "https://scontent.ftpa1-2.fna.fbcdn.net/v/t1.0-9/85138546_2662676020526737_1613867041310113792_o.jpg?_nc_cat=102&_nc_sid=9267fe&_nc_ohc=oDlo3yYcw0oAX8xCF6A&_nc_ht=scontent.ftpa1-2.fna&oh=884ab7b139521dd5767666fa32abe393&oe=5F3AD87A";
      break;
    }
    case "settings": {
      imageUrl = settings;
      break;
    }
    case "dashboard": {
      imageUrl = dashboard;
      break;
    }
  }

  const useStyles = makeStyles((theme) => ({
    mainFeaturedPost: {
      position: 'relative',
      backgroundColor: theme.palette.grey[800],
      color: theme.palette.common.white,
      marginBottom: theme.spacing(4),
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      textAlign: 'left'
    },
    overlay: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      backgroundColor: 'rgba(0,0,0,.3)',
    },
    mainFeaturedPostContent: {
      position: 'relative',
      padding: theme.spacing(3),
      [theme.breakpoints.up('md')]: {
        padding: theme.spacing(6),
        paddingRight: 0,
      },
    },
  }));
  const classes = useStyles();

  return (
    <Paper className={classes.mainFeaturedPost}>
      {<img style={{ display: 'none' }} />}
      <div className={classes.overlay} />
      <Grid container>
        <Grid item md={6}>
          <div className={classes.mainFeaturedPostContent}>
            <Typography component="h1" variant="h3" color="inherit" gutterBottom>
              {props.title}
            </Typography>
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
}