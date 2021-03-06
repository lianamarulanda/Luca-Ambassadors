import React from 'react';
import OrderComponent from '../components/order/OrderComponent'; // index needed?
import Sidebar from '../components/layout/SidebarComponent'
import { makeStyles } from '@material-ui/core/styles'
import { CssBaseline } from '@material-ui/core';
import Container from '@material-ui/core/Container'
import clsx from 'clsx'
import { DbContext } from '../util/api';
import { useHistory } from 'react-router-dom';
import HeaderComponent from '../components/layout/HeaderComponent';
import Divider from '@material-ui/core/Divider';
import TierComponent from '../components/order/TierComponent';
import LoadComponent from '../components/layout/LoadComponent';
import VerifyComponent from '../components/order/VerifyComponent';
import HighSalesTierComponent from '../components/order/HighSalesTier';
import OrderLater from '../components/order/OrderLater';

const useStyles = makeStyles((theme: any) => ({
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
}));


function OrderView() {
  const classes = useStyles();
  const api = React.useContext(DbContext);
  const history = useHistory();
  const [component, updateComponent] = React.useState("TierComponent");
  const [loaded, setLoaded] = React.useState(false);
  const [sidebar, updateSidebar] = React.useState(false);

  const sidebarToggle = () => {
    updateSidebar(!sidebar);
  }

  React.useEffect(() => {
    if (!api.isLoggedIn()) {
      history.push('/login');
    } else {
      if (!api.checkEmailVerification()) {
        updateComponent("VerifyComponent");
        setLoaded(true);
      } else if (api.userData.influencerStatus) {
        api.getBiMonthlyStatus().then((canOrder: boolean) => {
          console.log("Can order: " + canOrder);
          if (canOrder)
            updateComponent("OrderComponent");
          else {
            updateComponent("OrderLater");
          }
          setLoaded(true);
        })
        .catch((error: any) => {
          setLoaded(true);
        })
      } else {
        setLoaded(true);
      }
    }
  }, [history, api]);

  // only gets called when we claim free gift
  const changeComponent = (component: string) => {

    if (parseInt(api.userData.currTier) >= 4)
      updateComponent("HighSales");
    else
      updateComponent(component);
  }

  if (!loaded) {
    return (<LoadComponent />);
  }

  return (
    <div className={clsx(classes.root)}>
      <CssBaseline />
      <Sidebar sidebarStatus={sidebar} sidebarToggle={sidebarToggle} />
      <main className={classes.content}>
        <Container maxWidth="lg" className={classes.container}>
          <HeaderComponent title="Order Accessories" component="order" sidebarToggle={sidebarToggle} />
          <Divider light />
          {component === "VerifyComponent" &&
            <VerifyComponent />
          }
          {component === "OrderComponent" &&
            <OrderComponent />
          }
          {component === "TierComponent" &&
            <TierComponent changeComponent={changeComponent} />
          }
          {component === "HighSales" &&
            <HighSalesTierComponent />
          }
          {component === "OrderLater" &&
            <OrderLater />
          }
        </Container>
      </main>
    </div>
  );
}

export default OrderView;


