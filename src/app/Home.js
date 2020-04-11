import React, { Component } from 'react';
import {Link} from 'react-router-dom'
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
        this.getCategorias()
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
  
    getTop10(limit) {
        fetch('/api/market/gettop10')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    this.setState({
                        transactions: data.result
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
                                {this.state.categorias.map(data=>{
                                    return(                                      
                                    <Link to={`/productos?categoria=${data.ID_categoria}`}  className="dropdown-item">{data.Nombre}</Link>
                                    )/*
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="#action/3.4">Todos los productos</NavDropdown.Item>*/
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
                    <h1>Productos</h1>
                    {this.state.top10_productos.map(data => {
                        return (
                            <Card>

                            </Card>
                        )
                    })}
                </Container>
            </div>
        )
    }
}