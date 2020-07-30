import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import flowerbg from '../../images/flowerbg.jpg';
import dashboard from '../../images/dashboard2.jpg';
import settings from '../../images/settings.jpg';
import order from '../../images/order.jpg';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';

export default function HeaderComponent(props: any) {

  var imageUrl = ""
  switch (props.component) {
    case "download": {
      imageUrl = flowerbg;
      break;
    }
    case "order": {
      imageUrl = order;
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
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(3)
      },

      [theme.breakpoints.up('md')]: {
        padding: theme.spacing(6),
        paddingRight: 0,
      },
    },
    menuButton: {
      marginLeft: theme.spacing(1),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
  }));
  const classes = useStyles();

  return (
    <Paper className={classes.mainFeaturedPost}>
      {<img style={{ display: 'none' }} />}
      <div className={classes.overlay} />
      <Grid container direction="row" alignItems="center">
        <Grid item xs={12}>
          <IconButton
            color="inherit"
            onClick={props.sidebarToggle}
            aria-label="open drawer"
            edge="start"
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
        </Grid>
        <Grid item xs={12}>
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