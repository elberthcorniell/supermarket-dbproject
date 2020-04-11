import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './Home';
import Productos from './Productos';
import toaster from 'toasted-notes';

class Backoffice extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
        };
    }
    componentDidMount() {
    }
    componentDidUpdate() {
    }
    getPlan() {
        fetch('/api/fund/data', {
            method: 'POST',
            body: JSON.stringify({}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('authtoken')
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    this.setState({
                        plan: data.plan,
                        lifetime_investment: data.lifetime_investment
                    })
                } else {
                }
            })
    }
    render() {
        return (
            <Router>
                <div className="App">
                        <Route exact path="/" render={(props) => <Home {...props}
                            token={this.state.token}
                            />}
                        />
                        <Route exact path="/productos" render={(props) => <Productos {...props}
                            token={this.state.token}
                            />}
                        />
                    </div>
            </Router>
        )
    }
}

export default Backoffice;