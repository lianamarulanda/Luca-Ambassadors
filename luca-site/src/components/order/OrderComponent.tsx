import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Sidebar from '../layout/SidebarComponent';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddressComponent from './AddressComponent';
import PackageComponent from './PackageComponent';
import ReviewComponent from './ReviewComponent';
import { ordersContext } from '../../util/orders';
import { DbContext } from '../../util/api';

const useStyles = makeStyles((theme) => ({
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
    color: 'white',
    backgroundColor: '#427340',
    '&:hover': {
      color: 'white',
      backgroundColor: '#2E5941'
    }
  },
  stepperIcon: {
    color: "#2E5941",
    "&$activeIcon": {
      color: "#8CA888"
    },
    "&$completedIcon": {
      color: "#8CA888"
    }
  },
  activeIcon: {}, //needed so that the &$active tag works
  completedIcon: {},
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
  const [reload, setReload] = React.useState(false);

  React.useEffect(() => {
    if (allProducts.length === 0) {
      dbApi.getAllProducts()
        .then((products) => {
          updateAllProducts(products);
        });
    }
  }, []);

  const setActiveStep = (step: number) => { 
    updateState({
      ...orderData, // gets current state values, prevents from resetting key-val pair
      activeStep: step
    });   
  };
  
  const handleNext = () => {
    if (orderData.activeStep === 0) {
      if (orderData.address1 === "" || orderData.city === "" || orderData.province === "" || orderData.zip === "" || orderData.country === "") {
        orderApi.addressError = true;
        setReload(!reload);
      } else {
        // update address in order api
        orderApi.orderRequest.order.shipping_address.address1 = orderData.address1;
        orderApi.orderRequest.order.shipping_address.address2 = orderData.address2;
        orderApi.orderRequest.order.shipping_address.city = orderData.city;
        orderApi.orderRequest.order.shipping_address.province = orderData.province;
        orderApi.orderRequest.order.shipping_address.zip = orderData.zip;
        orderApi.orderRequest.order.shipping_address.country = orderData.country;
        orderApi.addressError = false; 
        setActiveStep(orderData.activeStep + 1);
      }
    } else if (orderData.activeStep === 1) {
      if (orderApi.orderRequest.order.line_items.length === 0) {
        orderApi.productError = true;
        setReload(!reload);
      } else {
        orderApi.productError = false;
        orderApi.orderRequest.order.customer.first_name = dbApi.userData.firstName;
        orderApi.orderRequest.order.customer.last_name = dbApi.userData.lastName;
        orderApi.orderRequest.order.customer.email = dbApi.userData.email;
        orderApi.orderRequest.order.email = dbApi.userData.email;
        setActiveStep(orderData.activeStep + 1);
      }
    } else if (orderData.activeStep === 2) {
      dbApi.placeOrder(orderApi.orderRequest).then((orderNum: any) => {
        orderApi.orderNumber = orderNum;
        setActiveStep(orderData.activeStep + 1);
      });
    }
  };

  const handleBack = () => {
    if (orderData.activeStep === 1)
      orderApi.productError = false;
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
        return <AddressComponent handleChange={handleAddress} {...orderData} />;
      case 1: {
        return <PackageComponent {...allProducts}  />;
      }
      case 2: {
        return <ReviewComponent {...orderData} />;
      }
      default:
        throw new Error('Unknown step');
    }
  }

  return (
    <React.Fragment>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          { orderApi.addressError  && 
          <div>
            <Typography variant="overline" color="error" display="block" gutterBottom>
            Please fill out ALL required fields!
            </Typography>
          </div>
          }
          { orderApi.productError && 
          <div>
            <Typography variant="overline" color="error" display="block" gutterBottom>
            Please select a product!
            </Typography>
          </div>
          }
          <Typography component="h1" variant="h4" align="center" style={{fontFamily: 'helvetica'}}>
            Order Monthly Package 
          </Typography>
          <Stepper activeStep={orderData.activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel 
                  StepIconProps={{ 
                    classes:{ 
                      root: classes.stepperIcon,
                      active: classes.activeIcon,
                      completed: classes.completedIcon
                    } 
                  }}
                >
                  {label}
                </StepLabel>
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
                  Your order number is #{orderApi.orderNumber}. We have emailed your order confirmation, and will
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
      </main>
    </React.Fragment>
  );
}