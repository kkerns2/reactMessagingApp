//=========================================================
//sendMsg.js file
//Written By: Keegan Kerns
//Last Updated: Nov 27 2020
//Purpose: renders the text bar for entring messages
//==========================================================

import React, { useState, useRef, useEffect, Component}from 'react';

class SendMsg extends React.Component{
  state={
    text:""
  }
  //detects change in the input bar
  onChange(e){
    this.setState({text: e.target.value})
  }
  //detects submission and sends the current state
  onSubmit(e){
    e.preventDefault();
    this.setState({text:""});
    this.props.onSendMessage(this.state.text);
  }
  //renders the textbar
  render(){
    return(
      <div className= "sendMsg">
        <form onSubmit={e => this.onSubmit(e)}>
          <input
            onChange = {(e) => this.onChange(e)}
            value= {this.state.text}
            placeholder = {this.props.placeholder}
            autoFocus = {true}
          />
          </form>
      </div>
    )
  }
}//end of sendMsg class

export default SendMsg;
