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
import ResetPassView from '../views/ResetPassView';
import MediaView from '../views/MediaView';

const Routes = (): JSX.Element => {
  const [firebaseInitialized, setFirebaseInitialized] = React.useState(false);
  const api = React.useContext(DbContext);

  React.useEffect(() => {
    api.isInitialized().then(() => {
      setFirebaseInitialized(true);
    });
  });

  if (!firebaseInitialized) {
    return(<LoadComponent />)
  }

  return(
    <BrowserRouter>
      <Switch>
        <Route exact={true} path="/" component={Dashboard} />
        <Route exact={true} path="/login" component={LoginView} />
        <Route exact={true} path="/register" component={RegisterView} />
        <Route exact={true} path="/dashboard" component={Dashboard} />
        <Route exact={true} path="/settings" component={SettingsView} />
        <Route exact={true} path="/order" component={OrderView} />
        <Route exact={true} path="/verify" component={VerifyEmailView} />
        <Route exact={true} path="/resetpassword" component={ResetPassView} />
        <Route exact={true} path="/download" component={MediaView} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;