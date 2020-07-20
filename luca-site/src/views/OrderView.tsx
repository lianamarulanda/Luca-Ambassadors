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

  React.useEffect(() => {
    if (!api.isLoggedIn()) {
      history.push('/login');
    } 
  }, [history, api]);

  return (
    <div className={clsx(classes.root)}>
      <CssBaseline />
      <Sidebar />
      <main className={classes.content}>
        <Container maxWidth="lg" className={classes.container}>
          <HeaderComponent title="Order Accessories" component="order"/>
          <Divider light/>
          <OrderComponent />
        </Container>
      </main>
    </div>
  );
}

export default OrderView;


