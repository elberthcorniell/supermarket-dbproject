import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";

class App extends Component {
    constructor() {
        super();
        this.state = {
        };
    }
    componentDidMount() {
        fetch('/api/fund/verify', {
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
                if (data.success === true) {
                    window.location.replace('../app/');
                }
            })
    }
    render() {
        return (
            <Router>
                <div className="App">
                    <Route exact path="/auth/login" component={Login} />
                    <Route exact path="/auth/register" component={Register} />
                </div>
            </Router>

        )
    }
}

export default App;