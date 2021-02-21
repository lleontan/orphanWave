import React, {Component} from 'react';

class CloseButton extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (<div className="closeButton">
      <button onClick={this.props.clickFunction}>X</button>
    </div>);
  }
}

export default CloseButton;
