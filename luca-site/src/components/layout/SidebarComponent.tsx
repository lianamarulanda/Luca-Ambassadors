import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import SettingsIcon from '@material-ui/icons/Settings';
import drawerImage from '../../images/sidebar.jpg';
import DashboardIcon from '@material-ui/icons/Dashboard'
import LogoutIcon from '@material-ui/icons/ExitToApp'
import { DbContext } from '../../util/api';
import Toolbar from '@material-ui/core/Toolbar';
import { useHistory } from 'react-router-dom';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import logo from '../../images/logo2.png'
import Hidden from '@material-ui/core/Hidden';

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
      backgroundImage: 'url(' + drawerImage + ')',
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    large: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    buttonText: {
      color: 'white',
      '&:hover': {
        color: '#cfd3d3',
      }
    },
    logo: {
      maxWidth: 160,
      height: 80,
      alignSelf: 'center',
      marginBottom: '15px'
    },
    nameText: {
      color: 'white',
      fontWeight: 'bold',
      paddingTop: '15px',
      textAlign:'center'
    },
    subText: {
      color: '#e3e6e6',
      paddingBottom: '70px',
      fontStyle: 'italic',
      fontWeight: 'lighter',
      textAlign: 'center'
    },
    logoutButton: {
      marginTop: "300px",
      [theme.breakpoints.down('sm')]: {
        marginTop: "150px"
      },
      color: 'white',
      '&:hover': {
        color: '#cfd3d3',
      }
    },
    icon: {
      color: 'white'
    },
  }),
);

export default function Sidebar(props: any) {
  const classes = useStyles();
  const dbContext = React.useContext(DbContext);
  const history = useHistory();
  const [status, setStatus] = React.useState("");

  const drawer = (
    <List>
      <ListItem button className={classes.buttonText} onClick={() => redirect("dashboard")}>
        <ListItemIcon className={classes.icon}> <DashboardIcon /> </ListItemIcon>
        <ListItemText primary={"Dashboard"} />
      </ListItem>
      <ListItem button className={classes.buttonText} onClick={() => redirect("order")}>
        <ListItemIcon className={classes.icon}> <ShoppingCartIcon /> </ListItemIcon>
        <ListItemText primary={"Order Accessories"} />
      </ListItem>
      <ListItem button className={classes.buttonText} onClick={() => redirect("download")}>
        <ListItemIcon className={classes.icon}> <CloudDownloadIcon /> </ListItemIcon>
        <ListItemText primary={"Download Media"} />
      </ListItem>
      <ListItem button className={classes.buttonText} onClick={() => redirect("settings")}>
        <ListItemIcon className={classes.icon}> <SettingsIcon /> </ListItemIcon>
        <ListItemText primary={"Settings"} />
      </ListItem>
      <ListItem button className={classes.logoutButton} onClick={() => logout()}>
        <ListItemIcon className={classes.icon}> <LogoutIcon /> </ListItemIcon>
        <ListItemText primary={"Logout"} />
      </ListItem>
    </List>
  );

  React.useEffect(() => {
    dbContext.checkAdminStatus()
      .then((status: boolean) => {
        if (status)
          setStatus("Owner");
        else if (dbContext.userData.influencerStatus)
          setStatus("Influencer");
        else
          setStatus("Brand Ambassador");
      })

  }, [dbContext]);

  function redirect(link: string) {
    history.push(`/${link}`);
  }

  function logout() {
    dbContext.logout().then(async () => {
      history.push('/login');
    })
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Hidden smUp implementation="css">
        <Drawer
          className={classes.drawer}
          variant="temporary"
          open={props.sidebarStatus}
          anchor="left"
          onClose={props.sidebarToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <Toolbar />
          <img src={logo} className={classes.logo} alt="logo" />
          <Typography variant="h6" className={classes.nameText} component="h2">{dbContext.userData.firstName + " " + dbContext.userData.lastName}</Typography>
          <Typography variant="subtitle1" className={classes.subText}>{status}</Typography>
          {drawer}
        </Drawer>
      </Hidden>

      <Hidden xsDown implementation="css">
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          anchor="left"
        >
          <Toolbar />
          <img src={logo} className={classes.logo} alt="logo" />
          <Typography variant="h6" className={classes.nameText} component="h2">{dbContext.userData.firstName + " " + dbContext.userData.lastName}</Typography>
          <Typography variant="subtitle1" className={classes.subText}>{status}</Typography>
          {drawer}
        </Drawer>
      </Hidden>
    </div>
  );
}