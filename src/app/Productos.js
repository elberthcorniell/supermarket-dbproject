import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import {
    Card,
    Col,
    Container,
    Row,
    Button,
    Form
} from "react-bootstrap"
import toaster from 'toasted-notes';
import Glider from '../public/js/glider'

export default class Productos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productos: [],
            categorias: []
        };
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        const urlParams = new URLSearchParams(window.location.search);
        const categoria = urlParams.get('categoria');
        this.setState({
            categoria
        }, () => {
            this.getCategoria()
        })
    }
    componentDidUpdate() {
    }
    handleChange(e) {
        const { id, value } = e.target;
        this.setState({
            [id]: value
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
    handleCart(ID_producto, Cantidad) {
        Cantidad = parseInt(Cantidad)
        fetch('/api/validate/verify', {
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
                    fetch('/api/market/addtocart', {
                        method: 'POST',
                        body: JSON.stringify({
                            ID_producto,
                            Cantidad
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
                                toaster.notify('Producto añadido al carrito', {
                                    duration: 10000,
                                    position: 'bottom-right',
                                })
                            } else {
                                toaster.notify('Error al intentar agregar producto', {
                                    duration: 10000,
                                    position: 'bottom-right',
                                })
                            }
                        })


                } else {
                    window.location.replace('/auth/login')
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
            <div>
                <Container>
                    <h1>{this.state.titulo}</h1>
                    <Row style={{ width: '100%', height: 'fit-content' }}>
                        {this.state.productos.map(data => {
                            return (
                                <Col lg={3}>
                                    <Card style={{ marginBottom: 20, textAlign: 'center', height: 400 }}>
                                        <Card.Body>
                                            <img src={data.Imagen} height={150} width={150} />
                                            <p>{data.Nombre}</p>
                                            <p
                                                style={{
                                                    fontWeight: 700,
                                                    position: 'absolute',
                                                    bottom: 60,
                                                    width: 'calc(100% - 40px)'
                                                }}>
                                                RD${data.Precio}</p>
                                            <Form.Control
                                                type="number"
                                                defaultValue={1}
                                                value={this.state[data.ID_producto + "Cantidad"]}
                                                id={data.ID_producto + "Cantidad"}
                                                min={1}
                                                max={data.Cantidad}
                                                onChange={e => { this.handleChange(e) }}
                                            ></Form.Control>
                                            <Button
                                                onClick={() => { this.handleCart(data.ID_producto, this.state[data.ID_producto + "Cantidad"] || 1) }}
                                                style={{
                                                    width: 'calc(100% - 40px)',
                                                    position: 'absolute',
                                                    bottom: 20,
                                                    right: 20
                                                }}
                                            ><i className="material-icons">add_shopping_cart</i></Button>
                                        </Card.Body>

                                    </Card>
                                </Col>
                            )
                        })}
                    </Row>
                </Container>
            </div>
        )
    }
}