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

export default class Mensajero extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productos: [],
            categorias: [],
            cart: [],
            fecha_inicial: '2019-11-11', 
            fecha_final: '2020-11-11',
            topmensajero: []
        };
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        this.getTopMensajero()
    }
    componentDidUpdate() {
    }
    handleChange(e) {
        const { id, value } = e.target;
        this.setState({
            [id]: value
        })
    }
    getTopMensajero() {
        fetch('/api/market/topmensajero', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('authtoken')
            },
            body: JSON.stringify({
                fecha_inicial: this.state.fecha_inicial,
                fecha_final: this.state.fecha_final,
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log()
                this.setState({
                    topmensajero: data.topmensajero
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
                <h1>Top mensajeros</h1>
                <Table striped bordered hover>
                                <tbody>
                                    {this.state.topmensajero.map(data=>{
                                        return(
                                            <tr>
                                                <td>{data.ID_mensajero}</td>
                                                <td>{data.Cedula}</td>
                                                <td>{data.Nombre+" "+data.Apellido}</td>
                                                <td>{data.telefono}</td>
                                                <td>{data.Cantidad}</td>
                                            </tr>
                                            )
                                    })}
                                </tbody>
                            </Table>
            </Container>
        )
    }
}