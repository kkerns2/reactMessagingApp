//=========================================================
//inputfield.js file
//Written By: Keegan Kerns
//Last Updated: Nov 27 2020
//Purpose: renders the input bars for many of the Form components
//==========================================================
import React, { useState, useRef, useEffect}from 'react';

class InputField extends React.Component{
  render(){
    return (
      <div className = "inputField">

        <input
          className = 'input'
          type= {this.props.type}
          placeholder= {this.props.placeholder}
          value = {this.props.value}
          onChange = {(e) =>this.props.onChange(e.target.value)}
          onKeyPress= {this.keyPress}
          />
      </div>
    );
  }
}

export default InputField;
