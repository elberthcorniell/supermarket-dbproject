import React, { Component } from 'react';
import {
    Card,
    Col,
    Container,
    Row,
    Button,
    Form,
    Table
} from "react-bootstrap"
import { QRCode } from 'react-qrcode-logo';
import toaster from 'toasted-notes';
import Banner from './Banner';
import Verify from './Verify'
import Ecosystem from './Ecosystem'
class Network extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Bitcoin_price: 0,
            buy: true,
            balance_btc: 0,
            data: {},
            currency: 'BTC',
            transactions: [],
            wallet_state: true,
            index: 0,
            total_investment: 0,
            total_users: 0,
            btc_amount: 0,
            network_err: '',
            referals: [],
            method: 0,
            referal_investing: true,
            referal_KYC: false,
            referal_network: false,
            sides: [{ total: 0, last: 0 }, { total: 0, last: 0 }, { total: 0, last: 0 }]
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
        this.form_dark_2.width = '40%'
        this.form_dark_2.backgroundColor = '#f3f5f7'
        this.form_dark_2.color = '#000'
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        this.getTransactions()
        this.getReferals()
        this.getNetworkData()
    }
    handleChange(e) {
        const { id, value } = e.target;
        this.setState({
            [id]: value
        })
    }
    joinNetwork() {
        fetch('/api/fund/network/join', {
            method: 'POST',
            body: JSON.stringify({
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
                if (data.success) {
                    this.props.update()
                    this.setState({
                        network_err: ''
                    })
                } else {
                    this.setState({
                        network_err: data.msg
                    })
                }
            })
    }

    getNetworkData() {
        fetch('/api/fund/network/data', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('authtoken')
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    console.log(data)
                    this.setState({
                        total_investment: data.result[0],
                        total_users: data.result[1]
                    })
                }
            })
    }
    getReferals() {
        fetch('/api/fund/network/referal', {
            method: 'POST',
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
                        referals: data.result
                    })
                }
            })
    }
    getTransactions(limit) {
        fetch('/api/fund/transactions', {
            method: 'POST',
            body: JSON.stringify({
                limit,
                network: true
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
        this.props.network ?
            toaster.notify('Referal link copied', {
                duration: 10000,
                position: 'bottom-right',
            })
            :
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
    getDiferential(int) {
        if (int < 500) {
            return 0
        } else if (int >= 500 & int < 1500) {
            return 3
        } else if (int >= 1500 & int < 2500) {
            return 6
        } else if (int >= 2500 & int < 7500) {
            return 9
        } else if (int >= 7500 & int < 15000) {
            return 12
        } else if (int >= 15000 & int < 30000) {
            return 15
        } else if (int >= 30000 & int < 40000) {
            return 18
        } else if (int >= 40000) {
            return 21
        }
    }
    areaToShow(area) {
        switch (area) {
            case 0:
                return (
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
                                            <strong>Investment leverage</strong>
                                            <div style={{ fontSize: 50, width: '100%', textAlign: 'right' }}>{this.formatNumber((this.props.leverage * 50 | 0))} USD</div>
                                        </Card.Body>
                                    </Card>
                                    <Card style={{ height: 150 }}>
                                        <Card.Body>
                                            <strong>Leverage ratio</strong>
                                            <div style={{ fontSize: 50, width: '100%', textAlign: 'right' }}>{((this.props.leverage + this.props.plan) / this.props.plan).toFixed(2)}:1</div>

                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col lg={6} xs={12}>
                                    <Card style={{ height: 150 }}>
                                        <Card.Body>
                                            <strong>Active percentage</strong>
                                            <div style={{ fontSize: 50, width: '100%', textAlign: 'right' }}>{this.getDiferential(this.state.total_investment)}%</div>
                                        </Card.Body>
                                    </Card>
                                    <Card style={{ height: 150 }}>
                                        <Card.Body>
                                            <strong>Lifetime Earned</strong>
                                            <div style={{ fontSize: 50, width: '100%', textAlign: 'right', color: this.props.network_balance >= 0 ? '#20c03a' : '#c11717' }}>{this.props.network_balance} USD</div>
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
                                                        <th>Description</th>
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
                                                                <td>{info.description}</td>

                                                                <td>{this.formatDate(info.time)}</td>
                                                                <td>{info.status ? <strong style={{ color: '#20c03a' }}>Done</strong> : <strong style={{ color: '#c11717' }}>Pending</strong>}</td>
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
            case 1:
                return (
                    <div>
                        <Row>
                            <Col lg={8} xs={12}>
                                <Card style={{ xOveerflow: 'hidden', yOverflow: 'scroll' }}>
                                    <Card.Body >
                                        <strong>Network resume</strong>
                                        <div>
                                            <div className='resume'>
                                                <strong>Total users</strong>
                                                <p>{this.state.total_users}</p>
                                            </div>
                                            <div className='resume'>
                                                <strong>Total volume</strong>
                                                <p>{this.state.total_investment} PPV</p>
                                            </div>
                                            <div className='resume'>
                                                <img src="../assets/images/NO_RANK.png" height="150" />
                                            </div>
                                        </div>
                                        <hr />
                                    </Card.Body>
                                </Card>

                                <Card style={{ height: 500, overflow: 'scroll' }}>
                                    <Card.Body >
                                        <strong>Direct referals</strong>
                                        <div style={{ float: 'right' }}>
                                            <Button onClick={() => this.setState({ referal_investing: !this.state.referal_investing })} className={this.state.referal_investing ? 'btn-blue-active' : 'btn-blue'} >Investing</Button>
                                            <Button onClick={() => this.setState({ referal_KYC: !this.state.referal_KYC })} className={this.state.referal_KYC ? 'btn-blue-active' : 'btn-blue'} >KYC</Button>
                                            <Button onClick={() => this.setState({ referal_network: !this.state.referal_network })} className={this.state.referal_network ? 'btn-blue-active' : 'btn-blue'} >Network</Button>
                                        </div>
                                        <Table borderless responsive>
                                            <thead>
                                                <tr>
                                                    <th>Username</th>
                                                    <th>ROI</th>
                                                    <th>Investment</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.referals.map((info) => {
                                                    if ((this.state.referal_KYC ? info.KYC == true : true) && (this.state.referal_network ? info.network == true : true) && (this.state.referal_investing ? info.investment > 0 : true)) {
                                                        return (
                                                            <tr>
                                                                <td>{info.username}</td>
                                                                <td><strong>{(info.ROI / 2).toFixed(2)} %</strong></td>
                                                                <td><strong>{info.investment * 50}</strong> USD</td>
                                                            </tr>
                                                        )
                                                    }
                                                })
                                                }
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg={4} xs={12}>
                                <Card style={{ height: 270 }}>
                                    <Card.Body >
                                        <strong>Highest rank</strong>
                                        <div style={{ width: '100%', textAlign: 'center' }}>
                                            <img height='150' style={{ margin: 40 }} src={'../assets/images/NO_RANK.png'} />
                                        </div>
                                    </Card.Body>
                                </Card>
                                <Card style={{ height: 240 }}>
                                    <Card.Body style={{ alignContent: 'center' }}>
                                        <Card.Text>
                                            <strong>Referal Link</strong>
                                            <p>Increase your daily profit by refering people to be part our family! <a href="#"><strong>More info.</strong></a></p>
                                        </Card.Text>
                                        <div className="dark-form" style={{ whiteSpace: 'nowrap' }}>
                                            <Form.Control id="referal-link" value={"inverte.do/auth/register?u=" + this.props.username} className="form-dark" style={this.form_dark_2}></Form.Control>
                                        </div>
                                        <Button
                                            className='btn-blue'
                                            onClick={() => this.copy("referal-link")}
                                            style={{
                                                width: '100%',
                                                padding: 10,
                                                color: '#FFF',
                                                marginTop: 15
                                            }}><strong>Copy</strong></Button>
                                    </Card.Body>
                                </Card>
                            </Col>

                        </Row>
                    </div>
                )
            case 2:
                return (
                    <Row>
                        <Col lg={12} xs={12}>
                            <Card>
                                <Card.Body style={{ overflow: 'hidden' }}>
                                    <div>
                                        <strong>Network tree</strong>
                                    </div>
                                    <iframe src="https://inverte.do/app/tree" height='500px' width='100%' style={{ border: 'none', borderRadius: 10, marginTop: 10 }} />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )
        }
    }
    render() {
        return (
            <Container style={{height: 'calc(fit-content + 20px)', minHeight: '100vh'}}>
                {this.props.network ?
                    <div>
                        <Row>
                            <Col style={{ marginTop: 10 }}>
                                <Button onClick={() => { this.setState({ index: 0 }) }} style={{ padding: 10, color: '#FFF' }} className={this.state.index == 0 ? 'btn-blue-active' : 'btn-blue' + ' btn btn-primary'}>General</Button>
                                <Button onClick={() => { this.setState({ index: 1 }) }} style={{ padding: 10, color: '#FFF' }} className={this.state.index == 1 ? 'btn-blue-active' : 'btn-blue' + ' btn btn-primary'}>Network</Button>
                                <Button onClick={() => { this.setState({ index: 2 }) }} style={{ padding: 10, color: '#FFF' }} className={this.state.index == 2 ? 'btn-blue-active' : 'btn-blue' + ' btn btn-primary'}>Tree</Button>
                                <Ecosystem />
                            </Col>
                        </Row>
                        <hr />
                        {this.areaToShow(this.state.index)}
                        <div style={{ height: 60 }}></div>
                    </div>
                    :
                    <Row>
                        <Col lg={8} xs={12}>
                            <Card style={{ height: 'fit-content' }}>
                                <Card.Body >
                                    <strong>Membership</strong>
                                    <div style={{ width: '100%', textAlign: 'center' }}>
                                        <img height='150' style={{ margin: 40 }} src={'../assets/images/referal.png'} />
                                    </div>
                                    {this.props.individual_balance.map((info, index) => {
                                        return (
                                            <Button
                                                onClick={() => { this.setState({ method: index }) }}
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
                                        <Form.Control type="number" value={20} className="form-dark" style={this.form_dark_2} ></Form.Control>
                                        <strong style={{ display: 'inline-block', marginRight: 15, width: '20%' }}>USD</strong>
                                    </div>
                                    <Button
                                        className='btn-blue'
                                        onClick={() => this.joinNetwork()}
                                        disabled={this.props.individual_balance[this.state.method].balance < 20}
                                        style={{
                                            width: '100%',
                                            padding: 10,
                                            color: '#FFF',
                                            marginTop: 15
                                        }}><strong>Join the network</strong></Button>
                                    <div><strong style={{ color: 'red' }}>{this.state.network_err}</strong></div>
                                    <div style={{ lineHeight: 1, marginTop: 40 }}>
                                        <p>A <strong>20</strong> USD Membership fee may be charged yearly only if you earn it. <a href="#"><strong>Learn more</strong></a></p>
                                    </div>
                                </Card.Body>

                            </Card>
                        </Col>
                    </Row>}
            </Container>
        )
    }
}

export default Network;