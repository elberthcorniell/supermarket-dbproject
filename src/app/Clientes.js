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

export default class Clientes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productos: [],
            categorias: [],
            cart: [],
            clientes: []
        };
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        this.getClientes()
    }
    componentDidUpdate() {
    }
    handleChange(e) {
        const { id, value } = e.target;
        this.setState({
            [id]: value
        })
    }
    cambiar(Correo_electronico){
        fetch('/api/market/cambiaramensajero', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('authtoken')
            },
            body: JSON.stringify({
                Correo_electronico
            })
        })
            .then(res => res.json())
            .then(data => {
                this.setState({
                    clientes: data.result
                })
            })
    }
    getClientes() {
        fetch('/api/market/getClientes/admin', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('authtoken')
            }
        })
            .then(res => res.json())
            .then(data => {
                this.setState({
                    clientes: data.result
                })
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
                <h1>Clientes</h1>
                <Table striped bordered hover>
                                <tbody>
                                    {this.state.clientes.map(data=>{
                                        return(
                                            <tr>
                                                <td>{data.Cedula}</td>
                                                <td>{data.Nombre+" "+data.Apellido}</td>
                                                <td>{data.Correo_electronico}</td>
                                                <td>{data.Telefono}</td>
                                                <td><i 
                                                    style={{
                                                        cursor: "pointer"
                                                    }}
                                                    onClick={()=>{this.cambiar(data.Correo_electronico)}}
                                                    className="material-icons">swap_horiz</i></td>
                                            </tr>
                                            )
                                    })}
                                </tbody>
                            </Table>
            </Container>
        )
    }
}