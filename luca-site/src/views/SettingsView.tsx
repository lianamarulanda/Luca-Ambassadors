import React from 'react';
import SettingsComponent from '../components/SettingsComponent'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import Sidebar from '../components/SidebarComponent';
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    backgroundColor: theme.palette.background.paper,
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