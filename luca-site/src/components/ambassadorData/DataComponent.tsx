import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { Grid } from '@material-ui/core';
import TotalSales from '../dashboard/TotalSalesComponent'
import TotalCommission from '../dashboard/TotalCommissionsComponent'
import TotalCheckouts from '../dashboard/TotalCheckoutsComponent'
import MonthlyCommissionsComponent from '../dashboard/MonthlyCommissionsComponent'
import TopProductsComponent from '../dashboard/TopProductsComponent'
import Divider from '@material-ui/core/Divider';


const DataComponent = (props: any) => {
  const classes = useStyles();

  return (
    <Container maxWidth="md" className={classes.container}>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          xs={12}
          sm={4}
        >
          <TotalCheckouts />
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
        >
          <TotalSales />
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
        >
          <TotalCommission />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
        >
          <MonthlyCommissionsComponent />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
        >
          <TopProductsComponent />
        </Grid>
      </Grid>
    </Container>
  )
}

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}))

export default DataComponent;
