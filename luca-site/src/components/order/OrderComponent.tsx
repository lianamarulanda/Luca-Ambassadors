import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import AddressComponent from './AddressComponent';
import PackageComponent from './PackageComponent';
import ReviewComponent from './ReviewComponent';
import { ordersContext } from '../../util/orders';
import { DbContext } from '../../util/api';


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const steps = ['Shipping address', 'Select items', 'Review your order'];

const orderState = Object.freeze({
  activeStep: 0,
  address1: "",
  address2 : "",
  city: "",
  province: "",
  zip: "",
  country: "",
});

export default function OrderComponent() {
  const classes = useStyles();
  const orderApi = React.useContext(ordersContext);
  const dbApi = React.useContext(DbContext);
  const [orderData, updateState] = React.useState(orderState);
  const [allProducts, updateAllProducts] = React.useState([] as object[]);

  React.useEffect(() => {
    dbApi.getAllProducts()
      .then((products) => {
        updateAllProducts(products);
      });
  });

  const setActiveStep = (step: number) => {
    
    updateState({
      ...orderData, // gets current state values, prevents from resetting key-val pair

      activeStep: step
    });
    if (step === 1)
    {
      // update address in order api
      orderApi.orderRequest.order.shipping_address.address1 = orderData.address1;
      orderApi.orderRequest.order.shipping_address.address2 = orderData.address2;
      orderApi.orderRequest.order.shipping_address.city = orderData.city;
      orderApi.orderRequest.order.shipping_address.province = orderData.province;
      orderApi.orderRequest.order.shipping_address.zip = orderData.zip;
      orderApi.orderRequest.order.shipping_address.country = orderData.country;
      orderApi.printRequest();
    }
  };

  const handleNext = () => {
    if (orderData.activeStep === 0) {
      if (orderData.address1 === "" || orderData.city === "" || orderData.province === "" || orderData.zip === "" || orderData.country === "") {
        console.log("please fill out all fields!"); 
      } else {
      setActiveStep(orderData.activeStep + 1);
      }
    } else if (orderData.activeStep === 1) {
      if (orderApi.orderRequest.order.line_items.length === 0) {
        console.log("please select at least one item!");
      } else {
        setActiveStep(orderData.activeStep + 1);
      }
      
    }
  };

  const handleBack = () => {
    setActiveStep(orderData.activeStep - 1);
  };

  const handleAddress = (event: any) => {
    updateState({
        ...orderData,

        [event.target.name]: event.target.value.trim()
    });
  };

  const getStepContent= (step: any) => {
    switch (step) {
      case 0:
        return <AddressComponent handleChange={handleAddress} />;
      case 1: {
        return <PackageComponent />;
      }
      case 2: {
        console.log(orderData);
        return <ReviewComponent {...orderData} />;
      }
      default:
        throw new Error('Unknown step');
    }
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="absolute" color="default" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Company name
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Order Accessories Package 
          </Typography>
          <Stepper activeStep={orderData.activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {orderData.activeStep === steps.length ? (
              <React.Fragment>
                <Typography variant="h5" gutterBottom>
                  Thank you for your order.
                </Typography>
                <Typography variant="subtitle1">
                  Your order number is #2001539. We have emailed your order confirmation, and will
                  send you an update when your order has shipped.
                </Typography>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {getStepContent(orderData.activeStep)}
                <div className={classes.buttons}>
                  {orderData.activeStep !== 0 && (
                    <Button onClick={handleBack} className={classes.button}>
                      Back
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {orderData.activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                  </Button>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>
        <Copyright />
      </main>
    </React.Fragment>
  );
}