import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
import LoadComponent from '../layout/LoadComponent';
import VerifyComponent from './VerifyComponent';
import { useHistory } from 'react-router-dom';

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
  address2: "",
  city: "",
  province: "",
  zip: "",
  country: "",
});

export default function OrderComponent(props: any) {
  const classes = useStyles();
  const orderApi = React.useContext(ordersContext);
  const dbApi = React.useContext(DbContext);
  const [orderData, updateState] = React.useState(orderState);
  const [allProducts, updateAllProducts] = React.useState([] as object[]);
  const [error, setError] = React.useState("");
  const [loaded, setLoaded] = React.useState(false);
  const [loadMessage, setMessage] = React.useState("Fetching products...");
  const history = useHistory();

  React.useEffect(() => {
    if (allProducts.length === 0) {
      dbApi.getAllProducts()
        .then((products) => {
          updateAllProducts(products);
          setLoaded(true);
        })
        .catch((error: any) => {
          history.push('/error');
        });
    }
  }, []);

  const setActiveStep = (step: number) => {
    updateState({
      ...orderData,
      activeStep: step
    });
  };

  const handleAddress = (event: any) => {
    updateState({
      ...orderData,
      [event.target.name]: event.target.value.trim()
    });
  };

  function submitAddress(): boolean {
    if (orderData.address1 === "" || orderData.city === "" || orderData.province === "" || orderData.zip === "" || orderData.country === "") {
      setError("Please fill out ALL required fields!");
      return false;
    } else {
      orderApi.orderRequest.order.shipping_address.first_name = dbApi.userData.firstName;
      orderApi.orderRequest.order.shipping_address.last_name = dbApi.userData.lastName;
      orderApi.orderRequest.order.shipping_address.address1 = orderData.address1;
      orderApi.orderRequest.order.shipping_address.address2 = orderData.address2;
      orderApi.orderRequest.order.shipping_address.city = orderData.city;
      orderApi.orderRequest.order.shipping_address.province = orderData.province;
      orderApi.orderRequest.order.shipping_address.zip = orderData.zip;
      orderApi.orderRequest.order.shipping_address.country = orderData.country;
      setError("");
      return true;
    }
  }

  function submitProducts(): boolean {
    if (orderApi.orderRequest.order.line_items.length === 0) {
      setError("Please select a product!");
      return false;
    } else {
      orderApi.orderRequest.order.customer.first_name = dbApi.userData.firstName;
      orderApi.orderRequest.order.customer.last_name = dbApi.userData.lastName;
      orderApi.orderRequest.order.customer.email = dbApi.userData.email;
      orderApi.orderRequest.order.email = dbApi.userData.email;
      orderApi.orderRequest.order.discount_codes[0].amount = orderApi.subtotal.toString();
      orderApi.orderRequest.order.total_discounts = orderApi.subtotal.toString();
      setError("");
      return true;
    }
  }

  const placeOrder = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (orderApi.orderRequest.order.line_items.length === 0) {
        setError("Please select at least one product!");
        resolve(false);
      } else {
        setError("");
        setMessage("Placing order... do not refresh the page.");
        setLoaded(false);
        dbApi.placeOrder(orderApi.orderRequest).then((orderNum: any) => {
          orderApi.orderNumber = orderNum;
          setLoaded(true);
          resolve(true);
        })
          .catch((error: any) => {
            setError("An error occurred with placing the order!");
            setLoaded(true);
            resolve(false);
          })
      }
    });
  }

  const handleNext = async () => {
    if (orderData.activeStep === 0) {
      if (submitAddress())
        setActiveStep(orderData.activeStep + 1);
    } else if (orderData.activeStep === 1) {
      if (submitProducts())
        setActiveStep(orderData.activeStep + 1);
    } else if (orderData.activeStep === 2) {
      if (await placeOrder())
        setActiveStep(orderData.activeStep + 1);
    }
  };

  const handleBack = () => {
    if (error !== "")
      setError("");
    setActiveStep(orderData.activeStep - 1);
  };

  const getStepContent = (step: any) => {
    switch (step) {
      case 0:
        return <AddressComponent handleChange={handleAddress} {...orderData} />;
      case 1: {
        return <PackageComponent {...allProducts} />;
      }
      case 2: {
        return <ReviewComponent {...orderData} />;
      }
      default:
        throw new Error('Unknown step');
    }
  }

  if (!loaded) {
    return (<LoadComponent message={loadMessage} />);
  }

  return (
    <React.Fragment>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          {error !== "" &&
            <div>
              <Typography variant="overline" color="error" display="block" gutterBottom>
                {error}
              </Typography>
            </div>
          }
          <Stepper activeStep={orderData.activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel
                  StepIconProps={{
                    classes: {
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
                  Thank you for your order, {dbApi.userData.firstName}!
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