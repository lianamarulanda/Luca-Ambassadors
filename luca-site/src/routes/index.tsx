import React from 'react';
import {
    BrowserRouter,
    Route,
    Switch,
  } from 'react-router-dom';
import LoginView from '../views/LoginView';
import RegisterView from '../views/RegisterView';
import Dashboard from '../views/DashboardView';
import SettingsView from '../views/SettingsView';
import OrderView from '../views/OrderView';
import { DbContext } from '../util/api';
import VerifyEmailView from '../views/VerifyEmailView';
import LoadComponent from '../components/layout/LoadComponent';

const Routes = (): JSX.Element => {
  const [firebaseInitialized, setFirebaseInitialized] = React.useState(false);
  const api = React.useContext(DbContext);

  React.useEffect(() => {
    console.log("I got here");
    api.isInitialized().then(() => {
      console.log("I got here 2");
      setFirebaseInitialized(true);
    });
  });

  console.log('state: ' + firebaseInitialized);

  if (!firebaseInitialized) {
    return(<LoadComponent />)
  }

  return(
    <BrowserRouter>
      <Switch>
        <Route exact={true} path="/login" component={LoginView} />
        <Route exact={true} path="/register" component={RegisterView} />
        <Route exact={true} path="/dashboard" component={Dashboard} />
        <Route exact={true} path="/settings" component={SettingsView} />
        <Route exact={true} path="/order" component={OrderView} />
        <Route exact={true} path="/verify" component={VerifyEmailView} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;