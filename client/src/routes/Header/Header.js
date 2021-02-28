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
        return <div><h2>props.username</h2><button onClick={this.props.logoutFunction}>Log Out</button></div>
      } else {
        return <div><h2>Welcome!</h2><button onClick={this.props.logoutFunction}>Log Out</button></div>
      }
    }else{
      return <div className="headerLogInButtons flexRow"><LogInButton toggleFunction={props.logInFunction} name="Log In"/><LogInButton toggleFunction={props.registerFunction} name="Register"/></div>
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
