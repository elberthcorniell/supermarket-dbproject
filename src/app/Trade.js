import React, { Component } from 'react';
import { Line, Chart } from 'react-chartjs-2';
import {
    Card,
    Col,
    Container,
    Row,
    Button,
    Form,
    Table,
    Modal,
    Carousel
} from "react-bootstrap"
import Banner from './Banner'
import Verify from './Verify'
import toaster from 'toasted-notes';
import { QRCode } from 'react-qrcode-logo';
import ProfileWidget from './ProfileWidget';
import Glider from '../public/js/glider'

Chart.defaults.scale.gridLines.display = false
class Trade extends Component {
    constructor(props) {
        super(props);
        this.state = {
            plan: '',
            transactions: [],
            base: 'USD',
            AUM: '',
            AAR: '',
            unlock_modal: false,
            transaction: true,
            Interest: false,
            Investment: false
        };
        this.change = this.change.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleTab = this.handleTab.bind(this);

    }
    componentDidMount() {
        this.getTransactions(5)
        this.getAUM()
        this.mount()
    }
    componentDidUpdate() {
    }
    change(buy) {
        this.setState({
            buy
        })
    }

    handleChange(e) {
        const { id, value } = e.target;
        this.setState({
            [id]: value
        })
    }
    handleTab(e) {
        const { id } = e.target;
        this.setState({
            transaction: false,
            Interest: false,
            Investment: false
        }, () => {
            this.setState({
                [id]: true
            })
        })
    }
    getTransactions(limit) {
        fetch('/api/fund/transactions', {
            method: 'POST',
            body: JSON.stringify({
                limit: true
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
    getAUM() {
        fetch('/api/fund/AUM', {
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
                        AUM: (141400 + data.AUM).toFixed(),
                        AAR: data.AAR
                    })
                } else {

                }
            })
    }
    formatNumber(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    mount() {
        new Glider(document.querySelector('.glider'), {
            // Mobile-first defaults
            slidesToShow: 1.3,
            slidesToScroll: 1,
            scrollLock: true,
            draggable: true,
            dots: '.dots',
            arrows: {
                prev: '.glider-prev',
                next: '.glider-next'
            },
            responsive: [{
                breakpoint: 576,
                settings: {
                    slidesToScroll: 1,
                    slidesToShow: 2.2,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToScroll: 1,
                    slidesToShow: 2.6,
                }
            }
            ]
        });
    }
    copy(id) {
        var copyText = document.getElementById(id);
        copyText.select();
        document.execCommand("copy");
        toaster.notify('Referal link copied', {
            duration: 10000,
            position: 'bottom-right',
        })
    }
    render() {
        const form_dark = {
            display: 'inline-block',
            width: '100%',
            height: '100%',
            backgroundColor: '#f3f5f7',
            borderStyle: 'none',
            fontWeight: 'bold'
        }
        /*
                        <div className="show">
                            <ProfileWidget
                                network={this.props.network}
                                kyc_level={this.props.kyc_level}
                                username={this.props.username}
                            />
                        </div>*/
        return (
            <Container style={{ height: 'calc(fit-content + 20px)', minHeight: '100vh' }}>
                <Row>
                    <Col>
                        {this.props.token == null ?
                            <Card style={{ backgroundColor: 'red', padding: 10, color: 'white', fontWeight: 700 }}>
                                <i className="fa fa-warning" style={{ fontSize: 24, color: 'yellow', position: 'absolute', right: 15 }} ></i>Please enable 2 Factor Authentication to increase your account security!</Card>
                            :
                            ''
                        }
                        <Card>
                            <Card.Body>
                                <Row>
                                    <Col xs={12} lg={4}>
                                        <strong style={{ fontSize: 14, color: "#c8cdd3" }}>TOTAL BALANCE</strong>
                                        <div style={{ marginTop: 20, marginBottom: 20 }}>
                                            <strong style={{ fontSize: 28, verticalAlign: "text-top", color: "#293b51" }}>$</strong>
                                            <strong style={{ fontSize: 42, verticalAlign: "text-top", color: "#293b51" }}>{this.formatNumber((this.props.balance + this.props.wallet_balance + this.props.wallet_unconfirmed_balance).toFixed(2))}</strong>
                                        </div>
                                        <div style={{ width: "50%", textAlign: "center", display: "inline-block", padding: 10 }}>
                                            <strong style={{ color: "#c8cdd3", fontWeight: 500 }}>Interest</strong>
                                            <strong style={{ color: "#293b51" }}>&nbsp;&nbsp;${this.formatNumber(this.props.balance.toFixed(2))}</strong>
                                            <div style={{ height: 5, width: "100%", backgroundColor: "#ecedf2", borderRadius: 5, overflow: "hidden" }}>
                                                <div style={{ height: 5, width: "40%", backgroundColor: "green", borderRadius: 5 }}>

                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ width: "50%", textAlign: "center", display: "inline-block", padding: 10 }}>
                                            <strong style={{ color: "#c8cdd3", fontWeight: 500 }}>Wallet</strong>
                                            <strong style={{ color: "#293b51" }}>&nbsp;&nbsp;${this.formatNumber((this.props.wallet_balance + this.props.wallet_unconfirmed_balance).toFixed(2))}</strong>
                                            <div style={{ height: 5, width: "100%", backgroundColor: "#ecedf2", borderRadius: 5, overflow: "hidden" }}>
                                                <div style={{ height: 5, width: "40%", backgroundColor: "green", borderRadius: 5 }}>

                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            className="btn-blue"
                                        >
                                            &nbsp;&nbsp;&nbsp;&nbsp;Send&nbsp;&nbsp;&nbsp;&nbsp;<i className="material-icons right" style={{ fontSize: 18 }}>call_made</i>&nbsp;&nbsp;&nbsp;&nbsp;
                                    </Button>
                                        <Button
                                            className="btn-gray"
                                        >
                                            <i className="material-icons right" style={{ fontSize: 18 }}>call_made</i>
                                        </Button>
                                        <Button
                                            className="btn-gray"
                                        >
                                            <i className="material-icons right" style={{ fontSize: 18 }}>call_received</i>
                                        </Button>
                                    </Col>
                                    <Col xs={12} lg={8}>
                                        <div className="glider-contain" style={{ height: '100%', width: '100%' }}>
                                            <div className="glider" style={{ height: "100%", minHeight: 250 }}>
                                                <Card className="coin" style={{ backgroundImage: "linear-gradient(to bottom right, #bad047, #ece638)", height: "100%" }}>
                                                    <Card.Body >
                                                        <div>
                                                            <img src={`../assets/images/PAX.png`} style={{ float: "left" }} height={50} />
                                                        </div>
                                                        <div style={{ marginTop: 10, marginBottom: 10, position: "absolute", bottom: 0 }}>
                                                            <p style={{ color: "white", fontSize: 18, fontWeight: 500, lineHeight: 0 }}>Paxos Standard</p>
                                                            <strong style={{ fontSize: 28, verticalAlign: "text-top", color: "#293b51" }}>$</strong>
                                                            <strong style={{ fontSize: 42, verticalAlign: "text-top", color: "#293b51" }}>{this.formatNumber((this.props.balance + this.props.wallet_balance + this.props.wallet_unconfirmed_balance).toFixed(2))}</strong>
                                                            <p style={{ color: "#293b51", fontSize: 14, fontWeight: 500 }}>Earn {(this.state.AAR || 0).toFixed(2)}% a.p.r.</p>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                                <Card className="coin" style={{ backgroundImage: "linear-gradient(to bottom right, #53ae94, #edfa7c)", height: 260 }}>
                                                    <Card.Body>
                                                        <i className="material-icons right" style={{ color: "white", float: "right" }}>fullscreen</i>
                                                        <div>
                                                            <img src={`../assets/images/USDT.png`} style={{ float: "left" }} height={50} />
                                                        </div>
                                                        <div style={{ marginTop: 10, marginBottom: 10, position: "absolute", bottom: 0 }}>
                                                            <p style={{ color: "white", fontSize: 18, fontWeight: 500, lineHeight: 0 }}>Tether USD</p>
                                                            <strong style={{ fontSize: 28, verticalAlign: "text-top", color: "#293b51" }}>$</strong>
                                                            <strong style={{ fontSize: 42, verticalAlign: "text-top", color: "#293b51" }}>{this.formatNumber((this.props.balance + this.props.wallet_balance + this.props.wallet_unconfirmed_balance).toFixed(2))}</strong>
                                                            <p style={{ color: "#293b51", fontSize: 14, fontWeight: 500 }}>Earn {(this.state.AAR || 0).toFixed(2)}% a.p.r.</p>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                                <Card className="coin" style={{ backgroundImage: "linear-gradient(to bottom right, #f5ac36, #fcd06d)", height: 260 }}>
                                                    <Card.Body>
                                                        <div>
                                                            <img src={`../assets/images/DAI.png`} style={{ float: "left" }} height={50} />
                                                        </div>
                                                        <div style={{ marginTop: 30, marginBottom: 10, position: "absolute", bottom: 0 }}>
                                                            <p style={{ color: "white", fontSize: 18, fontWeight: 500, lineHeight: 0 }}>Multi Collateral DAI</p>
                                                            <strong style={{ fontSize: 28, verticalAlign: "text-top", color: "#293b51" }}>$</strong>
                                                            <strong style={{ fontSize: 42, verticalAlign: "text-top", color: "#293b51" }}>{this.formatNumber((this.props.balance + this.props.wallet_balance + this.props.wallet_unconfirmed_balance).toFixed(2))}</strong>
                                                            <p style={{ color: "#293b51", fontSize: 14, fontWeight: 500 }}>Earn {((this.state.AAR || 0) + 4).toFixed(2)}% a.p.r.</p>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </div>
                                            <button role="button" aria-label="Previous" class="glider-prev" style={{ color: 'white' }}><i className='material-icons' style={{ color: 'white' }}>chevron_left</i></button>
                                            <button role="button" aria-label="Next" class="glider-next" style={{ color: 'white' }}><i className='material-icons' style={{ color: 'white' }}>chevron_right</i></button>
                                            <div role="tablist" class="dots" style={{ display: "none" }}></div>

                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col lg={8} xs={12}>
                        <div>
                            <label htmlFor="transaction" >
                                <input type="radio" id="transaction" name="table" checked={this.state.transaction ? "checked" : false} onChange={this.handleTab} />
                                <span className="btn-tab" >Transactions</span>
                            </label>
                            <label htmlFor="Interest" >
                                <input type="radio" id="Interest" name="table" onChange={this.handleTab} />
                                <span className="btn-tab" >Interest</span>
                            </label>
                            <label htmlFor="Investments" >
                                <input type="radio" id="Investments" name="table" onChange={this.handleTab} />
                                <span className="btn-tab" >My Investments</span>
                            </label>
                        </div>
                        <Card.Body style={{ padding: 0, paddingRight: 20, paddingLeft: 20 }}>
                            {this.state.Interest ?
                                <Table borderless responsive>
                                    <tbody>

                                        {this.state.transactions.map((info) => {
                                            return (
                                                <tr>
                                                    <td><img style={{ width: 30, marginRight: 10 }} src={'../assets/images/BTC.png'} /></td>
                                                    <td><strong>{this.props.currency[this.props.currency_index].symbol == 'BTC' ? (info.value / this.props.currency[this.props.currency_index].price).toFixed(8) : (info.value * this.props.currency[this.props.currency_index].price).toFixed(2)}</strong> {this.props.currency[this.props.currency_index].symbol}</td>
                                                    <td>{this.formatDate(info.time)}</td>
                                                    <td><i className="material-icons right" style={{ color: "#293b51", cursor: "pointer" }}>more_horiz</i></td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>

                                : ''}
                            {this.state.transaction ?
                                <Table borderless responsive>
                                    <tbody>
                                        {this.props.wallet_transactions.map((info) => {
                                            return (
                                                <tr>
                                                    <td><img style={{ width: 30, marginRight: 10 }} src={`../assets/images/${info.currency}.png`} /></td>
                                                    <td><strong>{info.value}</strong></td>
                                                    <td>{this.formatDate(info.date)}</td>
                                                    <td><i className="material-icons right" style={{ color: "#293b51", cursor: "pointer" }}>more_horiz</i></td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>

                                : ''}
                        </Card.Body>
                    </Col>
                    <Col lg={4} xs={12}>
                        <Card style={{ height: "fit-content" }}>
                            <Carousel>
                                <Carousel.Item>
                                    <img
                                        src={`../assets/images/247.jpg`} width="100%"
                                    />
                                </Carousel.Item>
                            </Carousel>
                            <Card.Body style={{ padding: 20 }}>
                                <Button
                                    className="btn-blue"
                                >
                                    Blog&nbsp;&nbsp;&nbsp;&nbsp;<i className="material-icons right" style={{ fontSize: 18 }}>call_made</i>&nbsp;&nbsp;&nbsp;&nbsp;
                                    </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Trade;
/*       <Container style={{ height: 'calc(fit-content + 20px)', minHeight: '100vh' }}>
                    <Row>
                        <Col>
                            {this.props.token == null ?
                                <Card style={{ backgroundColor: 'red', padding: 10, color: 'white', fontWeight: 700 }}>
                                    <i className="fa fa-warning" style={{ fontSize: 24, color: 'yellow', position: 'absolute', right: 15 }} ></i>Please enable 2 Factor Authentication to increase your account security!</Card>
                                :
                                ''
                            }
                        </Col>
                    </Row>
                    <Row className='flex-column-reverse flex-lg-row'>
                        <Col lg={8} xs={12}>
                            {this.props.token == null ?
                                <Card style={{ backgroundColor: 'red', padding: 10, color: 'white', fontWeight: 700 }}>
                                    <i className="fa fa-warning" style={{ fontSize: 24, color: 'yellow', position: 'absolute', right: 15 }} ></i>Please enable 2 Factor Authentication to increase your account security!</Card>
                                :
                                ''
                            }
                            <Card style={{ maxHeight: 505, overflow: 'hidden' }}>
                                <Card.Body style={{ marginBottom: -15, paddingBottom: 0 }}>
                                    <Card.Text>
                                        <strong>Resume</strong>
                                    </Card.Text>
                                    <Line
                                        options={{
                                            responsive: true,
                                            legend: {
                                                display: false
                                            },
                                            scales: {
                                                xAxes: [{
                                                    ticks: {
                                                        display: false //this will remove only the label
                                                    }
                                                }]
                                            }
                                        }}
                                        data={this.state.data}
                                    />
                                    <hr />
                                </Card.Body>
                            </Card>
                            <Card style={{ minHeight: 200, maxHeight: 500, overflowY: 'scroll' }}>
                                <Card.Body>
                                    <strong>Last transactions</strong>
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
                                                        <td><strong>{this.props.currency[this.props.currency_index].symbol == 'BTC' ? (info.value / this.props.currency[this.props.currency_index].price).toFixed(8) : (info.value * this.props.currency[this.props.currency_index].price).toFixed(2)}</strong> {this.props.currency[this.props.currency_index].symbol}</td>
                                                        <td>{this.formatDate(info.time)}</td>
                                                        <td>{info.status ? <strong style={{ color: '#20c03a' }}>Done</strong> : <strong style={{ color: '#c11717' }}>Pending</strong>}</td>
                                                    </tr>
                                                )
                                            })
                                            }
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>

                        </Col>
                        <Col lg={4} xs={12}>
                            <Card style={{ backgroundImage: '-webkit-gradient(linear, left top, right bottom, from( #fc6909), to(#f99f01))', height: 200 }}>
                                <Card.Body >
                                    <Card.Text style={{ color: '#FFFFFF' }}>
                                        <strong>Your Balance</strong>
                                        <p style={{ lineHeight: 2, fontSize: 32 }}><strong>{this.props.currency[this.props.currency_index].symbol == 'BTC' ? ((this.props.balance + this.props.wallet_balance + this.props.wallet_unconfirmed_balance).toFixed(2) / this.props.currency[this.props.currency_index].price).toFixed(8) : (this.props.balance + this.props.wallet_balance + this.props.wallet_unconfirmed_balance).toFixed(2) / this.props.currency[this.props.currency_index].price}</strong> {this.props.currency[this.props.currency_index].symbol}</p>
                                    </Card.Text>
                                    <div style={{ marginBottom: 10 }}>

                                        <hr />
                                    </div>
                                    <div style={{ position: 'absolute', bottom: 15 }}>

                                        <Button onClick={() => { this.props.setState({ currency_index: 0 }) }} className={this.props.currency[this.props.currency_index].symbol == 'USD' ? 'btn-blue-active' : 'btn-blue'}>USD</Button>
                                        <Button onClick={() => { this.props.setState({ currency_index: 1 }) }} className={this.props.currency[this.props.currency_index].symbol == 'BTC' ? 'btn-blue-active' : 'btn-blue'}>BTC</Button>

                                    </div>
                                </Card.Body>
                            </Card>
                            <Card style={{ height: 240 }}>
                                <Card.Body style={{ alignContent: 'center' }}>
                                    <i className="fa fa-qrcode" style={{ fontSize: 24, cursor: 'pointer', position: 'absolute', top: 15, right: 15 }} onClick={() => { this.setState({ unlock_modal: true }) }}></i>
                                    <Modal show={this.state.unlock_modal} onHide={() => this.setState({ unlock_modal: false })}>
                                        <Modal.Header>
                                            <strong>Referal QR</strong>
                                        </Modal.Header>
                                        <Modal.Body style={{ textAlign: 'center', padding: 30 }}>
                                            <QRCode
                                                style={{
                                                }}
                                                value={"inverte.do/auth/register?u=" + this.props.username}
                                                size='210'
                                                bgColor='#fff'
                                                fgColor='#01153d'
                                                logoImage='../assets/images/qr_logo.png'
                                                logoWidth='60'
                                                quietZone=''
                                            />
                                            <div></div>
                                            <strong style={{ marginTop: 20, marginBottom: 20 }}>Show this QR to your friends and family when they are going to register on Inverte and Increase your profit!</strong>

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

                                    <Card.Text>
                                        <strong>Referal Link</strong>
                                        <p>Increase your daily profit by refering people to be part our family! <a href="#"><strong>More info.</strong></a></p>

                                    </Card.Text>
                                    <div className="dark-form" style={{ whiteSpace: 'nowrap' }}>
                                        <Form.Control id="referal-link" value={"inverte.do/auth/register?u=" + this.props.username} className="form-dark" style={form_dark}></Form.Control>
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
                            <Verify
                                kyc_status={this.props.kyc_status}
                                kyc_level={this.props.kyc_level}
                            />
                            <Card style={{ minHeight: 100 }}>
                                <Card.Body >
                                    <strong>Assets Under Management (AUM)</strong>
                                    <h1><strong>{this.props.currency[this.props.currency_index].symbol == 'BTC' ? (this.state.AUM / this.props.currency[this.props.currency_index].price).toFixed(8) : this.formatNumber(this.state.AUM / this.props.currency[this.props.currency_index].price)}</strong> {this.props.currency[this.props.currency_index].symbol}</h1>
                                    <strong>Annual Percentage Rate (APR)</strong>
                                    <h1><strong>{this.formatNumber(this.state.AAR)}</strong>%</h1>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <div style={{ height: 60 }}></div>
                </Container>
                */