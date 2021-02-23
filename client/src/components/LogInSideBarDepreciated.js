import React, {Component} from 'react';
import LogInButton from './LogInButton';
import InputBlock from './InputBlock';
import CloseButton from './CloseButton';
class LogInSideBarDepreciated extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      username: ""
    }

  }

  renderState() {
    const formRef = useRef(null);
    const compileForm = () => {
      let form = formRef.current;
      let confirmPassword = form['confirmPassword'].value
        ? form['confirmPassword'].value
        : "";
      let payload = {
        email: form['email'].value,
        password: form['password'].value,
        confirmPassword: confirmPassword,
        username: form['username'].value
      };
      return payload;
    }
    if (this.props.logInSideBarStateLogIn) {
      return (<form ref={formRef}>
        <div className="flexRow spaceBetween">
          <h2>Log In</h2>
          <CloseButton clickFunction={this.props.closeSidebarFunction}/>
        </div>
        <InputBlock name="email"/>
        <InputBlock name="password"/>
        <input type="submit" value="Submit" onClick={(event) => {
            event.preventDefault();

            this.props.loginSubmit(this.state)
          }}/>
      </form>);
    }
    return (<form>
      <div className="flexRow spaceBetween">
        <h2>Register</h2>
        <CloseButton clickFunction={this.props.closeSidebarFunction}/>
      </div>
      <InputBlock name="email"/>
      <InputBlock name="password"/>
      <InputBlock name="confirmPassword"/>
      <InputBlock name="username" type="text"/>
      <input type="submit" value="Submit" onClick={(event) => {
          event.preventDefault();
          this.props.registrationSubmit(this.state)
        }}/>
    </form>);
  }
  render() {
    return (<div className={`${ "logInSideBar"} ${ "baseBackground"} ${this.props.opened
        ? "visible"
        : "hidden"}`}>
      {this.renderState()}
    </div>);
  }
  handleChange(event) {
    console.log(event);

    const target = event.target;
    const value = target.type === 'checkbox'
      ? target.checked
      : target.value;
    const name = target.name;
    this.setState({[name]: value});
  }
  handleSubmit(event) {
    console.log('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }
}


export default LogInSideBarDepreciated;
