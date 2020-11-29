//=========================================================
//homePage.js file
//Written By: Keegan Kerns
//Last Updated: Nov 27 2020
//Purpose: renders the homePage for the user to send messages and edit their account
//==========================================================


import React, { useState, useRef, useEffect}from 'react';
import {TextInput, Text, View} from 'react-native-web'
import {BrowserRouter as Router, Route, Redirect, Link}   from 'react-router-dom'
import InputField   from '/home/bishop/Documents/Web_App/frontend/src/pages/login/inputfield'
import SubmitButton from '/home/bishop/Documents/Web_App/frontend/src/pages/login/submitButton'
import io           from 'socket.io-client'
import Messages     from '/home/bishop/Documents/Web_App/frontend/src/pages/Homepage/Messages/messages'
import SendMsg      from '/home/bishop/Documents/Web_App/frontend/src/pages/Homepage/Messages/sendMsg'
import UserList     from '/home/bishop/Documents/Web_App/frontend/src/pages/Homepage/UserList/userList'
import './homepage.css'
import '/home/bishop/Documents/Web_App/frontend/src/pages/Homepage/Messages/messageFeed.css'

let socket; //this is the socket for the client

class HomePage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isLogout : false,
      loading: true,
      buttonDisabled: false,
      manageAcct: false,
      messages:[],
      member: {
        username: localStorage.getItem("userID"),
        color: this.randomColor(),
      },
      id: this.findID(),
      currentChatId: '',
      userEntry: ''
    }
  }

  componentDidMount(){
    //establishes a new socket and creates the connection to the server.
      socket = io('localhost:5000');//for mobile you may have to switch to ip address
      const id = this.state.member.username;
      socket.emit("login", id);
  }

  componentDidUpdate(){
    //awaits incoming messages from another user. It will allocate the field currentChatId
    //with their contact info for replies.
    socket.on("message", (messages, id) => {
      this.setState({currentChatId: id});
      console.log(this.state.currentChatId);
      this.setState({messages: messages});
    });
  }

  componentWillUnmount(){
    //removes the socket from the list of connected sockets
    socket.emit("logout", this.state.id);
  }
//logs the user out by destroying their session that is logged in the DB and
//sends them back to the login screen by making a request to the server.
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

//finds the users ID from session data
  async findID(){
    try{
      let res = await fetch('/getID',{
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
        }
      })
      let result = await res.json();
      if(result.success && result.id != null){
        this.setState({id: result.id});
        console.log(result.id)
      }
    }
    catch(e){
      console.log(e)
    }
  }
  //sends message to the desired user using socket io
  onSendMessage = (message) =>{
    const messages = this.state.messages;
    messages.push({
      content: message,
      member: this.state.member
    })
    console.log(messages)
    socket.emit("message", messages, this.state.currentChatId);
    this.setState({messages: messages});
  }

  //sends user to the manage account screen which is only available if logged in.
  async manageAcct(){

    this.setState({
      buttonDisabled: true
    });

    this.setState({
      manageAcct: true
    });
  }

  //avatar color
  randomColor(){
      return '#' + Math.floor(Math.random()* 0xFFFFFF).toString(16);
    }

  //cleans up the users entry for easy searching
  setInputValue(property, val){
    val = val.trim();
    this.setState({
      [property]: val
    })
  }
  //used for finding the recipient that you want to send a messages to
  async saveReciptient(){
    try{
      let res = await fetch("/findID", {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json'
        },
        body:JSON.stringify({
          recipient: this.state.currentChatId
        })
      })
      let result = await res.json();
      if(result.username === this.state.currentChatId){
        this.setState({currentChatId: this.state.currentChatId});
        this.setState({buttonDisabled: true});
      }
      else{
        alert(result.msg);
      }

    }
    catch(e){
      console.log(e);
    }
  }
  //ends the conversation and clears the screen of old messages from that chat.
  async exit(){
    this.setState({buttonDisabled: false });
    this.setState({messages:[]});
    this.setState({currentChatId: ''});
  }
  //renders the homepage
  render(){
    if(this.state.isLogout){
      return <Redirect to= '/'/>
    }
    else{
      return (
            <div className = "HomePage">
              <div className = "contacts">
                <UserList/>
                </div>
              <div className= "MessageFeed">
                <Messages
                  messages={this.state.messages}
                  currentMember={this.state.member}
                  />
                <SendMsg
                  onSendMessage={this.onSendMessage}
                  placeholder = "Enter a message... "
                  />
                </div>
                <div className = "userEntry" align= "center">
                  <InputField
                    type = 'text'
                    placeholder = 'Search User'
                    value = {this.state.currentChatId ? this.state.currentChatId : ''}
                    onChange = {(val) => this.setInputValue('currentChatId', val) }/>

                  <SubmitButton
                    text = 'Start Chat'
                    disabled = {this.state.buttonDisabled}
                    onClick = {() => this.saveReciptient()}
                  />

                  <SubmitButton
                    text = 'Exit Conversation'
                    disabled = {false}
                    onClick = {() => this.exit()}
                  />
              </div>
              <div className = "accountButtons">
                <Link to= {`/manageAcct`}>
                  <SubmitButton
                    text = 'Manage Account'
                    disabled = {false}
                    onClick = {() => this.manageAcct()}
                    />
                  </Link>

                <Link to ={`/`}>
                  <SubmitButton
                    text = 'Log out'
                    disabled = {this.state.buttonDisabled}
                    onClick = {() => this.doLogout()}
                    />
                </Link>
              </div>
            </div>
      );
    }
  }
}
export default HomePage
