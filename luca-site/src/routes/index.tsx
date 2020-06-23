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

const Routes = (): JSX.Element => {
    return(
      <BrowserRouter>
        <Switch>
          <Route exact={true} path="/login" component={LoginView} />
          <Route exact={true} path="/register" component={RegisterView} />
          <Route exact={true} path="/dashboard" component={Dashboard} />
          <Route exact={true} path="/settings" component={SettingsView} />
          <Route exact={true} path="/order" component={OrderView} />
        </Switch>
      </BrowserRouter>
    );
};

export default Routes;