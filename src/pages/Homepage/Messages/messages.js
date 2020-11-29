//=========================================================
//messages.js file
//Written By: Keegan Kerns
//Last Updated: Nov 27 2020
//Purpose: renders the messages
//==========================================================

import React, { useState, useRef, useEffect, Component} from 'react';
import InputField   from '/home/bishop/Documents/Web_App/frontend/src/pages/login/inputfield'
import SubmitButton from '/home/bishop/Documents/Web_App/frontend/src/pages/login/submitButton'
import './messages.css'

//Dummy test data going to use chat kit to finalize formatting

class Messages extends React.Component{
  //renders an indivdual message that is added to the messages list
  renderMessage(message){
    const {member, content} = message;
    const {currentMember} = this.props;
    const sender = member.username === currentMember.username;
    const className = sender ?
      "Messages-message currentMember" : "Messages-message";
      return(
        <li key= {(Math.random()* 20)} className = {className}>
          <span
            className="avatar"
            style = {{backgroundColor: member.color}}
            />
          <div className = "Message-content">
            <div className = "username">
              {member.username}
            </div>
            <div className = "text">{content}</div>
          </div>
        </li>
      );
  }

  //renders the message list for a specific chat
  render(){
    const {messages} = this.props;
    return (
      <ul className = 'messages-list'>
        {messages.map(m => this.renderMessage(m))}
      </ul>
    )
  }
}
export default Messages
