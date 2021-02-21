import React, {Component} from 'react';

class LogInButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      toggleFunction: props.toggleFunction
    }
  }
  render() {
    return (<button className="logInButton" onClick={this.state.toggleFunction}>{this.props.name}</button>);
  }
}

export default LogInButton;
