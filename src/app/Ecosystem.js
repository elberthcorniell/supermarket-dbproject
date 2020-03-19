import React, { Component } from 'react';
import {
    Modal,
    Button
} from "react-bootstrap"
const apps = [
    { name: 'Shield Exchange', logo: '../assets/images/shield_logo.png' }
]
class Ecosystem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unlock_modal: false,
            apps
        };
    }
    componentDidMount() {
    }
    componentDidUpdate() {
    }
    render() {
        return (
            <div style={{ display: 'inline-block', float: 'right' }}>
                <i style={{ fontSize: 40, color: '#c2c4c6', marginTop: 5, cursor: 'pointer' }} onClick={() => { this.setState({ unlock_modal: true }) }} className="material-icons">view_agenda</i>
                <Modal show={this.state.unlock_modal} onHide={() => this.setState({ unlock_modal: false })}>
                    <Modal.Header>
                        <strong>Ecosystem Apps</strong>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.apps.map(info => {
                            return (
                            <div onClick={()=>{window.location.href = 'https://shield.do/auth/login'}} style={{ width: '33%', padding: 10, backgroundColor: '#f3f5f7', borderRadius: 5, textAlign: 'center', display: 'block', cursor: 'pointer' }}>
                                <p><img src={info.logo} style={{ height: 40}} /></p>
                                <strong>{info.name}</strong>
                            </div>
                            )
                        })}

                        <Button
                            className='btn-blue'
                            onClick={() => this.setState({ unlock_modal: false })}
                            style={{
                                width: '100%',
                                padding: 10,
                                color: '#FFF',
                                marginTop: 15
                            }}><strong>Close</strong></Button>
                    </Modal.Body>
                </Modal>

            </div>
        )
    }
}
export default Ecosystem