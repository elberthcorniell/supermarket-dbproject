import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import {
    Card,
    Col,
    Container,
    Row,
    Button,
    Form,
    Table,
    Modal,
    Carousel,
    Nav,
    NavDropdown,
    FormControl,
    Navbar
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
        this.getCategorias()
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
                    const { productos, titulo } = data
                    this.setState({
                        productos, titulo
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
    render() {
        return (
            <div>
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="#home"><img src='../assets/images/logo_text.png' height='90' /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <NavDropdown title="Productos" id="basic-nav-dropdown">
                                {this.state.categorias.map(data => {
                                    return (
                                        <a href={`/productos?categoria=${data.ID_categoria}`} className="dropdown-item">{data.Nombre}</a>
                                    )
                                })}
                            </NavDropdown>
                        </Nav>
                        <Form inline>
                            <Button
                                onClick={() => { window.location.replace('/auth/register') }}
                            >Crear Cuenta</Button>
                            <Button
                                onClick={() => { window.location.replace('/auth/login') }}
                            >Iniciar Sesion</Button>
                        </Form>
                    </Navbar.Collapse>
                </Navbar>
                <Container>
                    <h1>{this.state.titulo}</h1>
                    <Row style={{ width: '100%', height: 'fit-content' }}>
                        {this.state.productos.map(data => {
                            return (
                                <Col lg={3}>
                                <Card style={{marginBottom: 20, textAlign: 'center', height: 350}}>
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