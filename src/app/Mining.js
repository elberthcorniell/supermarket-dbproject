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
class Mining extends Component {
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
            invest_amount: 500,
            method: 0,
            btc_amount: 0
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
        this.getDeposit()
        this.getTransactions()
    }
    getDeposit() {
        fetch('/api/exchange/deposit', {
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
                console.log(data)
                if (data.success) {
                    this.setState({
                        deposit: data.result
                    })
                } else {

                }
            })
    }
    handleChange(e) {
        const { id, value } = e.target;
        this.setState({
            [id]: value
        })
    }
    invest() {
        fetch('/api/fund/invest/mining', {
            method: 'POST',
            body: JSON.stringify({
                lots: this.state.invest_amount,
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
                } else {

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
                                        <strong>Mining packs</strong>
                                        <div style={{ fontSize: 50, width: '100%', textAlign: 'right' }}>{this.formatNumber((this.props.packs | 0))} MP</div>
                                    </Card.Body>
                                </Card>

                                <Card style={{ height: 150 }}>
                                    <Card.Body>
                                        <strong>Return on Investment (ROI)</strong>
                                        <div style={{ fontSize: 50, width: '100%', textAlign: 'right', color: (/*this.props.ROI*/0 / 2) >= 0 ? '#20c03a' : '#c11717' }}>{(/*this.props.ROI*/0 / 2)}%</div>

                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg={6} xs={12}>
                                <Card style={{ height: 150 }}>
                                    <Card.Body>
                                        <strong>This week</strong>
                                        <div style={{ fontSize: 50, width: '100%', textAlign: 'right', color: (0) >= 0 ? '#20c03a' : '#c11717' }}>{this.formatNumber((0).toFixed(2) || 0)} USD</div>
                                    </Card.Body>
                                </Card>
                                <Card style={{ height: 150 }}>
                                    <Card.Body>
                                        <strong>Lifetime Earned</strong>
                                        <div style={{ fontSize: 50, width: '100%', textAlign: 'right', color: 0 >= 0 ? '#20c03a' : '#c11717' }}>{this.formatNumber((0).toFixed(2) || 0)} USD</div>
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
            case 1: return (
                <div>
                    <Row>
                        <Col lg={8} xs={12}>
                            <Card style={{ minHeight: 500 }}>
                                <Row>
                                    <Col lg={6} xs={12}>
                                        <Card.Body>
                                            <strong>Select pack</strong>
                                            <div style={{
                                                textAlign: 'center', backgroundColor: '#FFF', borderRadius: 5,
                                                boxShadow: '2px 2px 10px rgba(0,0,0,0.2)', padding: 10, margin: 10, width: '60%', marginLeft: '20%'
                                            }}>
                                                <p style={{ marginBottom: -20 }}>
                                                    <strong style={{ fontSize: 50 }}>8</strong>
                                                    MP
                                            </p>
                                                <Button
                                                    className='btn-blue'
                                                    onClick={() => this.setState({
                                                        invest_amount: 500
                                                    })}
                                                    style={{
                                                        width: '50%',
                                                        padding: 10,
                                                        color: '#FFF',
                                                        marginTop: 15
                                                    }}><strong>Select</strong></Button>
                                            </div>

                                            <div style={{
                                                textAlign: 'center', backgroundColor: '#FFF', borderRadius: 5,
                                                boxShadow: '2px 2px 10px rgba(0,0,0,0.2)', padding: 10, margin: 10, width: '60%', marginLeft: '20%'
                                            }}>
                                                <p style={{ marginBottom: -20 }}>
                                                    <strong style={{ fontSize: 50 }}>14</strong>
                                                    MP
                                            </p>
                                                <Button
                                                    className='btn-blue'
                                                    onClick={() => this.setState({
                                                        invest_amount: 700
                                                    })}
                                                    style={{
                                                        width: '50%',
                                                        padding: 10,
                                                        color: '#FFF',
                                                        marginTop: 15
                                                    }}><strong>Select</strong></Button>
                                            </div>
                                            <div style={{
                                                textAlign: 'center', backgroundColor: '#FFF', borderRadius: 5,
                                                boxShadow: '2px 2px 10px rgba(0,0,0,0.2)', padding: 10, margin: 10, width: '60%', marginLeft: '20%'
                                            }}>
                                                <p style={{ marginBottom: -20 }}>
                                                    <strong style={{ fontSize: 50 }}>20</strong>
                                                    MP
                                            </p>
                                                <Button
                                                    className='btn-blue'
                                                    onClick={() => this.setState({
                                                        invest_amount: 1000
                                                    })}
                                                    style={{
                                                        width: '50%',
                                                        padding: 10,
                                                        color: '#FFF',
                                                        marginTop: 15
                                                    }}><strong>Select</strong></Button>
                                            </div>

                                            <div style={{ lineHeight: 0, marginTop: 40 }}></div>
                                        </Card.Body>
                                    </Col>
                                    <Col lg={6} xs={12}>
                                        <Card.Body >
                                            <strong>Invest</strong>
                                            <div style={{ width: '100%', textAlign: 'center' }}>
                                                <img height='150' style={{ margin: 40 }} src={'../assets/images/mining.png'} />
                                            </div>
                                            {this.props.individual_balance.map((info, index) => {
                                                return (
                                                    <Button
                                                        onClick={() => { this.setState({ method: index }) }}
                                                        className={this.state.method == index ? "method-button-active" : "method-button"}
                                                        style={{ marginRight: index == this.props.individual_balance.length - 1 ? 0 : 10, width: `calc(${100 / this.props.individual_balance.length}% - ${10 - (10 / this.props.individual_balance.length)}px )` }}
                                                        disabled={info.disabled}
                                                    >
                                                        <img src={"../assets/images/" + info.currency + ".png"} style={{ height: 25 }} />
                                                    </Button>
                                                )
                                            })}
                                            <div className="dark-form" style={{ whiteSpace: 'nowrap', marginTop: 15, textAlign: 'left' }}>
                                                <p style={{ display: 'inline-block', marginLeft: 15, width: '30%' }}><strong>AMOUNT</strong></p>
                                                <Form.Control id='invest_amount' value={this.state.invest_amount} className="form-dark" style={this.form_dark_2} ></Form.Control>
                                                <strong style={{ display: 'inline-block', marginRight: 15, width: '20%' }}>USD</strong>
                                            </div>
                                            <Button
                                                className='btn-blue'
                                                onClick={() => this.invest()}
                                                disabled={((this.state.invest_amount % 50) != 0) | (this.state.invest_amount <= this.props.individual_balance[this.state.method].balance ? false : true) | this.state.invest_amount < 50}
                                                style={{
                                                    width: '100%',
                                                    padding: 10,
                                                    color: '#FFF',
                                                    marginTop: 15
                                                }}><strong>Buy packs</strong></Button>
                                            <div style={{ lineHeight: 0, marginTop: 40 }}>
                                                <p>Active Mining packs: <strong>{this.formatNumber(this.props.packs)}</strong> MP</p>
                                            </div>
                                        </Card.Body>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col lg={4} xs={12}>
                            <Verify
                                kyc_status={this.props.kyc_status}
                                kyc_level={this.props.kyc_level}
                            />
                        </Col>


                    </Row>
                </div>
            )
            case 2: return ('')
        }
    }
    render() {
        return (
            <Container style={{ height: 'calc(fit-content + 20px)', minHeight: '100vh' }}>
                <Row>
                    <Col style={{ marginTop: 10 }}>
                        <Button onClick={() => { this.setState({ index: 0 }) }} style={{ padding: 10, color: '#FFF' }} className={this.state.index == 0 ? 'btn-blue-active' : 'btn-blue' + ' btn btn-primary'}>General</Button>
                        <Button onClick={() => { this.setState({ index: 1 }) }} style={{ padding: 10, color: '#FFF' }} className={this.state.index == 1 ? 'btn-blue-active' : 'btn-blue' + ' btn btn-primary'}>Invest</Button>
                        <Button onClick={() => { this.setState({ index: 2 }) }} style={{ padding: 10, color: '#FFF' }} className={this.state.index == 2 ? 'btn-blue-active' : 'btn-blue' + ' btn btn-primary'}>Live Pool</Button>
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

export default Mining;