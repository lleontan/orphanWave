import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import DefaultRoute from "./DefaultRoute";

import LogInSideBar from "../components/LogInSideBar";
class Main extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(<div className="main alternateBackground">
      <LogInSideBar sidebarErrorText={this.props.sidebarErrorText}
      opened={this.props.logInSideBarOpen}
      logInSideBarStateLogIn={this.props.logInSideBarStateLogIn}
       closeSidebarFunction={this.props.closeSidebarFunction}
        loginSubmit={this.props.loginSubmit}
        registrationSubmit={this.props.registrationSubmit}/>
      <div className="mediumPadding">
        <div className="App">


          <Switch>
            <Route path="/">
              <DefaultRoute/>
            </Route>
          </Switch>
        </div>
      </div>
    </div>);
  }
}

export default Main;
