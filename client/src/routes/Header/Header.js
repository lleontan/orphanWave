import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import LogInButton from '../../components/LogInButton';
class Header extends Component {
  constructor(props){
    super(props);
  }
  renderLoggedInOptions(props){
    if(props.loggedIn===true){
      if (props.username) {
        return <h2>props.username</h2>
      } else {
        return <h2>Welcome!</h2>
      }
    }else{
      return <div className="headerLogInButtons"><LogInButton toggleFunction={props.logInFunction} name="Log In"/><span><LogInButton toggleFunction={props.registerFunction} name="Register"/></span></div>
    }
  }
  render() {
    return (<div className="header">
      <div className="flexRow">
        <img src="/logo192.png"></img>
        <h1>Orphan Wave</h1>
      </div>
      {this.renderLoggedInOptions(this.props)}
    </div>);
  }
}

export default Header;
