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

export default class Carrito extends Component {
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
    makeOrder() {
        fetch('/api/market/pagarorden', {
            method: 'POST',
            body: JSON.stringify({ 
                ID_pedido: this.state.cart[0].ID_pedido,
                Impuestos: 0.18*this.getTotal(),
                Descuento: 0,
                Precio_envio: 100,
                Precio_total: ((this.getTotal()*1.18)+100).toFixed(2)
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
                    this.componentDidMount()
                    toaster.notify('Pedido realizado satisfactoriamente', {
                        duration: 10000,
                        position: 'bottom-right',
                    })
                }
            })
    }
    deleteProduct(ID_producto){
        fetch('/api/market/eliminarproducto', {
            method: 'DELETE',
            body: JSON.stringify({ ID_pedido: this.state.cart[0].ID_pedido, ID_producto }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('authtoken')
            }
        })
        .then(res => res.json())
        .then(data => {
            if(data.success){
                this.componentDidMount()
                toaster.notify('Producto eliminado satisfactoriamente', {
                    duration: 10000,
                    position: 'bottom-right',
                })
            }else{
                toaster.notify('Error eliminando producto', {
                    duration: 10000,
                    position: 'bottom-right',
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
                <h1>Carrito de compras</h1>
                {this.state.cart.length == 0}
                <Button
                    style={{
                        float: 'right',
                        marginTop: -45
                    }}
                    onClick={() => { this.setState({ unlock_modal: true }) }}
                >Enviar pedido</Button>
                <Row style={{ width: '100%', height: 'fit-content' }}>
                    {this.state.cart.length > 0 ?
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Cantidad</th>
                                    <th>Precio</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.cart.map(data => {
                                    return (
                                        <tr>
                                            <td>{data.Nombre} 
                                            <i style={{ cursor: 'pointer', float: 'right' }} onClick={()=>{this.deleteProduct(data.ID_producto)}} className="material-icons">delete</i></td>
                                            <td>{data.Cantidad}</td>
                                            <td>{(data.Precio || 0).toFixed(2)}</td>
                                            <td style={{textAlign: 'right'}}>{(data.Total || 0).toFixed(2)}</td>
                                        </tr>
                                    )
                                })}
                                <tr>
                                    <td><strong>Precio total:</strong></td>
                                    <td></td>
                                    <td></td>
                                    <td style={{textAlign: 'right'}}><strong>{this.getTotal()}</strong></td>
                                </tr>
                            </tbody>
                        </Table>
                        : <h1>Carrito vacio</h1>}</Row>
                <Modal show={this.state.unlock_modal} onHide={() => this.setState({ unlock_modal: false })}>
                    <Modal.Body>
                        <div style={{ marginLeft: 15, marginTop: 10 }}>
                            <strong>Pagar Compra</strong>
                            <div style={{ width: 'fit-content', height: 'fit-content', position: 'absolute', top: 10, right: 10, cursor: 'pointer' }} onClick={() => { this.setState({ unlock_modal: false }); this.props.cancel() }}><i className="material-icons left" style={{ fontSize: 18 }}>clear</i></div>
                        </div>
                        <div style={{marginTop: 20}}>
                            <Table striped bordered hover>
                                <tbody>
                                    <tr>
                                        <td>Subtotal productos:</td>
                                        <td style={{textAlign: 'right'}}>RD${this.getTotal()}</td>
                                    </tr>
                                    <tr>
                                        <td>Impuestos:</td>
                                        <td style={{textAlign: 'right'}}>RD${(this.getTotal()*0.18).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td>Envio:</td>
                                        <td style={{textAlign: 'right'}}>RD$100</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Precio Total:</strong></td>
                                        <td style={{textAlign: 'right'}}><strong>RD${((this.getTotal()*1.18)+100).toFixed(2)}</strong></td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                        <Button
                            className='btn-blue'
                            onClick={() => { this.makeOrder(); this.setState({ unlock_modal: false }) }}
                            style={{
                                width: '100%',
                                padding: 10,
                                color: '#FFF',
                                marginTop: 15
                            }}><strong>Enviar</strong></Button>
                    </Modal.Body>
                </Modal>

            </Container>
        )
    }
}