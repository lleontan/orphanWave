import logo from './logo.svg';
import './App.css';
import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import Header from "./routes/Header/Header";
import Main from "./routes/Main";
import Backend from "./helper/Backend";
import Constants from './Constants';
//FAQ:
//WHEN SENDING CALLBACKS WITH FETCH OR DOWNSTREAM. WRAP WITH (DUMMY ARG)=>{FUNCYOUWANT(DUMMY ARG){}};
//
class App extends Component {
  loginSubmit(payload) {
    //Pass this down to the sidebar
    console.log("login attmpted",payload);

    this.state.backend.call("login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: payload.email,
        password:payload.password
      })
    }, (promise) => {
      //Save the auth token and resend to login.
      console.log("login returnedOkay");
    });
  }
  registrationSubmit(payload) {
    //Pass this down to the sidebar
    this.state.backend.call("registration", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: payload.targetRegistrationEmail,
        password:payload.targetRegistrationPassword,
        username:payload.targetRegistrationUsername
      })
    }, (promise) => {
      //Save the login token.
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      backend: new Backend(),
      apiResponse: "",
      logInSideBarOpen: false,
      logInSideBarStateLogIn: true,

    };

  }

  closeSidebar() {
    this.setState({logInSideBarOpen: false});
  }
  pingServer(resText) {
    this.setState({apiResponse: resText});
  }
  componentDidMount() {
    this.state.backend.callAPIText("status", {}, (input) => {
      this.pingServer(input)
    });
  }
  render() {
    return (<Router>
      <div>
        <Header loggedIn="false" logInFunction={() => {
            this.setState({logInSideBarOpen: true, logInSideBarStateLogIn: true});
          }} registerFunction={() => {
            this.setState({logInSideBarOpen: true, logInSideBarStateLogIn: false});
          }}/>
      </div>
      <Main logInSideBarOpen={this.state.logInSideBarOpen} logInSideBarStateLogIn={this.state.logInSideBarStateLogIn} closeSidebarFunction={() => {
          this.closeSidebar()
        }} loginSubmit={(payload)=>{this.loginSubmit(payload)}} registrationSubmit={(payload)=>{this.registrationSubmit(payload)}} />
      <div className="footer">
        <div>By lleontan</div>
        <p>API TEST:
          <span>{this.state.apiResponse}</span>
        </p>
      </div>
    </Router>);
  }
}

export default App;
