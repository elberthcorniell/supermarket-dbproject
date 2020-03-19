import React, { Component } from 'react';
import {Link} from "react-router-dom";
const publicIp = require('public-ip');

class Login extends Component{
    constructor(){
        super();
        this.state = {
            username: '',
            password: '',
            password_err: '',
            username_err: '',
            disabled: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.login = this.login.bind(this);
    }
    login(e){
        fetch('/api/validate/login',{
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            M.toast({html: 'Trying to log in', classes:'error'});
            this.setState({username: '', password: '', password_err: data.password_err || '', 
            username_err: data.username_err || ''});
            if(data.success===true){
                window.location.replace('../app');
                localStorage.setItem('authtoken', data.token);
            }
        })
        .catch(err => console.error(err));
        e.preventDefault();
    }
    handleChange(e){
       const {id, value} = e.target;
       this.setState({
           [id]: value
       })
    }
    componentDidMount(){
      publicIp.v4().then(ip => {
        fetch('/api/validate/ip/'+ip)
          .then(data => data.json())
          .then(data => {
            this.setState({
              ip,
              location: data.location,
              os: 'Web',
              disabled: false
            })
          })
      })
    }
    render(){
        return(
            <div className="container">
        <div style={{ marginTop: "10%", marginBottom: "10%" }} className="row">
          <div className="col s12 m12  l8 offset-l2">
            <Link onClick={()=>{window.location.replace('../')}} className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to
              home
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
            <img src="../dist/images/logo_no_text.png" width="50px" style={{ float: 'right' }}/>
              <h4>
                <b>Login</b> below
              </h4>
              <p className="grey-text text-darken-1">
                Don't have an account? <Link to="/auth/register">Register</Link>
              </p>
            </div>

            <form onSubmit={this.login} >
              <div className="input-field col s12">
              <div className="input-field">
                <input
                  onChange={this.handleChange}
                  value={this.state.username}
                  id="username"
                  type="text"
                />
                <label htmlFor="username">Username</label>
              </div>
              
            <div><strong style={{color: 'red'}}>{this.state.username_err}</strong></div>
              <div className="input-field">
                <input
                  onChange={this.handleChange}
                  value={this.state.password}
                  id="password"
                  type="password"
                />
                <label htmlFor="password">Password</label>
              </div>
            <style>
            </style>
            <div><strong style={{color: 'red'}}>{this.state.password_err}</strong></div>
              </div>
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <button
                disabled={this.state.disabled}
                  style={{
                    width: "100%",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem",
                    backgroundImage: '-webkit-gradient(linear, left top, right bottom, from( #fc6909), to(#f99f01))'
                 
                  }}
                  type="submit"
                  className="btn btn-large waves-effect waves-light hoverable"
                >
                  <strong>Login</strong>
                </button>
                <p style={{textAlign: 'center'}} className="grey-text text-darken-1">
                <Link to="/auth/recover">Forgot your password?</Link>
              </p>
              </div>
            </form>
          </div>
        </div>
      </div>  
        )
    }
}

export default Login;