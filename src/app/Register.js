import React, { Component } from 'react';
import { Link } from "react-router-dom";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      Contraseña: '',
      Correo_electronico: '',
      email_err: '',
      username_err: '',
      password_err: '',
      index: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.register = this.register.bind(this);
    this.registerDir = this.registerDir.bind(this);
    this.createPersona = this.createPersona.bind(this);
  }

  handleChange(e) {
    const { id, value } = e.target;
    this.setState({
      [id]: value
    })
  }

  register(e) {
    const { Correo_electronico, Contraseña } = this.state
    fetch('/api/validate/register', {
      method: 'POST',
      body: JSON.stringify({
        Tipo: 'Cliente',
        Contraseña,
        Correo_electronico
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        this.setState({
          Contraseña: '', Correo_electronico: '', email_err: data.email_err || '',
          username_err: data.username_err || '',
          password_err: data.password_err || ''
        });
        alert(data.msg)
        if (data.success == true) {
          this.setState({
            index: 1,
            ID_Cuenta: data.ID_Cuenta
          })
        }
      })
      .catch(err => console.error(err));
    e.preventDefault();
  }
  registerDir(e) {
    const { Municipio, Sector, Barrio, Calle, N_Residencia } = this.state
    fetch('/api/validate/register/direccion', {
      method: 'POST',
      body: JSON.stringify({
        Municipio, 
        Sector, 
        Barrio, 
        Calle, 
        N_Residencia
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        alert(data.msg)
        if (data.success == true) {
          this.setState({
            index: 2,
            ID_Cuenta: data.ID_Cuenta
          })
        }
      })
      .catch(err => console.error(err));
    e.preventDefault();
  }
  createPersona(e){

  }
  renderForm(index) {
    switch (index) {
      case 0: return (
        <form onSubmit={this.register} >
          <div className="input-field col s12">
            <div className="input-field">
              <input
                onChange={this.handleChange}
                value={this.state.Correo_electronico}
                id="Correo_electronico"
                type="email"
              />
              <label htmlFor="email">Email</label>
            </div>

            <div><strong style={{ color: 'red' }}>{this.state.email_err}</strong></div>

            <div className="input-field">
              <input
                onChange={this.handleChange}
                value={this.state.Contraseña}
                id="Contraseña"
                type="password"
              />
              <label htmlFor="password">Password</label>
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
              Next
          </button>
          </div>
        </form>

      )
      case 1: return (
        <form onSubmit={this.registerDir} >
          <div className="input-field col s12">
            <div className="input-field">
              <input
                onChange={this.handleChange}
                value={this.state.Municipio}
                id="Municipio"
                type="text"
              />
              <label htmlFor="Municipio">Municipio</label>
            </div>

            <div className="input-field">
              <input
                onChange={this.handleChange}
                value={this.state.Sector}
                id="Sector"
                type="text"
              />
              <label htmlFor="Sector">Sector</label>
            </div>
            <div className="input-field">
              <input
                onChange={this.handleChange}
                value={this.state.Barrio}
                id="Barrio"
                type="text"
              />
              <label htmlFor="Barrio">Barrio</label>
            </div>
            <div className="input-field">
              <input
                onChange={this.handleChange}
                value={this.state.Telefono}
                id="Calle"
                type="text"
              />
              <label htmlFor="Calle">Calle</label>
            </div>
            <div className="input-field">
              <input
                onChange={this.handleChange}
                value={this.state.Telefono}
                id="N_Residencia"
                type="text"
              />
              <label htmlFor="N_Residencia">No. Residencia</label>
            </div>
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

      )
      case 2:
        return (
          <form onSubmit={this.createPersona} >
            <div className="input-field col s12">
              <div className="input-field">
                <input
                  onChange={this.handleChange}
                  value={this.state.Cedula}
                  id="Cedula"
                  type="text"
                />
                <label htmlFor="Cedula">Cedula</label>
              </div>

              <div><strong style={{ color: 'red' }}>{this.state.email_err}</strong></div>

              <div className="input-field">
                <input
                  onChange={this.handleChange}
                  value={this.state.Nombre}
                  id="Nombre"
                  type="text"
                />
                <label htmlFor="Nombre">Nombre</label>
              </div>
              <div className="input-field">
                <input
                  onChange={this.handleChange}
                  value={this.state.Apellido}
                  id="Apellido"
                  type="text"
                />
                <label htmlFor="Apellido">Apellido</label>
              </div>
              <div className="input-field">
                <input
                  onChange={this.handleChange}
                  value={this.state.Telefono}
                  id="Telefono"
                  type="text"
                />
                <label htmlFor="Telefono">Telefono</label>
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
                Register
          </button>
            </div>
          </form>
        )
    }
  }
  render() {
    return (
      <div className="container">
        <div style={{ marginTop: "10%", marginBottom: "10%" }} className="row">
          <div className="col s12 m12  l8 offset-l2">
            <Link onClick={() => { window.location.replace('/') }} className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to
              home
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <img src="../assets/images/logo_text.png" width={80} style={{ float: 'right' }} />
              <h4>
                <b>Registrate</b> ahora
              </h4>
              <p className="grey-text text-darken-1">
                ¿Ya tienes una cuenta? <Link to="/auth/login">Iniciar Sesion</Link>
              </p>
            </div>
            {this.renderForm(this.state.index)}
          </div>
        </div>
      </div>
    )
  }
}

export default Register;