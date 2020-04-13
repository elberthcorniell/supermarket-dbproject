import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import {
    Container,
    Row,
    Button,
    Table,
    Form
} from "react-bootstrap"
import toaster from 'toasted-notes';
import Glider from '../public/js/glider'

export default class Admin_productos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productos: [],
            categorias: [],
            categoria: 1
        };
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        this.getCategoria()
        this.getCategorias()
    }
    componentDidUpdate() {
    }

    getCategorias() {
        fetch('/api/market/getCategorias')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    this.setState({
                        categorias: data.result
                    })
                } else {

                }
            })
    }
    getCategoria() {
        fetch(`/api/market/productos/${this.state.categoria}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    console.log(data)
                    const { productos, titulo } = data
                    this.setState({
                        productos, titulo
                    })
                } else {

                }
            })
    }
    cambiarestado(ID_producto, Estado){
        fetch('/api/market/cambiarestado', {
            method: 'POST',
            body: JSON.stringify({
                ID_producto,
                Estado: Estado == 'Disponible'? 'No Disponible': 'Disponible'
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('authtoken')
            }
        })  
        .then(res => res.json())
        .then(data => {

        })
    }
    handleChange(e) {
        const { id, value } = e.target;
        this.setState({
            [id]: value
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
    deleteProduct(ID_producto){
        fetch('/api/market/eliminarproducto/admin', {
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
            
        toaster.notify('Referal link copied', {
            duration: 10000,
            position: 'bottom-right',
        })
        })
    }
    render() {
        return (
            <div>
                <Container>
                    <h1>Productos {this.state.titulo}</h1>
                    <Form.Control
                        style={{
                            float: 'right',
                            width: 300,
                            marginTop: -45
                        }}
                        onChange={e => { this.setState({ categoria: e.target.value }, () => { this.getCategoria() }) }}
                        as="select">
                        {this.state.categorias.map(data => {
                            return (<option value={data.ID_categoria}>{data.Nombre}</option>)
                        })}
                    </Form.Control>
                    <Row style={{ width: '100%', height: 'fit-content' }}>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Cantidad</th>
                                    <th>Precio</th>
                                    <th>Fecha Expiracion</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.productos.map(data => {
                                    return (
                                        <tr>
                                            <td>{data.ID_producto}</td>
                                            <td>{data.Nombre}</td>
                                            <td>{data.Cantidad}</td>
                                            <td>{(data.Precio || 0).toFixed(2)}</td>
                                            <td>{this.formatDate(data.Fecha_expiracion)}</td>
                                            <td style={{ textAlign: 'right' }}>{data.Estado}</td>
                                            <td>
                                                <i style={{ cursor: 'pointer', float: 'right' }} onClick={() => { this.deleteProduct(data.ID_producto) }} className="material-icons">delete</i>
                                                <i style={{ cursor: 'pointer', float: 'right' }} onClick={() => { this.cambiarestado(data.ID_producto, data.Estado) }} className="material-icons">do_not_disturb</i>
                                                <i style={{ cursor: 'pointer', float: 'right' }} onClick={() => { this.deleteProduct(data.ID_producto) }} className="material-icons">create</i></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </Row>
                </Container>
            </div>
        )
    }
}