import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import { Grid } from '@material-ui/core';
import { DbContext } from '../../util/api';
import TotalSales from './TotalSalesComponent'
import TotalCommission from './TotalCommissionsComponent'
import TotalCheckouts from './TotalCheckoutsComponent'
import MonthlyCommissionsComponent from './MonthlyCommissionsComponent'
import AnnouncementsComponent from './AnnouncementsComponent'
import TopProductsComponent from './TopProductsComponent'
import OrdersComponent from './OrdersComponent'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import HeaderComponent from '../layout/HeaderComponent';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton'
import InfoIcon from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';

const DashboardComponent = (props: any) => {
  const classes = useStyles();
  const api = React.useContext(DbContext);
  const [announcement, setOpen] = React.useState(true);
  const [banner, setBanner] = React.useState("");

  React.useEffect(() => {
    api.getBanner()
      .then((banner: string) => {
        setBanner(banner);
      })
      .catch(() => {
        // no banner was found.
      });
  }, []);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Container maxWidth="lg" className={classes.container}>
      {banner !== "" &&
        <Snackbar
          open={announcement}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          className={classes.snackbar}
        >
          <Alert onClose={handleClose} severity="info">
            <Typography variant="subtitle1" style={{ fontWeight: "bolder" }}>
              {banner}
            </Typography>
          </Alert>
        </Snackbar>
      }
      <HeaderComponent title="Dashboard" component="dashboard" style={{ marginBottom: '30px' }} sidebarToggle={props.sidebarToggle} />
      <Divider light style={{ marginBottom: '15px' }} />
      <Typography variant="h4" gutterBottom style={{ textAlign: 'left', fontWeight: 700, marginBottom: '30px' }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          xs={12}
          sm={4}
        >
          <TotalCheckouts data={props.data.totalCheckouts} />
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
        >
          <TotalSales data={props.data.totalSales} />
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
        >
          <TotalCommission data={props.data.totalCommissions} />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
        >
          <MonthlyCommissionsComponent data={props.data.monthlyCommissions}/>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
        >
          <TopProductsComponent data={props.data.productMap} />
        </Grid>
        <Grid container>
          <Grid item>
            <Typography variant="h4" style={{ fontWeight: 700, padding: '22px' }}>
              Your orders
            </Typography>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
        >
          <OrdersComponent data={props.data.userOrders} />
        </Grid>
        <Grid container>
          <Typography variant="h4" style={{ fontWeight: 700, padding: '22px' }}>
            Announcements
          </Typography>
          <Tooltip title={<Typography variant="subtitle1">Click on any announcement to learn more.</Typography>}>
            <IconButton style={{ marginLeft: '3px', marginTop: '8px' }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid
          item
          xs={12}
        >
          <AnnouncementsComponent data={props.adminStatus} />
        </Grid>
      </Grid>
    </Container>
  )
}

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  snackbar: {
    width: '100%'
  }
}))

export default DashboardComponent;
