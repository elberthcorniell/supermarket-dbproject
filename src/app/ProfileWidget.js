import React, { Component } from 'react';
import {Link} from "react-router-dom";
import Ecosystem from './Ecosystem';

class ProfileWidget extends Component {
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
            <div style={{ marginTop: 5 }}>
                <Link style={{ display: 'inline-block', backgroundColor: 'rgba(0,0,0,0)'}} to='/app/profile' >
                    <img src='../assets/images/profile.png' style={{ height: 50, borderRadius: '50%', marginTop: -20 }} />
                    <div style={{ display: 'inline-block', marginLeft: 20, height: 50}}>
                        <strong style={{color: 'black'}}>{this.props.username}</strong>
                        <div>
                            <div style={{ padding: 5, display: 'inline-block', backgroundColor: 'rgba(54,209,220,0.1)', border: 'none 0px white', borderRadius: 5, color: '#5b86e5', fontWeight: 500, width: 'fit-content' }}>
                                {this.props.network? 'Partner' : 'Customer'}
                    </div>
                            <p style={{ width: 'fit-content', display: 'inline-block', color: '#5b86e5', fontWeight: 700, paddingLeft: 20 }}>Lvl. {this.props.kyc_level}</p>
                        </div>
                    </div>
                </Link>
            </div>
        )
    }
}
export default ProfileWidget