import React, { Component } from 'react';
import {Link} from "react-router-dom";
import 'materialize-css';
import ProfileWidget from './ProfileWidget'

class Sidebar extends Component{
    constructor(props) {
        super(props);
        this.state = {
        };
      }
    render(){
        return( 
            <div style={{display: (window.location.pathname=='/app/tree'? 'none': '')}}>
            <div className="icon-bar hidden" style={{borderRight: "solid 0.5px rgba(0,0,0,0.2)"}}>
                <Link style={{marginBottom: 20}} to="/app/" className="btn-flat waves-effect">
                       <img src="../assets/images/logo_1.png" style={{width: 40, float: 'center' }}/>
                </Link>
                <ProfileWidget 
                    network={this.props.network}
                    kyc_level={this.props.kyc_level}
                    username={this.props.username}
                />
                <Link to="/app">
                        <i className="material-icons left">dashboard</i>
                </Link>
                <Link to="/app/investment">
                        <i className="material-icons left">attach_money</i>
                </Link>
                <Link to="/app/network">
                        <i className="material-icons left">people</i>
                </Link>
                <Link to="/app/mining">
                        <i className="material-icons left">data_usage</i>
                </Link>
                <Link to="/app/profile">
                        <i className="material-icons left">person</i>
                </Link>
                <Link to='#' onClick={()=>{
                    localStorage.setItem('authtoken', '').then(window.location.replace('../auth/login'))
                }} style={{position: 'absolute', bottom: 20}} className="btn-flat waves-effect">
                        <i className="material-icons left">chevron_left</i>
                </Link>
            </div>
            <div className="icon-bar-mobile show">
                
                <Link to="/app/investment">
                        <i className="material-icons left">attach_money</i>
                </Link>
                <Link to="/app/network">
                        <i className="material-icons left">people</i>
                </Link>
                <Link to="/app/" style={{marginBottom: 10}}>
                       <img src="../assets/images/logo_1.png" style={{width: 40, marginBottom: 10 }}/>
                </Link>
                <Link to="/app/mining">
                        <i className="material-icons left">data_usage</i>
                </Link>
                <Link to="/app/profile">
                        <i className="material-icons left">person</i>
                </Link>
            </div>
            </div>
        )
    }
}

export default Sidebar;