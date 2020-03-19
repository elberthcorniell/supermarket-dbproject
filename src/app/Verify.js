import React, { Component } from 'react';
import {
    Card,
    Button
} from "react-bootstrap"
import {Link} from "react-router-dom";

class Verify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }
    render() {
        return (
            <Card style={{ minHeight: 100 }}>
                <Card.Body >
                    <strong>Account level.</strong>
                    <img src="../assets/images/phone.png" style={{ height: 150, position: 'absolute', paddingRight: -10, float: 'right', bottom: 0, right: 5 }} />
                    <p style={{ width: 250, fontSize: 38 }}>Lvl. {this.props.kyc_level}</p>
                    <Link to="/app/kyc"><Button className="btn-clear" style={{ display: 'inline-block', boxShadow: 'none' }} ><strong style={{ display: 'inline-block' }} >INCREASE </strong><i style={{ fontSize: 12 }} className="material-icons">arrow_forward</i></Button></Link>
                </Card.Body>
            </Card>
        )
    }
}

export default Verify;
