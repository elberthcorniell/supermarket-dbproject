import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import {
    Col,
    Container,
    Row,
    Button,
    Table,
    Modal,
    Form
} from "react-bootstrap"
import toaster from 'toasted-notes';
import Glider from '../public/js/glider'

export default class Retroalimentacion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productos: [],
            categorias: [],
            cart: []
        };
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        this.getCarrito()
    }
    componentDidUpdate() {
    }
    handleChange(e) {
        const { id, value } = e.target;
        this.setState({
            [id]: value
        })
    }
    getCarrito() {
        fetch('/api/market/getcart', {
            method: 'POST',
            /*body: JSON.stringify(this.state),*/
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('authtoken')
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const { cart } = data
                    this.setState({
                        cart
                    }, () => {
                        console.log(this.state.cart)
                    })
                }
            })
    }
    getTotal() {
        var Total = 0
        this.state.cart.map(data => {
            Total = Total + data.Total
        })
        return Total.toFixed(2)
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
        return (
            <Container>
                <h1>Retroalimentacion</h1>
                <Button
                    style={{
                        float: 'right',
                        marginTop: -45
                    }}
                    onClick={() => { this.setState({ unlock_modal: true }) }}
                >
                    Enviar retroalimentacion</Button>
                <Row style={{ width: '100%', height: 'fit-content' }}>
                    <Form.Control style={{ marginBottom: 20 }} as="select" multiple>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                    </Form.Control>
                    <Form.Control placeholder="Mensaje" as="textarea" roes="4" />
                </Row>
            </Container>
        )
    }
}