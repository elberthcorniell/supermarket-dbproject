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
import { Link } from "react-router-dom";
import Banner from './Banner'
import Verify from './Verify'
import toaster from 'toasted-notes';
import Ecosystem from './Ecosystem';
import Authenticator from './Authenticator';

class Deposit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Bitcoin_price: 0,
            buy: true,
            balance_btc: 0,
            data: {},
            currency: 'BTC',
            method: null,
            currency_index: 0,
            transactions: [],
            wallet_state: true,
            index: 0,
            invest_amount: 50,
            btc_amount: '',
            password: '',
            unlock_modal: false,
            day: new Date(),
            withdraw_err: '',
            unlock_err: '',
            withdraw_otp: false,
            check_email: false,
        };
        this.form_dark = {
            display: 'inline-block',
            width: '40%',
            height: '100%',
            backgroundColor: '#f99f01',
            borderStyle: 'none',
            color: '#FFF',
            fontWeight: 'bold',
            textAlign: 'right'
        }
        this.form_dark_2 = Object.assign({}, this.form_dark)
        this.form_dark_2.width = '50%'
        this.form_dark_2.backgroundColor = '#f3f5f7'
        this.form_dark_2.color = '#000'
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
    invest() {
        fetch('/api/fund/invest', {
            method: 'POST',
            body: JSON.stringify({
                lots: this.state.invest_amount,
                currency: this.props.individual_balance[this.state.currency_index].currency
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
                    this.props.update()
                    this.setState({
                        invest_otp: false
                    })
                } else {

                }
            })
    }
    formatEmail(data) {
        var email = data.split('@')
        return email[1]
    }
    withdraw() {
        fetch('/api/fund/withdraw', {
            method: 'POST',
            body: JSON.stringify({
                amount: this.state.btc_amount,
                wallet: !this.state.wallet_state,
                method: this.state.method
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
                    this.props.update()
                    toaster.notify(data.msg, {
                        duration: 10000,
                        position: 'bottom-right',
                    })
                    this.setState({
                        withdraw_err: '',
                        check_email: true
                    })
                } else {
                    this.setState({
                        withdraw_err: data.msg
                    })
                }
            })
    }
    getTransactions(limit) {
        fetch('/api/fund/transactions', {
            method: 'POST',
            body: JSON.stringify({
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
    copy(id) {
        var copyText = document.getElementById(id);
        copyText.select();
        document.execCommand("copy");
        toaster.notify('Bitcoin deposit address copied', {
            duration: 10000,
            position: 'bottom-right',
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
    unlock() {
        fetch('/api/fund/unlock', {
            method: 'POST',
            body: JSON.stringify({
                password: this.state.password
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
                    if (data.msg == 'update') {
                        this.props.update()
                    }
                    this.setState({
                        unlock_err: '',
                        unlock_modal: false,
                        unlock_otp: false
                    })
                    toaster.notify('Investment unlocked', {
                        duration: 10000,
                        position: 'bottom-right',
                    })
                } else {
                    this.setState({
                        unlock_err: data.msg
                    })
                }
            })
    }
    areaToShow(area) {
        switch (area) {
            case 0: return (
                <Row>
                    <Col>
                        <Row>
                            <Col>
                                <Banner />
                                <Banner mobile={true} />
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6} xs={12}>
                                <Card style={{ height: 150 }}>
                                    <Card.Body>
                                        <strong>Current Investment</strong>
                                        {(this.props.new ? this.props.plan != 0 : false) ?
                                            <div
                                                style={{ float: 'right' }}
                                                onClick={() => { this.setState({ unlock_modal: true }) }}
                                            >
                                                <i style={{ fontSize: 16, cursor: 'pointer' }} className="material-icons">lock_open</i>
                                            </div>
                                            : ''
                                        }
                                        {this.state.unlock_otp == true ?
                                            <Authenticator
                                                callback={() => this.unlock()}
                                                cancel={() => { this.setState({ unlock_otp: false }) }}
                                                secret={this.props.token}
                                            />
                                            :
                                            ''
                                        }
                                        <Modal show={this.state.unlock_modal} onHide={() => this.setState({ unlock_modal: false })}>
                                            <Modal.Body>
                                                <div style={{ marginLeft: 15, marginTop: 10 }}>
                                                    <strong>Unlock Investment</strong>
                                                    <div style={{ width: 'fit-content', height: 'fit-content', position: 'absolute', top: 10, right: 10, cursor: 'pointer' }} onClick={() => { this.setState({ unlock_modal: false }); this.props.cancel() }}><i className="material-icons left" style={{ fontSize: 18 }}>clear</i></div>
                                                </div>
                                                <div style={{ textAlign: 'center' }}>
                                                    <img src="../assets/images/unlock.png" style={{ width: '70%' }} />
                                                    <p>Unlock your Investment for withdraw.</p>
                                                </div>
                                                <div className="dark-form" style={{ whiteSpace: 'nowrap', marginTop: 15, textAlign: 'left' }}>
                                                    <p style={{ display: 'inline-block', marginLeft: 15, width: '30%' }}><strong>PASSWORD</strong></p>
                                                    <Form.Control type="password" id='password' onChange={this.handleChange} value={this.state.password} className="form-dark" style={this.form_dark_2} ></Form.Control>
                                                </div>
                                                <strong style={{ color: 'red' }}>{this.state.unlock_err}</strong>
                                                <Button
                                                    className='btn-blue'
                                                    disabled={this.state.password.length < 6}
                                                    onClick={() => { this.props.token == null ? this.unlock() : this.setState({ unlock_otp: true }) }}
                                                    style={{
                                                        width: '100%',
                                                        padding: 10,
                                                        color: '#FFF',
                                                        marginTop: 15
                                                    }}><strong>Unlock</strong></Button>
                                            </Modal.Body>
                                        </Modal>

                                        <div style={{ fontSize: 50, width: '100%', textAlign: 'right' }}>{this.formatNumber((this.props.plan * 50 | 0))} USD</div>
                                    </Card.Body>
                                </Card>

                                <Card style={{ height: 150 }}>
                                    <Card.Body>
                                        <strong>Return on Investment (ROI)</strong>
                                        <div style={{ fontSize: 50, width: '100%', textAlign: 'right', color: (this.props.new ? this.props.lifetime_balance * 100 / (this.props.lifetime_investment) : this.props.ROI / 2) >= 0 ? '#20c03a' : '#c11717' }}>{(this.props.new ? this.props.lifetime_balance * 100 / (this.props.lifetime_investment) : this.props.ROI / 2).toFixed(2)}%</div>

                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg={6} xs={12}>
                                <Card style={{ height: 150 }}>
                                    <Card.Body>
                                        <strong>Available for Withdraw</strong>
                                        <div style={{ fontSize: 50, width: '100%', textAlign: 'right', color: (this.props.balance - (this.props.ROI * this.props.plan * 50 / 200)) >= 0 ? '#20c03a' : '#c11717' }}>{this.formatNumber((this.props.balance - (this.props.ROI * this.props.plan * 50 / 200)).toFixed(2) || 0)} USD</div>
                                    </Card.Body>
                                </Card>
                                <Card style={{ height: 150 }}>
                                    <Card.Body>
                                        <strong>Lifetime Earned</strong>
                                        <div style={{ fontSize: 50, width: '100%', textAlign: 'right', color: this.props.lifetime_balance >= 0 ? '#20c03a' : '#c11717' }}>{this.formatNumber(((this.props.lifetime_balance - 0).toFixed(2) || 0))} USD</div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        <Row>
                            <Col lg={12} xs={12}>
                                <Card style={{ height: 400, overflowY: 'scroll' }}>
                                    <Card.Body>
                                        <Table borderless responsive>
                                            <thead>
                                                <tr>
                                                    <th>Method</th>
                                                    <th>Amount</th>
                                                    <th>Date</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.transactions.map((info) => {
                                                    return (
                                                        <tr>
                                                            <td><img style={{ width: 30, marginRight: 10 }} src={'../assets/images/BTC.png'} /></td>
                                                            <td><strong>{info.value.toFixed(2)}</strong> USD</td>
                                                            <td>{this.formatDate(info.time)}</td>
                                                            <td>{info.status ? <strong style={{ color: '#20c03a' }}>Done</strong> : <strong style={{ color: 'yellow' }}>Pending</strong>}</td>
                                                        </tr>
                                                    )
                                                })
                                                }
                                            </tbody>
                                        </Table></Card.Body>
                                </Card>
                            </Col >

                        </Row>
                    </Col >
                    <Col lg={4} xs={12}>
                        <Verify
                            kyc_status={this.props.kyc_status}
                            kyc_level={this.props.kyc_level}
                        />
                    </Col>
                </Row>

            )
            case 1: return (
                <div>
                    <Row>
                        <Col lg={4} xs={12}>
                            <Card style={{ height: 'fit-content' }}>
                                <Card.Body >
                                    <strong>Invest</strong>
                                    <div style={{ width: '100%', textAlign: 'center' }}>
                                        <img height='150' style={{ margin: 40 }} src={'../assets/images/' + ((this.props.plan + (this.state.invest_amount / 50)) < 51 ? 'BRONZE' : (this.props.plan + (this.state.invest_amount / 50)) < 151 ? 'SILVER' : (this.props.plan + (this.state.invest_amount / 50)) < 301 ? 'GOLD' : 'PLATINIUM') + '_COIN.png'} />
                                    </div>
                                    {this.props.individual_balance.map((info, index) => {
                                        return (
                                            <Button
                                                onClick={() => { this.setState({ currency_index: index }) }}
                                                className={"method-button"}
                                                style={{ marginTop: 15, marginRight: index == this.props.individual_balance.length - 1 ? 0 : 10, width: `calc(${100 / this.props.individual_balance.length}% - ${10 - (10 / this.props.individual_balance.length)}px )` }}
                                                disabled={info.disabled}
                                            >
                                                <img src={"../assets/images/" + info.currency + ".png"} style={{ height: 25 }} />
                                            </Button>
                                        )
                                    })}
                                    <div className="dark-form" style={{ whiteSpace: 'nowrap', marginTop: 15, textAlign: 'left' }}>
                                        <p style={{ display: 'inline-block', marginLeft: 15, width: '30%' }}><strong>AMOUNT</strong></p>
                                        <Form.Control type="number" id='invest_amount' min="50" step="50" onChange={this.handleChange} value={this.state.invest_amount} className="form-dark" style={this.form_dark_2} ></Form.Control>
                                        <strong style={{ display: 'inline-block', marginRight: 15, width: '20%' }}>USD</strong>
                                    </div>
                                    {this.state.invest_otp == true ?
                                        <Authenticator
                                            callback={() => this.invest()}
                                            cancel={() => { this.setState({ invest_otp: false }) }}
                                            secret={this.props.token}
                                        />
                                        :
                                        ''
                                    }
                                    <Button
                                        className='btn-blue'
                                        onClick={() => { this.props.token == null ? this.invest() : this.setState({ invest_otp: true }) }}
                                        disabled={((this.state.invest_amount % 50) != 0) | (this.state.invest_amount <= this.props.individual_balance[this.state.currency_index].balance ? false : true) | this.state.invest_amount < 50}
                                        style={{
                                            width: '100%',
                                            padding: 10,
                                            color: '#FFF',
                                            marginTop: 15
                                        }}><strong>Invest</strong></Button>
                                    <div style={{ lineHeight: 0, marginTop: 40 }}>
                                        <p>Current Investment: <strong>{this.formatNumber(this.props.plan * 50)}</strong> USD</p>
                                        <p>Account Limit: <strong>{this.props.kyc_level <= 1 ? this.formatNumber(2500) : this.formatNumber(7500)}</strong> USD. <Link to="/app/kyc"><strong>Increase limits</strong></Link></p>
                                    </div>
                                </Card.Body>

                            </Card>
                        </Col>
                        <Col lg={4} xs={12}>
                            <Card style={{ height: 'calc(100% - 10px)' }}>
                                <Card.Body>
                                    <strong>Insurance</strong>
                                    <div style={{ width: '100%', textAlign: 'center' }}>
                                        <img height='150' style={{ margin: 40 }} src={'../assets/images/insurance.png'} />
                                    </div>
                                    <div className="dark-form" style={{ whiteSpace: 'nowrap', marginTop: 15, textAlign: 'left' }}>
                                        <p style={{ display: 'inline-block', marginLeft: 15, width: '30%' }}><strong>AMOUNT</strong></p>
                                        <Form.Control type="number" id='insurance' value={this.props.plan * 0.05 * 50} className="form-dark" style={this.form_dark_2} ></Form.Control>
                                        <strong style={{ display: 'inline-block', marginRight: 15, width: '20%' }}>USD</strong>
                                    </div>
                                    <Button
                                        className='btn-blue'
                                        onClick={() => { '' }}
                                        disabled={true}
                                        style={{
                                            width: '100%',
                                            padding: 10,
                                            color: '#FFF',
                                            marginTop: 15
                                        }}><strong>Pay Insurance</strong></Button>
                                    <p>Protect your investment with 5% of the value. The insurance will last the lifetime of your plan with a max time of a year</p>

                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={4} xs={12}>
                            <Card style={{ height: 150 }}>
                                <Card.Body>
                                    <strong>Current Investment</strong>
                                    <div style={{ fontSize: 50, width: '100%', textAlign: 'right' }}>{this.formatNumber((this.props.plan * 50 | 0))} USD</div>
                                </Card.Body>
                            </Card>
                            <Card style={{ height: 150 }}>
                                <Card.Body>
                                    <strong>Lifetime Investment</strong>
                                    <div style={{ fontSize: 50, width: '100%', textAlign: 'right' }}>{this.formatNumber((this.props.lifetime_investment | 0))} USD</div>
                                </Card.Body>
                            </Card>
                            <Verify
                                kyc_status={this.props.kyc_status}
                                kyc_level={this.props.kyc_level}
                            />
                        </Col>
                    </Row>
                </div>
            )
            case 2: return ('')
            case 3: return (
                <div>
                    <Row>
                        <Col lg={6} xs={12}>
                            <Card style={{ backgroundImage: '-webkit-gradient(linear, left top, right bottom, from( #fc6909), to(#f99f01))', height: 500 }}>
                                {!this.state.check_email ?
                                    <div>
                                        {this.state.withdraw_otp == true ?
                                            <Authenticator
                                                callback={() => this.withdraw()}
                                                cancel={() => { this.setState({ withdraw_otp: false }) }}
                                                secret={this.props.token}
                                            />
                                            :
                                            ''
                                        }
                                        <Card.Body style={{ textAlign: 'center' }}>
                                            <Card.Text style={{ textAlign: 'left', color: '#FFF' }}>
                                                <strong>Withdraw</strong>
                                                <div style={{ position: 'absolute', bottom: 10, right: 10 }}>Powered by <strong>Shield</strong></div>
                                            </Card.Text>
                                            <div>
                                                <div style={{ textAlign: 'center', color: '#FFF' }}>
                                                    <div style={{ marginTop: 40, marginBottom: 60 }}>
                                                        <div style={{ fontSize: 50 }}><strong>{this.formatNumber((this.props.balance - (this.props.ROI * this.props.plan / 4)).toFixed(2) || 0)}</strong> USD</div>
                                                        <div><strong>{this.formatNumber((this.props.ROI * this.props.plan / 4).toFixed(2))}</strong> USD (unconfirmed)</div>
                                                    </div>
                                                </div>
                                                {this.props.individual_balance.map((info, index) => {
                                                    return (
                                                        <Button
                                                            onClick={() => { this.setState({ method: info.currency }) }}
                                                            className={"method-button"}
                                                            style={{ marginTop: 15, marginRight: index == this.props.individual_balance.length - 1 ? 0 : 10, width: `calc(${100 / this.props.individual_balance.length}% - ${10 - (10 / this.props.individual_balance.length)}px )` }}
                                                            disabled={info.disabled}
                                                        >
                                                            <img src={"../assets/images/" + info.currency + ".png"} style={{ height: 25 }} />
                                                        </Button>
                                                    )
                                                })}
                                                {this.props.withdraw_address == '' ? <div><strong style={{ color: 'white' }}>Please set up your bitcoin address <Link to='/app/profile'>here.</Link></strong></div> : ''}
                                                <div className="yellow-form" style={{ whiteSpace: 'nowrap', marginTop: 15, textAlign: 'left' }}>
                                                    <p style={{ display: 'inline-block', marginLeft: 15, width: '30%' }}><strong>AMOUNT</strong></p>
                                                    <Form.Control type="number" id='btc_amount' min="15" onChange={this.handleChange} value={this.state.btc_amount} className="form-dark" style={this.form_dark} ></Form.Control>
                                                    <strong style={{ display: 'inline-block', marginRight: 15, width: '20%' }}>USD</strong>
                                                </div>
                                                <div><strong style={{ color: 'red' }}>{this.state.withdraw_err}</strong></div>
                                                <div style={{ textAlign: 'left' }}><strong style={{ color: 'white' }}>{this.state.method == 'PAX' || this.state.method == 'USDT' ? 'Network fee: 1.8 ' + this.state.method : ''}</strong></div>
                                                <Button
                                                    onClick={() => { this.props.token == null ? this.withdraw() : this.setState({ withdraw_otp: true }) }}
                                                    disabled={this.state.btc_amount > (this.props.balance - (this.props.ROI * this.props.plan / 4)) || this.state.btc_amount < 3.6 || this.state.method == null || (this.state.method == 'USD' ? this.props.withdraw_address_ETH == '' : this.props.withdraw_address == '')}
                                                    style={{
                                                        width: '100%',
                                                        padding: 10,
                                                        backgroundColor: '#FFF',
                                                        borderWidth: 0,
                                                        color: '#000',
                                                        marginTop: 15
                                                    }}><strong>Withdraw</strong></Button>
                                            </div>
                                        </Card.Body>
                                    </div>
                                    :
                                    <div className="authenticator">
                                        <img src="../assets/images/verify_email@2x.png" width={120} style={{ margin: 20 }} />
                                        <div>
                                            <strong style={{ display: 'inline-block' }}>
                                                Please check your mail and confirm the withdrawal.
                                    </strong>
                                        </div>
                                        <Button
                                            className='btn-blue'
                                            onClick={() => window.location.replace('https://' + this.formatEmail(this.props.email))}
                                            style={{
                                                width: '100%',
                                                padding: 10,
                                                color: '#FFF',
                                                marginTop: 15
                                            }}><strong>Go to email</strong></Button>
                                        <p style={{ marginTop: 10 }}>Lost access to your email <a href="https://bitnationdo.freshdesk.com/"><strong>Click here.</strong></a></p>


                                    </div>
                                }

                            </Card>

                        </Col>


                        <Col lg={6} xs={12}>
                            <Card style={{ height: 500, overflowY: 'scroll' }}>
                                <Card.Body><strong>Last withdraws</strong>
                                    <Table style={{ backgroundColor: '#FFF', height: 200, borderRadius: 5 }} borderless responsive>
                                        <thead>
                                            <tr>
                                                <th>Method</th>
                                                <th>Amount</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.props.withdraw_transactions.map((info) => {
                                                return (
                                                    <tr>
                                                        <td>{info.method == 'Bitcoin' ? <img width="30" src="../assets/images/BTC.png" /> : info.method == 'USD' ? <img width="30" src="../assets/images/USD.png" /> : ''}</td>
                                                        <td><strong>{-1 * info.value.toFixed(2)}</strong> USD</td>
                                                        <td>{this.formatDate(info.time)}</td>
                                                        <td>{info.status == 1 ? <a href={'https://www.blockchain.com/es/btc/tx/' + info.txid}><strong>txid</strong></a> : <strong style={{ color: 'orange' }}>Pending</strong>}</td>
                                                    </tr>
                                                )
                                            })
                                            }
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>

                    </Row>
                    <Row>

                        <Col lg={6} xs={12}>

                            <Card style={{ height: 150 }}>
                                <Card.Body>
                                    <strong>Pending Payments</strong>
                                    <div style={{ fontSize: 50, width: '100%', textAlign: 'right' }}>{this.formatNumber((this.props.lifetime_investment | 0))} USD</div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={6} xs={12}>
                            <Card style={{ height: 150 }}>
                                <Card.Body>
                                    <strong>Lifetime Paid</strong>
                                    <div style={{ fontSize: 50, width: '100%', textAlign: 'right' }}>{this.formatNumber((this.props.lifetime_investment | 0))} USD</div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
            )
        }
    }
    myFunction() {
        document.getElementById("myDropdown").classList.toggle("show");
    }
    render() {
        return (
            <Container style={{height: 'calc(fit-content + 20px)', minHeight: '100vh'}}>
                <Row>
                    <Col style={{ marginTop: 10 }}>
                        <Button onClick={() => { this.setState({ index: 0 }) }} style={{ padding: 10, color: '#FFF' }} className={this.state.index == 0 ? 'btn-blue-active' : 'btn-blue' + ' btn btn-primary'}>General</Button>
                        <Button onClick={() => { this.setState({ index: 1 }) }} style={{ padding: 10, color: '#FFF' }} className={this.state.index == 1 ? 'btn-blue-active' : 'btn-blue' + ' btn btn-primary'}>Invest</Button>
                        <Button onClick={() => { this.setState({ index: 3 }) }} style={{ padding: 10, color: '#FFF' }} className={this.state.index == 3 ? 'btn-blue-active' : 'btn-blue' + ' btn btn-primary'}>Withdraw</Button>
                        <Ecosystem />
                    </Col>
                </Row>
                <hr />
                {this.areaToShow(this.state.index)}
            </Container>
        )
    }
}

export default Deposit;