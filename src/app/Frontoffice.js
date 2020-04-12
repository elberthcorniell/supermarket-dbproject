import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './Home';
import Carrito from './Carrito';
import Productos from './Productos';
import Retroalimentacion from './Retroalimentacion';
import Navigationbar from './Navbar';

export default class Frontoffice extends Component {
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
                    <Navigationbar />
                        <Route exact path="/" render={(props) => <Home {...props}
                            token={this.state.token}
                            />}
                        />
                        <Route exact path="/productos" render={(props) => <Productos {...props}
                            token={this.state.token}
                            />}
                        />
                        <Route exact path="/carrito" render={(props) => <Carrito {...props}
                            token={this.state.token}
                            />}
                        /><Route exact path="/retroalimentacion" render={(props) => <Retroalimentacion {...props}
                        token={this.state.token}
                        />}
                    />
                    </div>
            </Router>
        )
    }
}