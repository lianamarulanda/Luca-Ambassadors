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
import TopProductsComponent from './TopProductsComponent'
import OrdersComponent from './OrdersComponent'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

const App: React.FC = () => {
  const classes = useStyles();
  const api = React.useContext(DbContext);
  const [announcement, setOpen] = React.useState(true);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  // character limit of alert message is 80 for staying on one line
  return (
    <Container maxWidth="lg" className={classes.container}>
      <Snackbar 
        open={announcement} 
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal:'center'}}
        >
          <Alert onClose={handleClose} severity="info">
            <Typography variant="subtitle1" style={{fontWeight: "bolder"}}> 
              Next week there is a sale! Some text :) Helloooooo announcement here announcing!
            </Typography>
          </Alert>
      </Snackbar>
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
}))

export default App
