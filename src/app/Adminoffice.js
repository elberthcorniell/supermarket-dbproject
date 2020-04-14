import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Admin_productos from './Admin_productos';
import Mensajero from './Mensajero';
import Clientes from './Clientes';
import Mensajero_entregas from './Mensajero_entregas';
import { Adminbar } from './Navbar';

export default class Adminoffice extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    componentDidMount() {
    }
    componentDidUpdate() {
    }
    render() {
        return (
            <Router>
                <div className="App">
                    <Adminbar />
                    <Route exact path="/admin/productos" render={(props) => <Admin_productos {...props}
                        token={this.state.token}
                    />}
                    />
                    <Route exact path="/admin/mensajeros" render={(props) => <Mensajero {...props}
                        token={this.state.token}
                    />}
                    />
                    <Route exact path="/admin/clientes" render={(props) => <Clientes {...props}
                        token={this.state.token}
                    />}
                    />
                    <Route exact path="/admin/entregas" render={(props) => <Mensajero_entregas {...props}
                        token={this.state.token}
                    />}
                    />
                </div>
            </Router>
        )
    }
}