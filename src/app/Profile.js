import React, { Component } from 'react';
import {
    Card,
    Col,
    Container,
    Row,
    Button,
    Form,
    Modal
} from "react-bootstrap"
import { QRCode } from 'react-qrcode-logo';
import { Link } from "react-router-dom";
import toaster from 'toasted-notes';
import Ecosystem from './Ecosystem'
class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activity: [],
            index: 0,
            new_address: '',
            address_err: '',
            new_address_ETH: '',
            address_err_ETH: '',
            password: '',
            new_password: '',
            show: false,
            secret: authenticator.generateSecret(),
            twofa: false,
            twofa_err: ''
        };
        this.form_dark = {
            display: 'inline-block',
            width: '40%',
            height: '100%',
            backgroundColor: '#f99f01',
            borderStyle: 'none',
            color: '#FFF',
            fontWeight: 'bold',
            textAlign: 'right',
            paddingTop: 10,
            paddingBottom: 10
        }
        this.form_dark_2 = Object.assign({}, this.form_dark)
        this.form_dark_2.width = '50%'
        this.form_dark_2.backgroundColor = '#f3f5f7'
        this.form_dark_2.color = '#000'
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        this.getActivity()

    }
    getActivity() {
        fetch('/api/fund/activity/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('authtoken')
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success == true) {
                    this.setState({
                        activity: data.result
                    })
                } else {

                }
            })
    }
    setPassword() {
        fetch('/api/validate/password/change', {
            method: 'POST',
            body: JSON.stringify({
                password: this.state.password,
                new_password: this.state.new_password
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('authtoken')
            }
        })
            .then(res => res.json())
            .then(data => {
                this.setState({
                    password_err: data.password_err
                })
                if (data.success) {
                    toaster.notify('Password changed succesfully', {
                        duration: 10000,
                        position: 'bottom-right',
                    })
                }
            })
    }
    setAddress() {
        fetch('/api/fund/withdraw/address/set', {
            method: 'POST',
            body: JSON.stringify({
                address: this.state.new_address
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('authtoken')
            }
        })
            .then(res => res.json())
            .then(data => {
                this.setState({
                    address_err: data.message
                })
                if (data.success) {
                    this.props.update()
                    toaster.notify('Bitcoin address setted succesfully', {
                        duration: 10000,
                        position: 'bottom-right',
                    })
                }
            })
    }
    setETHAddress() {
        fetch('/api/fund/withdraw/address/set/ETH', {
            method: 'POST',
            body: JSON.stringify({
                address: this.state.new_address_ETH
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('authtoken')
            }
        })
            .then(res => res.json())
            .then(data => {
                this.setState({
                    address_err_ETH: data.message
                })
                if (data.success) {
                    this.props.update()
                    toaster.notify('Ethereum address setted succesfully', {
                        duration: 10000,
                        position: 'bottom-right',
                    })
                }
            })
    }
    setToken() {
        fetch('/api/validate/set/token', {
            method: 'POST',
            body: JSON.stringify({
                token: this.state.secret
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('authtoken')
            }
        })
            .then(res => res.json())
            .then(data => {
                this.setState({
                    twofa_err: data.message,
                    twofa: false
                })
                if (data.success) {
                    this.props.update()
                    toaster.notify('2fa setted succesfully', {
                        duration: 10000,
                        position: 'bottom-right',
                    })
                }
            })
    }
    handleChange(e) {
        const { id, value } = e.target;
        this.setState({
            [id]: value
        })
    }
    formatEmail(data) {
        var email = data.split('@')
        return email[0].slice(0, 2) + '***@' + email[1]
    }
    logout() {
        localStorage.removeItem('authtoken')
        window.location.replace('../auth/login')
    }
    areaToShow(area) {
        switch (area) {
            case 0: return (
                <Row>
                    <Col lg={6} xs={12}>
                        <Card style={{ height: 'fit-content' }}>
                            <Card.Body>
                                <strong>Profile resume</strong>
                                <div className="profile-widget">
                                    <p style={{ width: '100%', fontWeight: 500, fontSize: 24 }} >{this.formatEmail(this.props.email)}</p>
                                    <div style={{ padding: 5, display: 'inline-block', backgroundColor: 'rgba(54,209,220,0.1)', border: 'none 0px white', borderRadius: 5, color: '#5b86e5', fontWeight: 500, width: 'fit-content' }}>
                                        Personal
                                    </div>
                                    <p style={{ width: 'fit-content', display: 'inline-block', color: '#5b86e5', fontWeight: 700, paddingLeft: 20 }}>Lvl. {this.props.kyc_level}</p>
                                </div>
                                <Link to="/app/kyc"><Button
                                    className='btn-clear'
                                    style={{
                                        width: 'calc(50% - 20px)',
                                        padding: 10,
                                        margin: 10
                                    }}><strong style={{ display: 'inline-block' }} >INCREASE </strong><i style={{ fontSize: 12 }} className="material-icons">arrow_forward</i></Button>
                                </Link>
                                <Button
                                    className='btn-blue'
                                    onClick={() => { this.logout() }}
                                    style={{
                                        width: 'calc(50% - 20px)',
                                        padding: 10,
                                        color: '#FFF',
                                        margin: 10
                                    }}><strong>Logout</strong></Button>
                            </Card.Body>
                        </Card>
                        <Card style={{ height: 'fit-content' }}>
                            <Card.Body>
                                <strong>Account Activity</strong>
                                <div style={{ float: 'right' }}>
                                    <Button className="btn-blue-active" onClick={() => { this.setState({ show: true }) }}>View all</Button>
                                </div>
                                <Modal show={this.state.show} onHide={() => this.setState({ show: false })}>
                                    <Modal.Header>
                                        <strong>Account Activity</strong>
                                    </Modal.Header>
                                    <Modal.Body>
                                        {this.state.activity.length == 0 ?
                                            <div style={{ textAlign: 'center' }}>
                                                <img width={100} src='../src/images/no_data.png' />
                                            </div>
                                            :
                                            <div>
                                                {this.state.activity.map(data => {
                                                    return (
                                                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', marginBottom: 20 }}>
                                                            <div style={{ display: 'inline-block', fontWeight: 'bold' }}>
                                                                {data.os}
                                                            </div>
                                                            <div style={{ display: 'inline-block', float: 'right' }}>
                                                                {data.ip}
                                                            </div>
                                                            <div style={{ color: '#a0a0a0' }}>
                                                                {data.location}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        }
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button className="btn-blue-active" onClick={() => this.setState({ show: false })}>
                                            Close
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                                <hr />
                                {this.state.activity.length == 0 ?
                                    <div style={{ textAlign: 'center' }}>
                                        <img width={100} src='../src/images/no_data.png' />
                                    </div>
                                    :
                                    <div>
                                        {this.state.activity.map(data => {
                                            return (
                                                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', marginBottom: 20 }}>
                                                    <div style={{ display: 'inline-block', fontWeight: 'bold' }}>
                                                        {data.os}
                                                    </div>
                                                    <div style={{ display: 'inline-block', float: 'right' }}>
                                                        {data.ip}
                                                    </div>
                                                    <div style={{ color: '#a0a0a0' }}>
                                                        {data.location}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )
            case 1: return ('')
            case 2: return (
                <Row>
                    <Col lg={4} xs={12}>
                        <Card style={{ height: 'calc(100% - 10px)' }}>
                            <Card.Body>
                                <strong>Ethereum Withdraw address</strong>
                                <div style={{ width: '100%', textAlign: 'center' }}>
                                    <img height='80' style={{ margin: 40 }} src={'../assets/images/ETH.png'} />
                                </div>
                                <div className="dark-form" style={{ whiteSpace: 'nowrap', marginTop: 15, textAlign: 'left' }}>
                                    <p style={{ display: 'inline-block', marginLeft: 15, marginBottom: 0, width: '30%' }}><strong>ADDRESS</strong></p>
                                    <Form.Control id='withdraw_address_ETH' value={this.props.withdraw_address_ETH} className="form-dark" style={this.form_dark_2} ></Form.Control>
                                </div>
                                <div className="dark-form" style={{ whiteSpace: 'nowrap', marginTop: 15, textAlign: 'left' }}>
                                    <p style={{ display: 'inline-block', marginLeft: 15, marginBottom: 0, width: '30%' }}><strong>NEW</strong></p>
                                    <Form.Control id='new_address_ETH' value={this.state.new_address_ETH} className="form-dark" onChange={this.handleChange} style={this.form_dark_2} ></Form.Control>
                                </div>
                                <div><strong style={{ color: 'red' }}>{this.state.address_err_ETH}</strong></div>
                                <Button
                                    className='btn-blue'
                                    onClick={() => { this.setETHAddress() }}
                                    disabled={this.state.new_address_ETH.length < 25}
                                    style={{
                                        width: '100%',
                                        padding: 10,
                                        color: '#FFF',
                                        marginTop: 15
                                    }}><strong>Set address</strong></Button>
                                <p>Withdrawal via Shield will be processed with your OneAuth username.</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={4} xs={12}>
                        <Card style={{ height: 'calc(100% - 10px)' }}>
                            <Card.Body>
                                <strong>Bitcoin Withdraw address</strong>
                                <div style={{ width: '100%', textAlign: 'center' }}>
                                    <img height='80' style={{ margin: 40 }} src={'../assets/images/BTC.png'} />
                                </div>
                                <div className="dark-form" style={{ whiteSpace: 'nowrap', marginTop: 15, textAlign: 'left' }}>
                                    <p style={{ display: 'inline-block', marginLeft: 15, marginBottom: 0, width: '30%' }}><strong>ADDRESS</strong></p>
                                    <Form.Control id='insurance' value={this.props.withdraw_address} className="form-dark" style={this.form_dark_2} ></Form.Control>
                                </div>
                                <div className="dark-form" style={{ whiteSpace: 'nowrap', marginTop: 15, textAlign: 'left' }}>
                                    <p style={{ display: 'inline-block', marginLeft: 15, marginBottom: 0, width: '30%' }}><strong>NEW</strong></p>
                                    <Form.Control id='new_address' value={this.state.new_address} className="form-dark" onChange={this.handleChange} style={this.form_dark_2} ></Form.Control>
                                </div>
                                <div><strong style={{ color: 'red' }}>{this.state.address_err}</strong></div>
                                <Button
                                    className='btn-blue'
                                    onClick={() => { this.setAddress() }}
                                    disabled={this.state.new_address.length < 25}
                                    style={{
                                        width: '100%',
                                        padding: 10,
                                        color: '#FFF',
                                        marginTop: 15
                                    }}><strong>Set address</strong></Button>
                                <p>Withdrawal via Shield will be processed with your OneAuth username.</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={4} xs={12}>
                        <Card style={{ height: 'calc(100% - 10px)' }}>
                            <Card.Body>
                                <strong>Password</strong>
                                <div style={{ width: '100%', textAlign: 'center' }}>
                                    <img height='80' style={{ margin: 40 }} src={'../assets/images/insurance.png'} />
                                </div>
                                <div className="dark-form" style={{ whiteSpace: 'nowrap', marginTop: 15, textAlign: 'left' }}>
                                    <p style={{ display: 'inline-block', marginLeft: 15, marginBottom: 0, width: '30%' }}><strong>PASSWORD</strong></p>
                                    <Form.Control id='password' type="password" value={this.state.password} className="form-dark" onChange={this.handleChange} style={this.form_dark_2} ></Form.Control>
                                </div>
                                <div className="dark-form" style={{ whiteSpace: 'nowrap', marginTop: 15, textAlign: 'left' }}>
                                    <p style={{ display: 'inline-block', marginLeft: 15, marginBottom: 0, width: '30%' }}><strong>NEW</strong></p>
                                    <Form.Control id='new_password' type="password" value={this.state.new_password} className="form-dark" onChange={this.handleChange} style={this.form_dark_2} ></Form.Control>
                                </div>
                                <div><strong style={{ color: 'red' }}>{this.state.password_err}</strong></div>
                                <Button
                                    className='btn-blue'
                                    onClick={() => { this.setPassword() }}
                                    disabled={this.state.new_password < 6 | this.state.password < 6}
                                    style={{
                                        width: '100%',
                                        padding: 10,
                                        color: '#FFF',
                                        marginTop: 15
                                    }}><strong>Set Password</strong></Button>
                                <p><strong>Reminder: </strong>Allways have your mnemonics words in a secure place in case of password loss.</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={4} xs={12}>
                        <Card style={{ height: 'fit-content' }}>
                            {this.props.token == null ?
                                <div>
                                    {this.state.twofa == true ?
                                        <Authenticator
                                            cancel={() => { this.setState({ twofa: false }) }}
                                            callback={() => this.setToken()}
                                            secret={this.state.secret}
                                        />
                                        :
                                        ''}
                                    <Card.Body>
                                        <strong>2 Factor Authentication</strong>
                                        <div style={{ width: 'calc(100% - 60px)', textAlign: 'center', margin: 30 }}>
                                            <QRCode
                                                style={{
                                                }}
                                                value={"otpauth://totp/Inverte - " + this.props.username + "?secret=" + this.state.secret + "&issuer=Inverte"}
                                                size='180'
                                                bgColor='#fff'
                                                fgColor='#01153d'
                                                logoImage='../assets/images/qr_logo.png'
                                                logoWidth='45'
                                                quietZone=''
                                            />
                                            <strong style={{fontSize: 18, marginTop: 10, color: '#01153d'}}>{this.state.secret}</strong>
                                        </div>
                                        <div><strong style={{ color: 'red' }}>{this.state.twofa_err}</strong></div>
                                        <Button
                                            className='btn-blue'
                                            onClick={() => { window.location.replace("otpauth://totp/Inverte - " + this.props.username + "?secret=" + this.state.secret + "&issuer=Inverte") }}
                                            style={{
                                                width: '100%',
                                                padding: 10,
                                                color: '#FFF',
                                                marginTop: 15
                                            }}><strong>Set</strong></Button>
                                        <Button
                                            className='btn-blue'
                                            onClick={() => { this.setState({ twofa: true }) }}
                                            style={{
                                                width: '100%',
                                                padding: 10,
                                                color: '#FFF',
                                                marginTop: 15
                                            }}><strong>Verify</strong></Button>
                                        <p><strong>Reminder: </strong>Allways have your mnemonics words in a secure place in case of password loss.</p>
                                    </Card.Body>
                                </div>
                                :
                                <div>
                                    <Card.Body>
                                        <strong>2 Factor Authentication</strong>
                                        <div style={{ width: '100%', textAlign: 'center' }}>
                                            <img height='80' style={{ margin: 40 }} src={'../assets/images/oneauth_light@2x.png'} />
                                            <div>
                                                <strong>2 factor authentification successfully set</strong>
                                                <p style={{ marginTop: 10 }}>Lost access to your 2fa? <a href="https://bitnationdo.freshdesk.com/"><strong>Click here.</strong></a></p>
                                            </div>
                                        </div>
                                        <p><strong>Reminder: </strong>Allways have your mnemonics words in a secure place in case of password loss.</p>

                                    </Card.Body>
                                </div>
                            }

                        </Card>
                    </Col>

                </Row>
            )
        }
    }
    render() {
        return (
            <Container style={{height: 'calc(fit-content + 20px)', minHeight: '100vh'}}>
                <Row>
                    <Col style={{ marginTop: 10 }}>
                        <Button onClick={() => { this.setState({ index: 0 }) }} style={{ padding: 10, color: '#FFF' }} className={this.state.index == 0 ? 'btn-blue-active' : 'btn-blue' + ' btn btn-primary'}>Profile</Button>
                        <Button onClick={() => { this.setState({ index: 1 }) }} style={{ padding: 10, color: '#FFF' }} className={this.state.index == 1 ? 'btn-blue-active' : 'btn-blue' + ' btn btn-primary'}>Tools</Button>
                        <Button onClick={() => { this.setState({ index: 2 }) }} style={{ padding: 10, color: '#FFF' }} className={this.state.index == 2 ? 'btn-blue-active' : 'btn-blue' + ' btn btn-primary'}>Settings</Button>
                        <Ecosystem />
                    </Col>
                </Row>
                <hr />
                {this.areaToShow(this.state.index)}
                <div style={{ height: 60 }}></div>
            </Container>
        )
    }
}
export default Profile;