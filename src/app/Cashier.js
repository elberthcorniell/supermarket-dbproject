import React, { Component } from 'react';
import {
    Card,
    Col,
    Container,
    Row,
    Button,
    Form,
    Table,
    Modal
} from "react-bootstrap"
import { QRCode } from 'react-qrcode-logo';
import toaster from 'toasted-notes';
import Authenticator from './Authenticator'
import Web3 from 'web3';
import {
    FloatingMenu,
    MainButton,
    ChildButton,
} from 'react-floating-button-menu';
class Cashier extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Bitcoin_price: 0,
            buy: true,
            balance_btc: 0,
            data: {},
            transactions: [],
            wallet_state: true,
            index: 0,
            btc_amount: 0,
            isOpen: false,
            unlock_modal: false,
            sending: false,
            method: 0
        };
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        this.getTransactions()
    }
    handleChange(e) {
        const { id, value } = e.target;
        this.setState({
            [id]: value
        })
    }
    sendTransaction() {
        this.setState({ sending: true })
        fetch('/api/fund/wallet/send', {
            method: 'POST',
            body: JSON.stringify({
                amount: this.state.send_amount,
                to: this.state.send_address,
                currency: this.props.individual_balance[this.state.method].currency
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('authtoken')
            }
        })
            .then(res => res.json())
            .then(data => {
                this.setState({ sending: false })
                if (data.success) {
                    toaster.notify('Transaction successfully sent', {
                        duration: 10000,
                        position: 'bottom-right',
                    })
                    this.props.update()
                    this.setState({
                        transaction_err: '',
                        send_address: undefined,
                        send_amount: undefined
                    })
                } else {
                    this.setState({
                        transaction_err: data.msg
                    })
                }
            })
    }
    getTransactions(limit) {
        fetch('/api/fund/transactions', {
            method: 'POST',
            body: JSON.stringify({
                limit
            }),
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
                        transactions: data.result
                    })
                } else {

                }
            })
    }
    copy(text) {
        navigator.clipboard.writeText(text).then(function () {
            toaster.notify('Ethereum address copied', {
                duration: 10000,
                position: 'bottom-right',
            })
        }, function (err) {
        })
    }
    formatDate(date) {
        date = new Date(date)
        var monthNames = [
            "Jan", "Feb", "Mar",
            "Apr", "May", "Jun", "Jul",
            "Aug", "Sep", "Oct",
            "Nov", "Dec"
        ];
        var string = ''
        return (date.getDate() + ' ' + monthNames[date.getMonth()] + ', ' + date.getFullYear())
    }

    formatNumber(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    areaToShow(area) {
        const form_dark = {
            display: 'inline-block',
            width: '100%',
            height: '100%',
            padding: 10,
            marginBottom: 0,
            backgroundColor: '#f3f5f7',
            borderStyle: 'none',
            fontWeight: 'bold',
        }
        switch (area) {
            case 0: return (
                <Row style={{ marginTop: 0 }}>
                    <Col xs={12}>
                        <Card style={{ backgroundImage: 'url(\'https://hdqwalls.com/wallpapers/abstract-colorful-space-colors-art-4k-jr.jpg\')', backgroundSize: 'cover', marginTop: -10, color: 'white' }}>
                            <Card.Body>
                                <strong>Total Balance</strong>
                                <div style={{ fontSize: 36, width: '100%', textAlign: 'right' }}><strong>{this.formatNumber((this.props.balance + this.props.wallet_balance + this.props.wallet_unconfirmed_balance).toFixed(2))}</strong> USD</div>
                            </Card.Body>
                        </Card>
                        {this.props.individual_balance.map(info => {
                            return (
                                <Card>
                                    <Card.Body>
                                        <div style={{ float: 'left' }}>
                                            <img width={60} style={{ height: '100%' }} src={'../assets/images/' + info.currency + '.png'} />
                                        </div>
                                        <div style={{ float: 'right', textAlign: 'right' }}>
                                            <strong >{info.currency} Balance</strong>
                                            <div style={{ fontSize: 36 }}><strong>{this.formatNumber((info.balance).toFixed(2))}</strong> {info.currency}</div>

                                            <div style={{ width: '100%', textAlign: 'right', marginTop: -15, color: 'rgba(0,0,0, 0.2)' }}>pending: {this.formatNumber(info.unconfirmed_balance.toFixed(2))} {info.currency}</div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            )
                        })}
                        <div>
                            <Button
                                onClick={() => this.setState({ index: 1 })}
                                className="btn-blue"
                                style={{
                                    width: '100%',
                                    padding: 10,
                                    color: '#FFF',
                                    marginTop: 20,
                                }}><strong>Send</strong> <i className="material-icons left" style={{ fontSize: 12 }}>call_made</i></Button>
                            <Button
                                onClick={() => this.setState({ index: 2 })}
                                style={{
                                    width: '100%',
                                    padding: 10,
                                    color: '#FFF',
                                    marginTop: 15,
                                    backgroundColor: '#5b86e5',
                                    borderColor: 'rgba(0,0,0,0)',
                                }}><strong>Receive <i className="material-icons left" style={{ fontSize: 12 }}>call_received</i></strong></Button>
                        </div>
                        <Card>
                            <Card.Body>
                                <strong>Investment Balance</strong>
                                <div style={{ fontSize: 36, width: '100%', textAlign: 'right' }}><strong>{this.formatNumber(this.props.balance.toFixed(2))}</strong> USD</div>
                                <Button
                                    className='btn-blue'
                                    onClick={() => this.invest()}
                                    style={{
                                        width: '100%',
                                        padding: 10,
                                        color: '#FFF',
                                        marginTop: 15
                                    }}><strong>Withdraw</strong></Button>
                            </Card.Body>
                        </Card>
                    </Col >
                </Row>
            )
            case 1: return (
                <Row style={{ padding: 30 }}>
                    <strong style={{ fontSize: 32, lineHeight: '38px', color: '#5b86e5' }}>New <br /> Transaction.</strong>
                    <div style={{ position: 'absolute', right: 40, top: 40, cursor: 'pointer' }} onClick={() => { this.setState({ index: 0 }) }}><i className="material-icons left">clear_all</i></div>
                    
                    
                    <div style={{ display: 'block', width: '100%' }}>
                    <strong>Method:</strong>
                        <div>
                    {this.props.individual_balance.map((info, index)=>{
                        return(
                            <Button
                                onClick={()=>{this.setState({method: index})}}
                                className={this.state.method == index ? "method-button-active":"method-button"}
                                style={{ marginRight: index == this.props.individual_balance.length - 1 ? 0 : 10,  width: `calc(${100/this.props.individual_balance.length}% - ${10 - (10/this.props.individual_balance.length)}px )` }}
                                disabled={info.disabled}
                            >
                                <img src={"../assets/images/"+info.currency+".png"} style={{ height: 25 }} />
                            </Button>
                        )
                    })}
                    </div>
                        <div style={{ display: 'inline-block', width: '100%' }}>
                            <div className="dark-form" style={{ marginTop: 20, display: 'inline-block', width: '75%' }}>
                                <Form.Control id="send_amount" type="number" value={this.state.send_amount} placeholder='Amount' className="form-dark" onChange={this.handleChange} style={form_dark}></Form.Control>
                            </div>
                            <Button
                                onClick={() => this.setState({ send_amount: this.props.individual_balance[this.state.method].balance - 0.1 })}
                                style={{
                                    width: 'calc(25% - 5px)',
                                    padding: 7.5,
                                    color: '#FFF',
                                    marginLeft: 5,
                                    marginTop: -10,
                                    backgroundColor: '#5b86e5',
                                    borderColor: 'rgba(0,0,0,0)',
                                    whiteSpace: 'nowrap'
                                }}><strong><i className="material-icons left" style={{ fontSize: 18 }}>all_inclusive</i></strong></Button>
                        </div>
                        <strong style={{ color: 'red', fontSize: 14, margin: 7 }}>{this.state.send_amount < 0.2 ? 'Small amount' : this.state.send_amount > this.props.individual_balance[this.state.method].balance - 0.1 ? 'Insufficient balance' : ''}</strong>
                        <div style={{ display: 'inline-block', width: '100%' }}>
                            <div className="dark-form" style={{ marginTop: 20, display: 'inline-block', width: '75%' }}>
                                <Form.Control id="send_address" value={this.state.send_address} placeholder='To address' className="form-dark" onChange={this.handleChange} style={form_dark}></Form.Control>
                            </div>
                            <Button
                                onClick={() => this.setState({ send_address: this.props.withdraw_address_ETH })}
                                style={{
                                    width: 'calc(25% - 5px)',
                                    padding: 7.5,
                                    color: '#FFF',
                                    marginLeft: 5,
                                    marginTop: -10,
                                    backgroundColor: '#5b86e5',
                                    borderColor: 'rgba(0,0,0,0)',
                                    whiteSpace: 'nowrap'
                                }}><strong><i className="material-icons left" style={{ fontSize: 18 }}>expand_more</i></strong></Button>
                        </div>
                    </div>
                    <strong style={{ color: 'red', fontSize: 14, margin: 7, display: 'block' }}>{this.state.send_address == undefined ? '' : Web3.utils.isAddress(this.state.send_address) ? '' : 'Invalid Ethereum address'}</strong>
                    <strong style={{ color: 'red', fontSize: 14, margin: 7, display: 'block' }}>{this.state.transaction_err}</strong>
                            <strong style={{ color: '#01153d', fontSize: 14, margin: 7 }}>Network fee: 0.1 {this.props.individual_balance[this.state.method].currency}</strong>
                    {this.state.send_otp == true ?
                        <Authenticator
                            callback={() => this.sendTransaction()}
                            cancel={() => { this.setState({ send_otp: false }) }}
                            secret={this.props.token}
                        />
                        :
                        ''
                    }
                    <Button
                        onClick={() => { this.props.token == null ? this.sendTransaction() : this.setState({ send_otp: true }) }}
                        disabled={this.state.send_amount > this.props.individual_balance[this.state.method].balance - 0.1 || this.state.send_amount < 0.2 || this.state.send_amount == undefined || !Web3.utils.isAddress(this.state.send_address) || this.state.sending}
                        style={{
                            width: '100%',
                            padding: 10,
                            color: '#FFF',
                            marginTop: 25,
                            backgroundColor: '#01153d',
                            borderColor: 'rgba(0,0,0,0)',
                        }}><strong><i className="material-icons left" style={{ fontSize: 12 }}>call_made</i> Send</strong></Button>

                </Row>
            )
            case 2: return (
                <Row style={{ padding: 30 }}>
                    <strong style={{ fontSize: 32, lineHeight: '38px', color: '#5b86e5' }}>Your public <br /> Ethereum address.</strong>
                    <div style={{ position: 'absolute', right: 40, top: 40, cursor: 'pointer' }} onClick={() => { this.setState({ index: 0 }) }}><i className="material-icons left">clear_all</i></div>
                    <div style={{ width: '100%', textAlign: 'center', marginTop: 50, marginBottom: 70, wordWrap: 'break-word' }} >
                        <QRCode
                            value={this.props.address}
                            size='180'
                            bgColor='#fff'
                            fgColor='#01153d'
                            logoImage='../assets/images/qr_logo.png'
                            logoWidth='45'
                            quietZone=''
                        />
                        <div></div>
                        <strong style={{ marginBottom: 45, color: '#01153d' }}>{this.props.address}</strong>
                    </div>
                    <Button
                        onClick={() => this.copy(this.props.address)}
                        style={{
                            width: 'calc(25% - 10px)',
                            padding: 10,
                            color: '#FFF',
                            marginTop: 15,
                            margin: 5,
                            backgroundColor: '#01153d',
                            borderColor: 'rgba(0,0,0,0)',
                        }}><strong><i className="material-icons left" style={{ fontSize: 18 }}>content_copy</i></strong></Button>
                    <Button
                        onClick={() => { navigator.share({ text: "This is the Ethereum address of my Inverte's wallet: " + this.props.address }).then(() => { console.log("Eureka") }) }}
                        style={{
                            width: 'calc(75% - 10px)',
                            padding: 10,
                            color: '#FFF',
                            marginTop: 15,
                            margin: 5,
                            backgroundColor: '#5b86e5',
                            borderColor: 'rgba(0,0,0,0)',
                        }}><strong><i className="material-icons left" style={{ fontSize: 12 }}>share</i> Share</strong></Button>
                </Row>
            )
        }
    }
    render() {
        return (
            <Container>
                <FloatingMenu
                    slideSpeed={500}
                    direction="up"
                    spacing={8}
                    isOpen={this.state.isOpen}
                    style={{ position: 'fixed', bottom: 50, right: 30, zIndex: 750 }}
                >
                    <MainButton
                        iconResting={<i className="material-icons left">account_balance_wallet</i>}
                        iconActive={<i className="material-icons left">clear</i>}
                        style={{ backgroundImage: "-webkit-gradient(linear, left top, right bottom, from(#fc6909), to(#f99f01))", color: 'white' }}
                        onClick={() => this.setState({ isOpen: !this.state.isOpen })}
                        size={56}
                    />
                    <ChildButton
                        background={'#FFF'}
                        icon={<i className="material-icons left">call_made</i>}
                        size={40}
                        onClick={() => this.setState({ unlock_modal: true, isOpen: false, index: 1 })}
                    />
                    <ChildButton
                        background={'#FFF'}
                        icon={<i className="material-icons left">call_received</i>}
                        size={40}
                        onClick={() => this.setState({ unlock_modal: true, isOpen: false, index: 2 })}
                    />
                    <ChildButton
                        background={'#FFF'}
                        icon={<i className="material-icons left">clear_all</i>}
                        size={40}
                        onClick={() => this.setState({ unlock_modal: true, isOpen: false, index: 0 })}
                    />
                </FloatingMenu>
                <Modal size="lg" show={this.state.unlock_modal} onHide={() => this.setState({ unlock_modal: false })}>
                    <div style={{ marginLeft: 15, marginTop: 10 }}>
                        <strong>Wallet</strong>
                        <div style={{ width: 'fit-content', height: 'fit-content', position: 'absolute', top: 10, right: 10, cursor: 'pointer' }} onClick={() => { this.setState({ unlock_modal: false }) }}><i className="material-icons left" style={{ fontSize: 18 }}>clear</i></div>
                    </div>
                    <Modal.Body style={{ padding: 20 }}>
                        {this.areaToShow(this.state.index)}
                    </Modal.Body>
                </Modal>
            </Container>
        )
    }
}

export default Cashier;