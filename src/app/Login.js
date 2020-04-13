import React, { Component } from 'react';
import { Link } from "react-router-dom";
const publicIp = require('public-ip');

class Login extends Component {
  constructor() {
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
  login(e) {
    fetch('/api/validate/login', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        M.toast({ html: 'Trying to log in' });
        this.setState({
          username: '', password: '', password_err: data.password_err || '',
          username_err: data.username_err || ''
        });
        console.log(data)
        if (data.success) {
          window.location.replace(data.Tipo == 'Admin'?'../admin/':'../productos?categoria=1');
          localStorage.setItem('authtoken', data.token);
        }
      })
      .catch(err => console.error(err));
    e.preventDefault();
  }
  handleChange(e) {
    const { id, value } = e.target;
    this.setState({
      [id]: value
    })
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className="container">
        <div style={{ marginTop: "10%", marginBottom: "10%" }} className="row">
          <div className="col s12 m12  l8 offset-l2">
            <Link onClick={() => { window.location.replace('../') }} className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to
              home
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <img src="../assets/images/logo_text.png" width={80} style={{ float: 'right' }} />
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
                    value={this.state.Correo_electronico}
                    id="Correo_electronico"
                    type="text"
                  />
                  <label htmlFor="Correo_electronico">Correo electronico</label>
                </div>

                <div><strong style={{ color: 'red' }}>{this.state.username_err}</strong></div>
                <div className="input-field">
                  <input
                    onChange={this.handleChange}
                    value={this.state.Contraseña}
                    id="Contraseña"
                    type="password"
                  />
                  <label htmlFor="Contraseña">Contraseña</label>
                </div>
                <style>
                </style>
                <div><strong style={{ color: 'red' }}>{this.state.password_err}</strong></div>
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
                  <strong>Iniciar Sesion</strong>
                </button>
                <p style={{ textAlign: 'center' }} className="grey-text text-darken-1">
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