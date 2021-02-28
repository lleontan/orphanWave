import logo from './logo.svg';
import './App.css';
import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import Header from "./routes/Header/Header";
import Main from "./routes/Main";
import Backend from "./helper/Backend";
import Constants from './Constants';
//FAQ:
// - WHEN SENDING CALLBACKS WITH FETCH OR DOWNSTREAM. WRAP WITH (DUMMY ARG)=>{FUNCYOUWANT(DUMMY
// ARG){}};
//- Errors are always strings unless otherwise specified
//- Success replies are always obj:message + whatever unless other wise specified
class App extends Component {

  //Gets the email and username if the user is currently loggedIn. As json
  getUser() {
    this.state.backend.call("userdata", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((results) => {
      console.log("User:", results);
      this.state.user = results;
      this.state.loggedIn = true;

    }).catch((error) => {
      console.log("", error);
      this.state.loggedIn = false;
    });
  }
  logout() {
    this.state.backend.call("logout", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((results) => {
      console.log("Logged out:", results);
      this.state.loggedIn = false;
    }).catch((error) => {
      console.log("Not logged out:", error);
    });
  }
  checkLoggedIn() {
    //depreciated
    this.state.backend.call("session", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((results) => {
      console.log("session okay:", results);
      this.state.loggedIn = true;
    }).catch((error) => {
      console.log("Not logged in:", error);
      this.state.loggedIn = false;
    });
  }
  loginSubmit(payload) {
    //Pass this down to the sidebar
    console.log("login attmpted", payload);
    this.state.backend.call("login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: payload.email, password: payload.password})
    }).then((results) => {
      console.log("login returned okay", results);
      this.getUser();
    }).catch((error) => {
      console.log("Not logged in:", error);
    });
  }
  registrationSubmit(payload) {
    //Pass this down to the sidebar
    //console.log(payload);
    let jsonPayload=JSON.stringify(
      {email: payload.email, password: payload.password, confirmPassword: payload.confirmPassword, username: payload.username}
    );
    console.log(jsonPayload);
    this.state.backend.call("register", {
      crossDomain:true,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonPayload
    })
    .then((results) => {
      console.log("reg returned okay", JSON.parse(results));
      this.getUser();
    }).catch((error) => {
      console.log("Not registered in:", error);
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      backend: new Backend(),
      apiResponse: "",
      username: "",
      logInSideBarOpen: false,
      logInSideBarStateLogIn: true,
      loggedIn: false
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
    return (
      <Router>
        <div>
          <Header
            logoutFunction={() => {
              this.logout();
            }}
            loggedIn={this.state.loggedIn}
            username={this.state.username}
            logInFunction={() => {
              this.setState({logInSideBarOpen: true, logInSideBarStateLogIn: true});
            }}
            registerFunction={() => {
              this.setState({logInSideBarOpen: true, logInSideBarStateLogIn: false});
            }}/>
        </div>
        <Main
          logInSideBarOpen={this.state.logInSideBarOpen && !this.state.loggedIn}
          logInSideBarStateLogIn={this.state.logInSideBarStateLogIn}
          closeSidebarFunction={() => {
            this.closeSidebar()
          }}
          loginSubmit={(payload) => {
            this.loginSubmit(payload)
          }}
          registrationSubmit={(payload) => {
            this.registrationSubmit(payload)
          }}/>
        <div className="footer">
          <div>By lleontan</div>
          <p>API TEST:
            <span>{this.state.apiResponse}</span>
          </p>
        </div>
      </Router>
    );
  }
}

export default App;
