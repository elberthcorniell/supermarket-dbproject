import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import {
    Col,
    Container,
    Row,
    Button,
    Table,
    Modal,
} from "react-bootstrap"
import toaster from 'toasted-notes';
import Glider from '../public/js/glider'

export default class Mensajero_entregas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productos: [],
            categorias: [],
            cart: [],
            pedidos: []
        };
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        this.getPedidos()
    }
    componentDidUpdate() {
    }
    handleChange(e) {
        const { id, value } = e.target;
        this.setState({
            [id]: value
        })
    }
    setPedidoDone(ID_pedido) {
        if (confirm("Quiere marcar como entregado el producto")) {
            fetch('/api/market/setPedidoDone', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('authtoken')
                },
                body: JSON.stringify({
                    ID_pedido
                })
            }).then(res => res.json())
                .then(data => {
                    if (data.success) {
                        this.componentDidMount()
                    }
                })
        } else {

        }
    }
    getPedidos() {
        fetch('/api/market/getpedidos/mensajero', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('authtoken')
            }
        }).then(res => res.json())
            .then(data => {
                if (data.success) {
                    this.setState({
                        pedidos: data.pedidos
                    })
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
                <h1>Mis entregas</h1>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID Pedido</th>
                            <th>Fecha pedido</th>
                            <th>Sector</th>
                            <th>Precio Total</th>
                            <th>Accion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.pedidos.map(data => {
                            return (
                                <tr>
                                    <td>{data.ID_pedido}</td>
                                    <td>{this.formatDate(data.Fecha_realizacion)}</td>
                                    <td>{data.Sector}</td>
                                    <td>{data.Precio_total}</td>
                                    <td><i style={{
                                        cursor: 'pointer'
                                    }}
                                        onClick={() => { this.setPedidoDone(data.ID_pedido) }}
                                        className="material-icons">playlist_add_check</i></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Container>
        )
    }
}