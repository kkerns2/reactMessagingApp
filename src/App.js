//=========================================================
//App.js file
//Written By: Keegan Kerns
//Last Updated: Nov 27 2020
//Purpose: Servers as main start point for Messaging app
//==========================================================


//imports
import React, {useState, useRef, useEffect}  from 'react';
import {BrowserRouter as Router, Route, Link}      from 'react-router-dom'
import { observer }                          from 'mobx-react'
import LoginForm                             from './pages/login/loginForm'
import SubmitButton                          from './pages/login/submitButton'
import CreateLoginForm                       from './pages/create_login/createLoginForm';
import HomePage                              from './pages/Homepage/HomePageForm/homepage'
import ManageAcct                            from './pages/manage_acct/manageAcct'
import AuthRoute                             from './authRoute'
import './App.css'

//when making changes here please run npm build then paste updated folder to the back end to apply changes

class App extends React.Component {

  state = {
    isLoggedIn: false
  }

//When component Instanciates componentDidMount() serves as state checker
  async componentDidMount(){
    //communicates to the server about if the page is logged in or not. Used for peristance sessions
    try {
      let res = await fetch('/isloggedIn',{
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      let result = await res.json();
      if(result && result.success){
        const persistState = localStorage.getItem("token");
        this.setState({isLoggedIn: true});
        if(persistState){
          try{
            this.setState(JSON.parse(persistState));
          }catch(e){}
        }
      }
      else{
        this.setState({isLoggedIn: false});
        localStorage.removeItem("token");
        localStorage.removeItem("userID");
      }

    }
    catch(e){
      this.setState({isLoggedIn: false});
      localStorage.removeItem("token");
      localStorage.removeItem("userID");
    }
  }//logging in

//render function creates the Router for the rest of the system. That way user can navigate to each componenet
  render(){
    return(
    <Router>
      <Route path= '/' exact component = {LoginForm}/>
      <Route path= '/createLogin' exact component= {CreateLoginForm}/>
      <AuthRoute path= '/home'>
        <HomePage/>
      </AuthRoute>
      <AuthRoute path= '/manageAcct'>
        <ManageAcct/>
      </AuthRoute>
    </Router>
    );
  }//end of render
}//end of App class

export default observer(App);
