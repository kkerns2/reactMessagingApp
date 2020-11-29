//=========================================================
//manageAcct.js file
//Written By: Keegan Kerns
//Last Updated: Nov 27 2020
//Purpose: renders the manageAcctForm for modifiying
//         information and deleteing account
//==========================================================

import React, { useState, useRef, useEffect}from 'react';
import {Redirect, Link}   from 'react-router-dom'
import InputField   from '/home/bishop/Documents/Web_App/frontend/src/pages/login/inputfield'
import SubmitButton from '/home/bishop/Documents/Web_App/frontend/src/pages/login/submitButton'
import './manageAcct.css'

class ManageAcct extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      change_username: '',
      change_password: '',
      firstName: '',
      lastName:'',
      emailAddress: '',
      buttonDisabled: false,
      isLogout: false
    }
  }

async deleteAcct(){
  try{
    let res = await fetch('/delete', {
      method:'post',
      headers:{
        'Accept': 'application/json',
        'Content-type': 'application/json'
      }
    });
    let result = await res.json();
    if(result && result.success){
      alert(result.msg);
      this.doLogout();
    }
    else{
      alert(result.msg);
    }
  }
  catch(e){
    console.log(e);
  }
}

async doLogout(){
  try {
    let res = await fetch('/logout',{
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      }
    })
    let result = await res.json();
    if(result && result.success){
      localStorage.removeItem("token");
      localStorage.removeItem("UserID");
      this.setState({isLogout: true});
    }
    else{
      localStorage.removeItem("token");
      localStorage.removeItem("UserID");
    }

  }
  catch(e){
    console.log(e)
  }
}//logging out

resetForm(){
  this.setState({
    change_username: '',
    change_password: '',
    firstName: '',
    lastName: '',
    emailAddress:'',
    buttonDisabled: false
  });
}

setInputValue(property, val){
  val = val.trim();
  if(val.length > 20){
    return;
  }
  this.setState({
    [property]: val
  })
}//end of set input

async updateLogin(){
  if(!this.state.change_username){
    return
  }
  if(!this.state.change_password){
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

try {
  let res = await fetch('/manageAcct',{
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      change_username:     this.state.change_username,
      change_password:     this.state.change_password,
      firstName:           this.state.firstName,
      lastName:            this.state.lastName,
      emailAddress:        this.state.emailAddress
    })
  })
  let result = await res.json()
  if(result && result.success){
    alert(result.msg);
    this.resetForm();
    this.doLogout();
  }

  else if(result && result.success === false){
    this.resetForm();
    alert(result.msg);
  }
}
catch(e){
    console.log(e);
    this.resetForm();
}
}//end of update

render(){

  return(
    <div className = "container">
    Please fill ALL fields (if not applicable to change just type in what it is).
    <div className = "ManageAcct">
    <InputField
      type = 'text'
      placeholder = 'Update Username'
      value = {this.state.change_username ? this.state.change_username : ''}
      onChange = {(val) => this.setInputValue('change_username', val) }/>

    <InputField
      type = 'password'
      placeholder = 'Update password'
      value = {this.state.change_password ? this.state.change_password : ''}
      onChange = {(val) => this.setInputValue('change_password', val) }/>

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

    <SubmitButton
      text = 'Update'
      disabled = {this.state.buttonDisabled}
      onClick = {() => this.updateLogin()}
      />
    <Link to = {`/`}>
    <SubmitButton
      text = 'Delete Account'
      disabled = {this.state.buttonDisabled}
      onClick = {() => this.deleteAcct()}
      />
    </Link>
    <Link to={`/home`}>
    <SubmitButton
      text = {'Go back'}
      disabled = {this.state.buttonDisabled}
      />
    </Link>
    </div>
    </div>
    );
  }
}
export default ManageAcct
