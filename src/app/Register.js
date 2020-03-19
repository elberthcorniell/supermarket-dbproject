import React, { Component } from 'react';
import {Link} from "react-router-dom";

class Register extends Component{
    constructor(){
        super();
        this.state = {
            username2: '',
            password2: '',
            email2: '',
            email_err2: '',
            username_err2: '',
            password_err2: '',
            sponsor_err: '',
            u: true
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
          this.setState({username2: '', password2: '', email2: '' , email_err2: data.email_err || '', 
          username_err2: data.username_err || '' , 
          password_err2: data.password_err || '',sponsor_err: data.sponsor_err || ''});
          if(data.success===true){
            
              window.location.replace('../auth/login');
          }
      })
      .catch(err => console.error(err));
      e.preventDefault();
  }


    componentDidMount(){
      var url_string = window.location.href;
      var url = new URL(url_string);
      var u = url.searchParams.get("u");
      if(u!=undefined){
      this.setState({
        u: true,
        sponsor: u
      })}else{
        this.setState({
          u: false
        })
      }
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
            <img src="../dist/images/logo_no_text.png" width="50px" style={{ float: 'right' }}/>
              <h4>
                <b>Register</b> now
              </h4>
              <p className="grey-text text-darken-1">
                Already have an account? <Link to="/auth/login">Login</Link>
              </p>
            </div>
            
            <form onSubmit={this.register} >
              <div className="input-field col s12">
              <div className="input-field" style={{color: 'red'}}>
                <input
                  onChange={this.handleChange}
                  value={this.state.sponsor}
                  id="sponsor"
                  type="text"
                />
                <label htmlFor="sponsor">Sponsor</label>
              </div>
            <div><strong style={{color: 'red'}}>{this.state.sponsor_err}</strong></div>
              <div className="input-field">
                <input
                  onChange={this.handleChange}
                  value={this.state.username2}
                  id="username2"
                  type="text"
                />
                <label htmlFor="username2">Username</label>
              </div>
              
            <div><strong style={{color: 'red'}}>{this.state.username_err2}</strong></div>
              <div className="input-field">
                <input
                  onChange={this.handleChange}
                  value={this.state.email2}
                  id="email2"
                  type="email"
                />
                <label htmlFor="email2">Email</label>
              </div>
              
            <div><strong style={{color: 'red'}}>{this.state.email_err2}</strong></div>

              <div className="input-field">
                <input
                  onChange={this.handleChange}
                  value={this.state.password2}
                  id="password2"
                  type="password"
                />
                <label htmlFor="password2">Password</label>
              </div>
            <style>
            </style>
            <div><strong style={{color: 'red'}}>{this.state.password_err2}</strong></div>
              </div>
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <button
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

/*
              {!this.state.u?
                <div style={{backgroundColor: 'yellow', color: 'gray', width: '100%', padding: 10, borderRadius: 5}}>
                  If someone told you about Inverte, please ask for his/her referal link or a <strong>random</strong> sponsor will be asigned.
                </div>
              
              :''}*/