import React from 'react';
import {
    BrowserRouter,
    Route,
    Switch,
  } from 'react-router-dom';
import LoginView from '../views/LoginView';
import RegisterView from '../views/RegisterView';

const Routes = (): JSX.Element => {
    return(
      <BrowserRouter>
        <Switch>
          <Route exact={true} path="/login" component={LoginView} />
          <Route exact={true} path="/register" component={RegisterView} />
        </Switch>
      </BrowserRouter>
    );
};

export default Routes;