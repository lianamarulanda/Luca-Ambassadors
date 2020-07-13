import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import { Grid } from '@material-ui/core';
import Sidebar from '../components/layout/SidebarComponent'
import TotalSales from '../components/dashboard/TotalSalesComponent'
import TotalCommission from '../components/dashboard/TotalCommissionsComponent'
import TotalCheckouts from '../components/dashboard/TotalCheckoutsComponent'
import MonthlyCommissionsComponent from '../components/dashboard/MonthlyCommissionsComponent'
import TopProductsComponent from '../components/dashboard/TopProductsComponent'
import OrdersComponent from '../components/dashboard/OrdersComponent'
import { useHistory } from 'react-router-dom'
import { DbContext } from '../util/api';
import LoadComponent from '../components/layout/LoadComponent';

const App: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const api = React.useContext(DbContext);
  const [loaded, setLoaded] = React.useState(false);
  const [dashboardData, setDashboardData] = React.useState({} as any);

  React.useEffect(() => {
    if (!api.isLoggedIn()) {
      console.log("THIS USER IS NOT LOGGED IN?");
      history.push('/login');
    } else {
      if (!loaded) {
        getDashboardData();
      }
    }
  }, [history, api]);

  const getDashboardData = async () => {
    var dashboardData = await api.loadDashboardData();
    setDashboardData(dashboardData);
    setLoaded(true);
  }

  // debug
  console.log(dashboardData);

  if (!loaded) {
    return(<LoadComponent />)
  }

  return (
    <div className={clsx(classes.root)}>
      <CssBaseline />
      <Sidebar />
      <main className={classes.content}>
        <Container maxWidth="lg" className={classes.container}>
          <Typography variant="h4" gutterBottom style={{textAlign: 'left', fontWeight: 700, marginBottom:'30px'}}>
          Overview
          </Typography>
          <Grid
            container
            spacing={4}
          >
            <Grid
              item
              lg={4}
              sm={6}
              xl={3}
              xs={12}
            >
              <TotalCheckouts />
            </Grid>
            <Grid
              item
              lg={4}
              sm={6}
              xl={3}
              xs={12}
            >
              <TotalSales />  
            </Grid>
            <Grid
              item
              lg={4}
              sm={6}
              xl={3}
              xs={12}
            > 
              <TotalCommission />
            </Grid>
            <Grid
              item
              lg={6}
              md={12}
              xl={9}
              xs={12}
            >
              <MonthlyCommissionsComponent />
            </Grid>
            <Grid
              item
              lg={6}
              md={6}
              xl={3}
              xs={12}
             
            >
              <TopProductsComponent />
            </Grid>
            <Grid container>
              <Grid item>
                <Typography variant="h4" style={{fontWeight: 700, padding:'22px'}}>
                Your orders
                </Typography>
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
            >
              <OrdersComponent />
            </Grid>
            {/* <Grid
              item
              lg={8}
              md={12}
              xl={9}
              xs={12}
            >
            </Grid> */}
          </Grid>
        </Container>
      </main>
    </div>
  )
}

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
}))

export default App
