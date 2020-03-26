import React, { Component } from 'react';
import { Line, Chart } from 'react-chartjs-2';
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

Chart.defaults.scale.gridLines.display = false
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            plan: '',
            transactions: [],
            base: 'USD',
            AUM: '',
            AAR: '',
            unlock_modal: false,
            transaction: true,
            Interest: false,
            Investment: false
        };
        this.change = this.change.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleTab = this.handleTab.bind(this);

    }
    componentDidMount() {
        this.getTransactions(5)
        this.getAUM()
    }
    componentDidUpdate() {
    }
    change(buy) {
        this.setState({
            buy
        })
    }

    handleChange(e) {
        const { id, value } = e.target;
        this.setState({
            [id]: value
        })
    }
    handleTab(e) {
        const { id } = e.target;
        this.setState({
            transaction: false,
            Interest: false,
            Investment: false
        }, () => {
            this.setState({
                [id]: true
            })
        })
    }
    getTransactions(limit) {
        fetch('/api/fund/transactions', {
            method: 'POST',
            body: JSON.stringify({
                limit: true
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
    getAUM() {
        fetch('/api/fund/AUM', {
            method: 'POST',
            body: JSON.stringify({}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('authtoken')
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    this.setState({
                        AUM: (141400 + data.AUM).toFixed(),
                        AAR: data.AAR
                    })
                } else {

                }
            })
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
        const form_dark = {
            display: 'inline-block',
            width: '100%',
            height: '100%',
            backgroundColor: '#f3f5f7',
            borderStyle: 'none',
            fontWeight: 'bold'
        }
        return (
            <div>
                     <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="#home"><img src='../assets/images/logo_text.png' height='90' /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <NavDropdown title="Productos" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Categoria 1</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Categoria 2</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Categoria 3</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Todos los productos</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Form inline>
                            <Button
                                onClick={()=>{window.location.replace('/auth/register')}}
                            >Crear Cuenta</Button>
                            <Button
                                onClick={()=>{window.location.replace('/auth/login')}}
                            >Iniciar Sesion</Button>
                        </Form>
                    </Navbar.Collapse>
                </Navbar>
                <Row style={{width: '100%', height: 'fit-content', backgroundImage: 'linear-gradient(45deg, green, white, white)'}}>
                <Col xs={8}>
                    <Carousel>

                    </Carousel>
                    </Col>
                    <Col xs={4}>
                        <img style={{padding: 10}} src='../assets/images/logo.png' />
                    </Col>
                </Row>
            <Container>
            </Container>
            </div>
        )
    }
}

export default Home;