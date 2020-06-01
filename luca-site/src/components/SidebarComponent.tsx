import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import SettingsIcon from '@material-ui/icons/Settings';
import MailIcon from '@material-ui/icons/Mail';
import Avatar from '@material-ui/core/Avatar';
import profilePic from '../images/happydog.jpg';
import ViewQuiltIcon from '@material-ui/icons/ViewQuilt'

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
      background: 'linear-gradient(45deg, #F2E4D8 30%, #168C80 90%)',
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(3),
    },
    large: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },

    buttonText: {
      color: 'white',
      '&:hover': {
        color: '#6c7878',
      }
    },
    nameText: {
      color: 'white',
      fontWeight: 'bold',
      paddingTop: '15px',
    },
    subText: {
      color: '#e3e6e6',
      paddingBottom: '80px',
      fontStyle: 'italic',
      fontWeight: 'lighter'
    },
    icon: {
      color: 'white'
    }
  }),
);

export default function Sidebar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.toolbar} />
        <Avatar alt="pic" src={profilePic} className={classes.large} style={{alignSelf: 'center'}} />
        <Typography variant="h6" className={classes.nameText} component="h2"> Paulina Tobon </Typography>
        <Typography variant="subtitle1" className={classes.subText}>Brand Ambassador</Typography>

        <List>
          <ListItem button className={classes.buttonText}>
            <ListItemIcon className={classes.icon}> <ViewQuiltIcon/> </ListItemIcon>
            <ListItemText primary={"Dashboard"} />
          </ListItem>
          <ListItem button className={classes.buttonText}>
            <ListItemIcon className={classes.icon}> <ShoppingCartIcon/> </ListItemIcon>
            <ListItemText primary={"Order Accessories"} />
          </ListItem>
          <ListItem button className={classes.buttonText}>
            <ListItemIcon className={classes.icon}> <SettingsIcon/> </ListItemIcon>
            <ListItemText primary={"Settings"} />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}