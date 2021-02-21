import logo from './logo.svg';
import './App.css';
import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import Header from "./routes/Header/Header";
import Main from "./routes/Main"
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiResponse: "",
      logInSideBarOpen: false,
      logInSideBarStateLogIn: true
    };

  }

  callAPI(requestStr) {
    fetch("http://127.0.0.1:8000/" + requestStr).then(res => res.text()).then(resText => {
      this.setState({apiResponse: resText});
    }).catch(err => {
      console.log(err);
      return err;
    })
  }
  closeSidebar(){
    this.setState({logInSideBarOpen: false});
  }
  componentWillMount() {
    this.callAPI("user");
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
      <Main logInSideBarOpen={this.state.logInSideBarOpen} logInSideBarStateLogIn={this.state.logInSideBarStateLogIn} apiResponse={this.state.apiResponse} closeSidebarFunction={()=>{this.closeSidebar()}}/>
      <div className="footer">
        <div>By lleontan</div>
      </div>
    </Router>);
  }
}

export default App;
