import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Trade from './Trade';
import Sidebar from './Sidebar';
import Deposit from './Investment';
import Profile from './Profile';
import Mining from './Mining';
import Network from './Network';
import Oneauth from './Oneauth';
import Tree from "./Tree";
import toaster from 'toasted-notes';
import Cashier from './Cashier';
const webs = new WebSocket('wss://ws.blockchain.info/inv')
class Backoffice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Bitcoin_price: 0,
            wallet_transactions: [],
            wallet_balance: 0,
            wallet_unconfirmed_balance: 0,
            withdraw_transactions: [],
            total_balance: 0,
            packs: 0,
            network_balance: 0,
            network: 0,
            kyc_level: 0,
            kyc_status: 0,
            email: '',
            new: true,
            individual_balance: [
                {
                balance: 0,
                unconfirmed_balance: 0,
                currency: ''
            }
            ],
            token: '',
            currency: [
                { symbol: 'USD', price: 1 },
                { symbol: 'BTC', price: 0 }
            ],
            currency_index: 0
        };
    }
    componentDidMount() {
        this.getBalance()
        this.verify()
        this.getPlan()
        this.getWallet()
        this.getROI()
        this.getPrice()
        this.getKYC()
        webs.onmessage = message => {
            if (data.op == 'utx') {
                toaster.notify('New deposit received to your Wallet', {
                    duration: 10000,
                    position: 'bottom-right',
                })
                this.getWallet()
            }
        }


    }
    componentDidUpdate() {

        if (webs.readyState == 1) {
            webs.send(JSON.stringify({ "op": "addr_sub", "addr": this.state.address }))
        }
    }
    getPrice() {
        fetch('https://bitpay.com/api/rates/BTC', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('authtoken')
            }
        })
            .then(res => res.json())
            .then(data => {
                data.map(dat => {
                    if (dat.code == 'USD') {
                        this.setState({
                            currency: [
                                { symbol: 'USD', price: 1 },
                                { symbol: 'BTC', price: dat.rate }
                            ]
                        })
                    }
                })
            })
            .catch(err => console.error(err));
    }
    verify() {
        fetch('/api/fund/verify', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('authtoken')
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success === false) {
                    window.location.replace('../auth/login');
                } else {
                    this.setState({
                        username: data.username
                    })
                }
            })
            .catch(err => console.error(err));
    }
    getBalance() {
        fetch('/api/fund/balance', {
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
                        total_balance: data.total_balance,
                        lifetime_balance: data.lifetime_balance
                    })
                } else {

                }
            })
        fetch('/api/fund/balance/network', {
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
                        network_balance: data.network_balance
                    })
                } else {

                }
            })
    }

    getWallet() {
        fetch('/api/fund/withdraw/address', {
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
                        withdraw_address: data.withdraw_address,
                        withdraw_address_ETH: data.withdraw_address_ETH
                    })
                } else {

                }
            })
        fetch('/api/fund/withdraw/transactions', {
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
                        withdraw_transactions: data.withdraw_transactions
                    })
                } else {

                }
            })
        fetch('/api/fund/wallet', {
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
                        individual_balance: data.balance,
                        wallet_balance: data.total_balance,
                        wallet_unconfirmed_balance: data.unconfirmed_balance
                    })
                } else {

                }
            })

        fetch('/api/fund/wallet/transactions', {
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
                        wallet_transactions: data.wallet_transactions
                    })
                } else {

                }
            })
    }
    getROI() {
        fetch('/api/fund/ROI', {
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
                if (data.inactive) {
                    localStorage.setItem('authtoken', '')
                    alert("Inactive account. Contact support.")
                    window.location.replace('../auth/login');
                }
                if (data.success) {
                    this.setState({
                        ROI: data.ROI,
                        token: data['2fa'],
                        address: data.address,
                        leverage: data.leverage,
                        network: data.network,
                        email: data.email,
                        new: data.new
                    })
                } else {

                }
            })
    }
    getKYC() {
        fetch('/api/validate/kyc/level', {
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
                        kyc_level: data.level,
                        kyc_status: data.status
                    })
                } else {

                }
            })
    }
    getPlan() {
        fetch('/api/fund/data', {
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
                        plan: data.plan,
                        lifetime_investment: data.lifetime_investment
                    })
                } else {

                }
            })
        fetch('/api/fund/packs', {
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
                        packs: data.packs
                    })
                } else {

                }
            })
    }


    render() {
        return (
            <Router>
                <Sidebar 
                    network={this.state.network}
                    kyc_level={this.state.kyc_level}
                    username={this.state.username}
                />
                <div className="App">
                        <Route exact path="/app" render={(props) => <Trade {...props}
                            token={this.state.token}
                            plan={this.state.plan}
                            currency={this.state.currency}
                            kyc_status={this.state.kyc_status}
                            currency_index={this.state.currency_index}
                            wallet_balance={this.state.wallet_balance}
                            wallet_transactions={this.state.wallet_transactions}
                            wallet_unconfirmed_balance={this.state.wallet_unconfirmed_balance}
                            balance={this.state.total_balance}
                            network={this.state.network}
                            kyc_level={this.state.kyc_level}
                            username={this.state.username}
                            setState={p => { this.setState(p) }} />}
                        />
                        <Route exact path="/app/investment" render={(props) => <Deposit {...props}
                        individual_balance = {this.state.individual_balance}
                            withdraw_transactions={this.state.withdraw_transactions}
                            update={() => this.componentDidMount()}
                            kyc_status={this.state.kyc_status}
                            kyc_level={this.state.kyc_level}
                            wallet_transactions={this.state.wallet_transactions}
                            lifetime_investment={this.state.lifetime_investment}
                            lifetime_balance={this.state.lifetime_balance}
                            ROI={this.state.ROI}
                            withdraw_address={this.state.withdraw_address}
                            token={this.state.token}
                            email={this.state.email}
                            username={this.state.username}
                            wallet_balance={this.state.wallet_balance}
                            plan={this.state.plan}
                            new={this.state.new}
                            balance={this.state.total_balance} />}
                        />
                        <Route exact path="/app/mining" render={(props) => <Mining {...props}
                        individual_balance = {this.state.individual_balance}
                            withdraw_transactions={this.state.withdraw_transactions}
                            update={() => this.componentDidMount()}
                            kyc_status={this.state.kyc_status}
                            kyc_level={this.state.kyc_level}
                            wallet_transactions={this.state.wallet_transactions}
                            lifetime_investment={this.state.lifetime_investment}
                            lifetime_balance={this.state.lifetime_balance}
                            ROI={this.state.ROI}
                            username={this.state.username}
                            plan={this.state.plan}
                            balance={this.state.total_balance}
                            packs={this.state.packs}
                        />}
                        />
                        <Route exact path="/app/profile" render={(props) => <Profile {...props}
                            username={this.state.username}
                            kyc_status={this.state.kyc_status}
                            kyc_level={this.state.kyc_level}
                            withdraw_address={this.state.withdraw_address}
                            withdraw_address_ETH={this.state.withdraw_address_ETH}
                            update={() => this.componentDidMount()}
                            email={this.state.email}
                            kyc_level={this.state.kyc_level}
                            token={this.state.token}
                        />}
                        />
                        <Route exact path="/app/network" render={(props) => <Network {...props}
                        individual_balance = {this.state.individual_balance}
                            network={this.state.network}
                            wallet_balance={this.state.wallet_balance}
                            withdraw_transactions={this.state.withdraw_transactions}
                            update={() => this.componentDidMount()}
                            wallet_unconfirmed_balance={this.state.wallet_unconfirmed_balance}
                            kyc_status={this.state.kyc_status}
                            kyc_level={this.state.kyc_level}
                            wallet_transactions={this.state.wallet_transactions}
                            lifetime_investment={this.state.lifetime_investment}
                            lifetime_balance={this.state.lifetime_balance}
                            leverage={this.state.leverage}
                            username={this.state.username}
                            plan={this.state.plan}
                            network_balance={this.state.network_balance}
                            balance={this.state.total_balance} />}
                        />
                        <Route exact path="/app/kyc" render={(props) => <Oneauth {...props}
                            email={this.state.email}
                            kyc_status={this.state.kyc_status}
                            kyc_level={this.state.kyc_level}
                            username={this.state.username}
                            plan={this.state.plan}
                            currency={this.state.currency}
                            currency_index={this.state.currency_index}
                            update={() => { this.getKYC() }}
                            setState={p => { this.setState(p) }} />}
                        />
                        <Route exact path="/app/tree" render={(props) => <Tree {...props}
                            username={this.state.username}
                            plan={this.state.plan}
                            update={() => this.componentDidMount()}
                        />}

                        />
                    </div>
            </Router>
        )
    }
}

export default Backoffice;

/*
                    <Cashier
                        individual_balance = {this.state.individual_balance}
                        address={this.state.address}
                        wallet_balance={this.state.wallet_balance}
                        wallet_unconfirmed_balance={this.state.wallet_unconfirmed_balance}
                        balance={this.state.total_balance}
                        withdraw_address_ETH={this.state.withdraw_address_ETH}
                        update={() => this.componentDidMount()}
                        token={this.state.token}
                    />*/