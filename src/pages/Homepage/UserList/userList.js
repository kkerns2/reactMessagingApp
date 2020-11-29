//=========================================================
//userList.js file
//Written By: Keegan Kerns
//Last Updated: Nov 27 2020
//Purpose: renders the text bar for entring messages
//==========================================================

import React, {Component} from "react";
import './userList.css'

class UserList extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      userList:[]
    }
  }
  //gets a complete list of users from the server
  async componentDidMount(){
    try{
      let res= await fetch('/contacts', {
        method:'post',
        headers:{
          'Accept': 'application/json',
          'Content-type': 'application/json'
        }
      });
      let result = await res.json();
      if(result && result.success){
        console.log(result.users);
        this.setState({userList: result.users});
      }
    }
    catch(e){
      console.log(e);
    }
  }
  //renders the list so that the user knows who they can messages
  render(){
    console.log(this.state.userList);
    return(
      <div className = "list">
        <ul className = "list-group" id= "contact-list">
        <p>Contacts</p>
        {this.state.userList.map((user) =>
          <li key= {(Math.random()* 20)} className="list-group-item">
            {user.username}
          </li>
        )}
        </ul>
      </div>
    )
  }

}
export default UserList;
