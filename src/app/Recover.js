import React, { Component } from 'react';
import {Link} from "react-router-dom";

class Recover extends Component{
    constructor(){
        super();
        this.state = {
            username: '',
            password: '',
            mnemonic: '',
            mnemonic_err: '',
            password_err: '',
            username_err: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.login = this.login.bind(this);
    }
    login(e){
        fetch('/api/validate/password/recover',{
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            this.setState({username: '', password: '', mnemonic: '', password_err: data.password_err || '', 
            username_err: data.username_err || '', mnemonic_err: data.mnemonic_err || ''});
            if(data.success===true){
                M.toast({html: 'Password successfully changed', classes:'error'});
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
        fetch('/api/validate/',{
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('authtoken')
            }
        })
        .then(res => res.json())
        .then(data => {
            var url = window.location.origin.toString();
            var dir = window.location.toString();
            dir = dir.substring(url.length,url.length+2);
            if(data.success == true && dir == '/'){
                window.location.replace('../app');
            }else if(data.success === false){
                localStorage.removeItem('authtoken');
            }
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
                <b>Recover access</b> below
              </h4>
              <p className="grey-text text-darken-1">
                Already have access? <Link to="/auth/login">Login</Link>
              </p>
              <p className="grey-text text-darken-1">
                <strong>Reminder: </strong>Enter your 12 word phrase, lowercase, with spaces between each word.
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
                  value={this.state.mnemonic}
                  id="mnemonic"
                  type="text"
                />
                <label htmlFor="mnemonic">12 Words</label>
              </div>
              
            <div><strong style={{color: 'red'}}>{this.state.mnemonic_err}</strong></div>
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
                    backgroundImage: '-webkit-gradient(linear, left top, right bottom, from( #fc6909), to(#f99f01))'
                 
                  }}
                  type="submit"
                  className="btn btn-large waves-effect waves-light hoverable"
                >
                  <strong>Set password</strong>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>  
        )
    }
}

export default Recover;