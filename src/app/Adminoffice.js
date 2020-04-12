import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Carrito from './Carrito';
import Productos from './Productos';
import Retroalimentacion from './Retroalimentacion';
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
                    <Route exact path="/admin/" render={(props) => <Productos {...props}
                        token={this.state.token}
                    />}
                    />
                </div>
            </Router>
        )
    }
}