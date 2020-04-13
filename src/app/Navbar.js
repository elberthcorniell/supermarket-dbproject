import React, { Component } from 'react';
import {
    Button,
    Form,
    Nav,
    NavDropdown,
    Navbar
} from "react-bootstrap"

class Navigationbar extends Component {
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
        this.getCategorias()
        this.verify()
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
    verify() {
        fetch('/api/validate/verify', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('authtoken')
            }
        })
            .then(res => res.json())
            .then(data => {
                const logged = data.success
                this.setState({ logged })
            })
    }
    render() {
        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="/"><img src='../assets/images/logo_text.png' height='90' /></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <NavDropdown title="Productos" id="basic-nav-dropdown">
                            {this.state.categorias.map(data => {
                                return (
                                    <a href={`/productos?categoria=${data.ID_categoria}`} className="dropdown-item">{data.Nombre}</a>
                                )
                            })}
                        </NavDropdown>
                        <Nav.Link href="/productos?categoria=ofertas">Ofertas</Nav.Link>
                    </Nav>
                    <Form inline>
                        {this.state.logged ?
                            <NavDropdown title="Productos" id="basic-nav-dropdown">
                                <a href='/carrito' ><i
                                    style={{
                                        cursor: 'pointer',
                                    }}
                                    className="material-icons">
                                    shopping_cart</i> carrito</a>
                                <a href={`/retroalimentacion`} className="dropdown-item">Retroalimentacion</a>
                                <a href="#" onClick={() => { localStorage.setItem('authtoken', ''); (window.location.replace('/')) }} className="dropdown-item">Cerrar Sesion</a>
                            </NavDropdown>
                            :
                            <div>
                                <Button
                                    onClick={() => { window.location.replace('/auth/register') }}
                                >Crear Cuenta</Button>
                                <Button
                                    onClick={() => { window.location.replace('/auth/login') }}
                                >Iniciar Sesion</Button>
                            </div>
                        }
                    </Form>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

class Adminbar extends Component {
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
        this.verify()
    }
    componentDidUpdate() {
    }
    handleChange(e) {
        const { id, value } = e.target;
        this.setState({
            [id]: value
        })
    }
    verify() {
        fetch('/api/validate/verify', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('authtoken')
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success && (data.Tipo == 'Admin' || data.Tipo == 'Mensajero')) {
                    const logged = data.success
                    const { Tipo } = data
                    this.setState({ logged, Tipo })
                } else {
                    window.location.replace("/auth/login")
                }
            })
    }
    render() {
        return (
            <Navbar bg="dark" expand="lg">
                <Navbar.Brand href="/"><img src='../assets/images/logo_text.png' height='90' /></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {
                            this.state.Tipo == 'Admin' ?
                                <span>
                                    <Nav.Link href="/admin/productos">Productos</Nav.Link>
                                    <Nav.Link href="/admin/clientes">Clientes</Nav.Link>
                                    <Nav.Link href="/admin/mensajeros">Mensajeros</Nav.Link>
                                </span>
                                :
                                <Nav.Link href="/admin/misentregas">Mis entregas</Nav.Link>
                        }

                    </Nav>
                    <Form inline>
                        {this.state.logged ?
                            <NavDropdown title="Productos" id="basic-nav-dropdown">
                                <a href='/carrito' ><i
                                    style={{
                                        cursor: 'pointer',
                                    }}
                                    className="material-icons">
                                    shopping_cart</i> carrito</a>
                                <a href={`/retroalimentacion`} className="dropdown-item">Retroalimentacion</a>
                                <a href="#" onClick={() => { localStorage.setItem('authtoken', ''); (window.location.replace('/')) }} className="dropdown-item">Cerrar Sesion</a>
                            </NavDropdown>
                            :
                            <div>
                                <Button
                                    onClick={() => { window.location.replace('/auth/register') }}
                                >Crear Cuenta</Button>
                                <Button
                                    onClick={() => { window.location.replace('/auth/login') }}
                                >Iniciar Sesion</Button>
                            </div>
                        }
                    </Form>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}
module.exports = {
    Navigationbar,
    Adminbar
}
