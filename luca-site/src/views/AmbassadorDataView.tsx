import React from 'react';
import ListComponent from '../components/ambassadorData/ListComponent';
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import Sidebar from '../components/layout/SidebarComponent';
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography';
import { DbContext } from '../util/api';
import { useHistory } from 'react-router-dom';
import HeaderComponent from '../components/layout/HeaderComponent';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid'
import LoadComponent from '../components/layout/LoadComponent';

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
    fontWeight: 700,
    fontFamily: 'Helvetica',
    textAlign: 'left',
    marginBottom: '50px'
  }
}));

function AmbassadorDataView() {
  const classes = useStyles();
  const api = React.useContext(DbContext);
  const history = useHistory();
  const [sidebar, updateSidebar] = React.useState(false);
  const[codes, updateCodes] = React.useState([] as string[]);

  const sidebarToggle = () => {
    updateSidebar(!sidebar);
  }

  React.useEffect(() => {
    if (!api.isLoggedIn()) {
      history.push('/login');
    } else {
      api.getAllCodes()
        .then((codes: any) => {
          var ambassadorCodes = [] as string[];
          codes.forEach((code: string) => {
            ambassadorCodes.push(code);
          })
          updateCodes(ambassadorCodes);
        })
        .catch((error: any) => {

        })
    }

  }, [history, api]);

  if (codes.length === 0)
  {
    return (<LoadComponent message={"Fetching ambassador codes..."} />);
  }

  return (
    <div className={clsx(classes.root)}>
      <CssBaseline />
      <Sidebar sidebarStatus={sidebar} sidebarToggle={sidebarToggle} />
      <main className={classes.content}>
        <Container maxWidth="lg" className={classes.container}>
          <HeaderComponent title="Settings" component="settings" sidebarToggle={sidebarToggle} />
          <Divider light style={{ marginBottom: '40px' }} />
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography variant="h5" gutterBottom>
                All Ambassador Codes
              </Typography>
              <ListComponent codes={codes}/> 
            </Grid>
            <Grid item>
              <Typography>hello world</Typography>
            </Grid>         
          </Grid>
        </Container>
      </main>
    </div>
  );
}

export default AmbassadorDataView;