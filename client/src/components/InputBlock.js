import React, {Component} from 'react';
class InputBlock extends Component {

  render() {
    return (<div className="InputBlock">
      <label>
        <span>{this.props.name}</span>
        <input type={() => {
            if (this.props.type) {
              return this.props.type;
            } else {
              return "text";
            }
          }} value={""}/>
      </label>
    </div>);
  }
}

export default InputBlock;
