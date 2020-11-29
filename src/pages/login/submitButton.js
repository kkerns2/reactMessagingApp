//=========================================================
//submitButton.js file
//Written By: Keegan Kerns
//Last Updated: Nov 27 2020
//Purpose: renders the buttons for many of the forms
//==========================================================

import React, { useState, useRef, useEffect} from 'react';

class SubmitButton extends React.Component{
  render(){
    return (
      <div className = "submitButton">
        <button
          className = 'btn'
          disabled = {this.props.disabled}
          onClick = {() => this.props.onClick()}
        >
          {this.props.text}
        </button>
      </div>
    );
  }
}

export default SubmitButton;
