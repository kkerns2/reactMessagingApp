//=========================================================
//createLoginForm.js file
//Written By: Keegan Kerns
//Last Updated: Nov 27 2020
//Purpose: renders the login form for user to create a new login.
//==========================================================

//imports
import React, {useState, useRef, useEffect}from 'react';
import InputField   from '/home/bishop/Documents/Web_App/frontend/src/pages/login/inputfield'
import SubmitButton from '/home/bishop/Documents/Web_App/frontend/src/pages/login/submitButton'
import {Link}       from 'react-router-dom'
import './createLogin.css'

class CreateLoginForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      new_username: '',
      new_password: '',
      firstName: '',
      lastName: '',
      emailAddress:'',
      buttonDisabled: false,
      createLogin: true
    }
  }//end of constructor

  resetForm(){
    this.setState({
      new_username: '',
      new_password: '',
      firstName: '',
      lastName: '',
      emailAddress:'',
      buttonDisabled: false
    });
  }//end of reset form

  setInputValue(property, val){
    val = val.trim();
    if(val.length > 20){
      return;
    }
    this.setState({
      [property]: val
    })
  }//end of set input

//submits a request to the server via json.
  async submitNewLogin(){
    if(!this.state.new_username){
      return
    }
    if(!this.state.new_password){
      return
    }
    if(!this.state.firstName){
      return
    }
    if(!this.state.lastName){
      return
    }
    if(!this.state.emailAddress){
      return
    }

    this.setState({
      buttonDisabled: true
    })
//collects state information to then submit to the
//database conncection on the server
  try {
    let res = await fetch('/createLogin',{ //in router.js there is the req processing.
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        new_username:     this.state.new_username,
        new_password:     this.state.new_password,
        firstName:    this.state.firstName,
        lastName:     this.state.lastName,
        emailAddress: this.state.emailAddress
      })
    })
    let result = await res.json()
    if(result && result.success){
      this.setState({createLogin: true});
    }

    else if(result && result.success === false){
      this.resetForm()
      alert(result.msg)
    }
  }
  catch(e){
      console.log(e);
      this.resetForm();
  }
}


//renders the login form
render(){
  return (
    <div className = "container">
    <div className = "CreateLoginForm">
      HEX CHAT
        <InputField
          type = 'text'
          placeholder = 'New Username'
          value = {this.state.new_username ? this.state.new_username : ''}
          onChange = {(val) => this.setInputValue('new_username', val) }/>

        <InputField
          type = 'password'
          placeholder = 'New password'
          value = {this.state.new_password ? this.state.new_password : ''}
          onChange = {(val) => this.setInputValue('new_password', val) }/>

        <InputField
          type = 'text'
          placeholder = 'First Name'
          value = {this.state.firstName ? this.state.firstName : ''}
          onChange = {(val) => this.setInputValue('firstName', val) }/>

        <InputField
          type = 'text'
          placeholder = 'Last Name'
          value = {this.state.lastName ? this.state.lastName : ''}
          onChange = {(val) => this.setInputValue('lastName', val) }/>

        <InputField
          type = 'text'
          placeholder = 'Email Address'
          value = {this.state.emailAddress ? this.state.emailAddress : ''}
          onChange = {(val) => this.setInputValue('emailAddress', val) }/>
        <Link to={`/`}>
        <SubmitButton
          text = 'Submit'
          disabled = {this.state.buttonDisabled}
          onClick = {() => this.submitNewLogin()}
          />
        </Link>

        <Link to= {`/`}>
        <SubmitButton
          text = {'Go back'}
          disabled = {false}
          onClick = {() => this.setState({createLogin: false})}
          />
        </Link>
    </div>
    </div>
  );
  }
}//end of CreateLoginForm Class
export default CreateLoginForm;
