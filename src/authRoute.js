//=========================================================
//authRoute.js file
//Written By: Keegan Kerns
//Last Updated: Nov 27 2020
//Purpose: Creates restricted Route for Router in App.js for
//         authentication purposes.
//==========================================================

import React from 'react';
import {Route, Redirect} from 'react-router-dom';

//takes in a path, and a component and checks the localStorage item called "token"
//if it fails then redirects back to root aka the login page
const authRoute = ({children, ...rest}) => {
  return(
    <Route
      {...rest}
      render={({ location }) =>
        localStorage.getItem("token") ? (
          children
        ):(
          <Redirect
            to={{pathname: '/',
            state: {from: location}
          }}
          />
        )
      }
    />
  );
};
export default authRoute;
