import React, {Component,useRef} from 'react';
import LogInButton from './LogInButton';
import InputBlock from './InputBlock';
import CloseButton from './CloseButton';


const RenderSidebar=(props)=>{
  let formRef = useRef(null);
  let compileFormLogin = () => {
    let form = formRef.current;
    let confirmPasswordInput = form['confirmPassword'];
    let confirmPassword="";
    if(confirmPasswordInput){
      confirmPassword=confirmPasswordInput.value;
    }
    let payload = {
      email: form['email'].value,
      password: form['password'].value
    };
    return payload;
  }
  let compileFormRegistration = () => {
    let form = formRef.current;
    let payload = {
      email: form['email'].value,
      password: form['password'].value,
      confirmPassword: form['confirmPassword'].value,
      username: form['username'].value
    };
    return payload;
  }
  if (props.logInSideBarStateLogIn) {
    return (<form ref={formRef}>
      <div className="flexRow spaceBetween">
        <h2>Log In</h2>
        <CloseButton clickFunction={props.closeSidebarFunction}/>
      </div>
      <InputBlock name="email"/>
      <InputBlock name="password"/>
      <input type="submit" value="Submit" onClick={(event) => {
          event.preventDefault();
          props.loginSubmit(compileFormLogin())
        }}/>
    </form>);
  }
  return (<form ref={formRef}>
    <div className="flexRow spaceBetween">
      <h2>Register</h2>
      <CloseButton clickFunction={props.closeSidebarFunction}/>
    </div>
    <InputBlock name="email"/>
    <InputBlock name="password"/>
    <InputBlock name="confirmPassword"/>
    <InputBlock name="username" type="text"/>

    <input type="submit" value="Submit" onClick={(event) => {
        event.preventDefault();
        props.registrationSubmit(compileFormRegistration())
      }}/>
      <div className={`${ "slightMarginTop"} ${ "centeredText"}`}>
        <label>{props.sidebarErrorText}</label>
      </div>
  </form>);
}

let handleSubmit=(event)=>{
  event.preventDefault();
}

let LogInSideBar=(props)=>{
  return(<div className={`${ "logInSideBar"} ${ "baseBackground"} ${props.opened
          ? "visible"
          : "hidden"}`}>
        {RenderSidebar(props)}
      </div>);
}
export default LogInSideBar;
