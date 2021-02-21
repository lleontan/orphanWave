import React, {Component} from 'react';
import LogInButton from './LogInButton';
import InputBlock from './InputBlock';
import CloseButton from './CloseButton';
class LogInSideBar extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  renderState(){
    if(this.props.logInSideBarStateLogIn){
        return(<form>
          <h2>Log In</h2>
          <InputBlock name="Email" onChange={this.handleChange}/>
          <InputBlock name="Password" onChange={this.handleChange}/>
          <input type="submit" value="Submit"/>
        </form>);
    }
    return(<form>
      <h2>Register</h2>
      <InputBlock name="Email" onChange={this.handleChange}/>
      <InputBlock name="Password" onChange={this.handleChange}/>
      <InputBlock name="Confirm Password" onChange={this.handleChange}/>
      <InputBlock name="Username" onChange={this.handleChange}/>
      <input type="submit" value="Submit"/>
    </form>);
  }
  render() {
    return (<div className={ `${"logInSideBar"} ${"baseBackground"} ${this.props.opened? "visible":"hidden"}` }>
      <CloseButton clickFunction={this.props.closeSidebarFunction}/>
      {this.renderState()}
    </div>);
  }
  handleChange(event) {
    this.setState({value: event.target.value});
  }
  handleSubmit(event) {
    console.log('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }
}

export default LogInSideBar;
