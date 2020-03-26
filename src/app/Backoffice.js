import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './Home';
import Deposit from './Investment';
import Network from './Network';
import Oneauth from './Oneauth';
import toaster from 'toasted-notes';

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
    }
    componentDidUpdate() {
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
                <div className="App">
                        <Route exact path="/" render={(props) => <Home {...props}
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
                    </div>
            </Router>
        )
    }
}

export default Backoffice;