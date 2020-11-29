//=========================================================
//loginForm.js file
//Written By: Keegan Kerns
//Last Updated: Nov 27 2020
//Purpose: renders the login form for user to login.
//==========================================================

//imports
import React, { useState, useRef, useEffect} from 'react';
import {Link}       from 'react-router-dom'
import InputField   from './inputfield'
import SubmitButton from './submitButton'
import './LoginForm.css';

class LoginForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
      buttonDisabled: false
    }
  }

  resetForm(){
    this.setState({
      username: '',
      password: '',
      buttonDisabled: false
    })
  }//end of reset form


  setInputValue(property, val){
    val = val.trim();
    if(val.length > 20){
      return;
    }
    this.setState({
      [property]: val
    })
  }// formats the input


//makes request to the server to do authenication
  async doLogin(){
    if(!this.state.username){
      return;
    }
    if(!this.state.password){
      return;
    }
    this.setState({buttonDisabled: true});

    try {
      let res = await fetch('/login',{
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password
        })
      })
      let result = await res.json()
      if(result && result.success){
        localStorage.setItem("token", "T");
        localStorage.setItem("userID", result.username)
      }
      else if(result && result.success === false){
        localStorage.removeItem("token");
        this.resetForm();
        alert(result.msg)
      }
    }

    catch(e){
        console.log(e);
        localStorage.removeItem("token");
        this.resetForm();
    }

  }//end of doLogin()

//renders the createLogin Page
  render(){
    return (
      <div className = "container">
      <div className = "loginform">
        HEX CHAT
          <InputField
            type = 'text'
            placeholder = 'username'
            value = {this.state.username ? this.state.username : ''}
            onChange = {(val) => this.setInputValue('username', val) }/>

          <InputField
            type = 'password'
            placeholder = 'password'
            value = {this.state.password ? this.state.password : ''}
            onChange = {(val) => this.setInputValue('password', val) }/>

          <Link to ={`/home`}>
            <SubmitButton
              text = 'Login'
              disabled = {this.state.buttonDisabled}
              onClick = {() => this.doLogin()}
              />
          </Link>
          <Link to={`/createLogin`}>
            <SubmitButton
              text = {'Create Login'}
              disabled = {false}
              //onClick = {() => Userstore.createLogin = true}
              />
          </Link>
      </div>
      </div>
    );
  }
}

export default LoginForm;
