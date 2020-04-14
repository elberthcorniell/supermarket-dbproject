import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import {
    Card,
    Col,
    Container,
    Row,
    Button,
    Carousel,
} from "react-bootstrap"
import toaster from 'toasted-notes';
import Glider from '../public/js/glider'

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            top10_productos: [],
            categorias: []
        };
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        this.getTop10()
    }
    componentDidUpdate() {
    }
    handleChange(e) {
        const { id, value } = e.target;
        this.setState({
            [id]: value
        })
    }
    getTop10(limit) {
        fetch('/api/market/gettop10')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    this.setState({
                        top10_productos: data.top10
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
    render() {
        return (
            <div>
                <Row style={{ width: '100%', height: 'fit-content', backgroundImage: 'linear-gradient(45deg, green, white, white)' }}>
                    <Col xs={8}>
                        <Carousel>

                        </Carousel>
                    </Col>
                    <Col xs={4}>
                        <img style={{ padding: 10 }} src='../assets/images/logo.png' />
                    </Col>
                </Row>
                <Container>
                    <h1>Top roductos</h1>
                    <Row>
                        {this.state.top10_productos.map(data => {
                            return (<Col lg={3}>
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