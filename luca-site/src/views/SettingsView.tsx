import React from 'react';
import SettingsComponent from '../components/settings/SettingsComponent' // do i need an index?
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import Sidebar from '../components/layout/SidebarComponent';
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography';
import { DbContext } from '../util/api';
import { useHistory } from 'react-router-dom';


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  title: {
    fontWeight: 100,
    fontFamily: 'Helvetica',
    textAlign: 'left',
    marginBottom: '50px'
  }
}));

function SettingsView() {
  const classes = useStyles();
  const api = React.useContext(DbContext);
  const history = useHistory();


  React.useEffect(() => {
    if (!api.isLoggedIn()) {
      history.push('/login');
    } 
  }, [history, api]);


  return (
    <div className={clsx(classes.root)}>
      <CssBaseline />
      <Sidebar />
      <main className={classes.content}>
        <Container maxWidth="lg" className={classes.container}>
          <Typography
            className={classes.title}
            color="inherit"
            gutterBottom
            variant="h4"
            style={{fontWeight:700}}
          >
                Settings
          </Typography>
          <SettingsComponent />
        </Container>
      </main>
    </div>
  );
}

export default SettingsView;