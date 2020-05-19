import React from 'react';
import Api from '.';

// Purpose of this file is to create a new react context

// Create a new Context with inputs {Input Object} of type Api
const DbContext: React.Context<Api> = React.createContext({} as Api);

export default DbContext;