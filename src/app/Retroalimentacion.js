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
            pedidos: [],
            Productos_recibidos: true
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
    getPedidos(){
        fetch('/api/market/getpedidos', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('authtoken')
            }
        }).then(res => res.json())
        .then(data=>{
            if(data.success){
                this.setState({
                    pedidos: data.pedidos,
                    ID_pedido: data.pedidos[0].ID_pedido
                })
            }
        })
    }
    sendRetroalimentacion() {
        fetch('/api/market/enviarretroalimentacion', {
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
                if (data.success) {
                    toaster.notify('Retroalimentacion exitosa', {
                        duration: 10000,
                        position: 'bottom-right',
                    })
                }else{
                    toaster.notify('Retroalimentacion ya entregada', {
                        duration: 10000,
                        position: 'bottom-right',
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
                    onClick={() => { this.sendRetroalimentacion() }}
                >
                    Enviar retroalimentacion</Button>
                <Row style={{ width: '100%', height: 'fit-content' }}>
                    <p>Pedido:</p>
                    <Form.Control
                        onChange={e => { this.setState({ ID_pedido: e.target.value })}}
                        as="select">
                        {this.state.pedidos.map(data => {
                            return (<option >{data.ID_pedido}</option>)
                        })}
                    </Form.Control>
                    Productos recibidos:
                    <Form.Check
                        type="radio"
                        id="Productos_recibidos"
                        onChange={(e)=>{this.setState({Productos_recibidos: e.target.value == 'on'? true : false})}}
                    />
                    <p>Estado de productos:</p>
                    <Form.Control onChange={(e)=>{this.handleChange(e)}} id="Estado_productos" defaultValue="0" type="range" min="0" max="10" step="1" />
                    <p>Calidad de entrega:</p>
                    <Form.Control onChange={(e)=>{this.handleChange(e)}} id="Calidad_entrega" defaultValue="0" type="range" min="0" max="10" step="1" />
                    <Form.Control onChange={(e)=>{this.handleChange(e)}} id="Mensaje" placeholder="Mensaje" as="textarea" roes="4" />
                </Row>
            </Container>
        )
    }
}