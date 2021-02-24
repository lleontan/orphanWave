class Backend {
  constructor() {
    this.state = {
      LOCAL_PORT: 8000,
      HOST_NAME: "http://127.0.0.1:"
    }
  }
  callAPIText(requestStr, options,callback) {
    this.call(requestStr,options).then(res => res.text()).then(resText => callback(resText)).catch(err => {
      console.log(err);
      return err;
    })
  }
  callAPI(requestStr, options,callback) {
    //Returns json
    this.call(requestStr,options).then(res => res.json()).then(resJson => callback(resJson)).catch(err => {
      console.log(err);
      return err;
    })
  }
  call(requestStr,options){
    //Returns a promise
    return fetch(this.state.HOST_NAME+this.state.LOCAL_PORT+"/" + requestStr,options);
  }

}

export default Backend;
