import React from 'react';
import orders from '.';

// Purpose of this file is to create a new react context

// Create a new Context with inputs {Input Object} of type Api
const ordersContext: React.Context<orders> = React.createContext({} as orders);

export default ordersContext;