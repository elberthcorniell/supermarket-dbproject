import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Admin_productos from './Admin_productos';
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
                </div>
            </Router>
        )
    }
}