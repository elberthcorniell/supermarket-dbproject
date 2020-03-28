import React, { Component } from 'react';
import {Link} from "react-router-dom";

class Register extends Component{
    constructor(){
        super();
        this.state = {
            username: '',
            password: '',
            email: '',
            email_err: '',
            username_err: '',
            password_err: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.register = this.register.bind(this);
    }

    handleChange(e){
       const {id, value} = e.target;
       this.setState({
           [id]: value
       })
    }

    register(e){
      fetch('/api/validate/register',{
          method: 'POST',
          body: JSON.stringify(this.state),
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          }
      })
      .then(res => res.json())
      .then(data => {
        console.log(data)
          M.toast({html: 'Trying to register'});
          this.setState({username: '', password: '', email: '' , email_err: data.email_err || '', 
          username_err: data.username_err || '' , 
          password_err: data.password_err || '',sponsor_err: data.sponsor_err || ''});
          if(data.success===true){
            
              window.location.replace('../auth/login');
          }
      })
      .catch(err => console.error(err));
      e.preventDefault();
  }
    render(){
        return(
            <div className="container">
        <div style={{ marginTop: "10%" , marginBottom: "10%"}} className="row">
          <div className="col s12 m12  l8 offset-l2">
          <Link onClick={()=>{window.location.replace('/')}} className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to
              home
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
            <img src="../assets/images/logo_text.png" width={80} style={{ float: 'right' }}/>
              <h4>
                <b>Registrate</b> ahora
              </h4>
              <p className="grey-text text-darken-1">
                ¿Ya tienes una cuenta? <Link to="/auth/login">Iniciar Sesion</Link>
              </p>
            </div>
            
            <form onSubmit={this.register} >
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
                  value={this.state.email}
                  id="email"
                  type="email"
                />
                <label htmlFor="email">Email</label>
              </div>
              
            <div><strong style={{color: 'red'}}>{this.state.email_err}</strong></div>

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
                  style={{
                    width: "100%",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem",
                  }}
                  type="submit"
                  className="btn btn-large waves-effect waves-light hoverable"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>     
        )
    }
}

export default Register;