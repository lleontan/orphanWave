import React, {Component} from 'react';
class InputBlock extends Component {

  constructor(props){
    super(props);
    let typeVal="text";
    if(props.type){typeVal=props.type};
    this.state={type:typeVal, name:props.name};
  }
  render() {
    return (<div className="inputBlock flexCol">
      <label>
        <span>{this.props.name}</span>
        </label>

        <input type={this.state.type} name ={this.state.name}defaultValue=""/>
    </div>);
  }
}

export default InputBlock;
