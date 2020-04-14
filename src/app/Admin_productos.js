import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import {
    Container,
    Row,
    Button,
    Table,
    Form,
    Modal
} from "react-bootstrap"
import toaster from 'toasted-notes';
import Glider from '../public/js/glider'

export default class Admin_productos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productos: [],
            categorias: [],
            categoria: 1,
            edit_modal: false
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
                    const { productos, titulo } = data
                    this.setState({
                        productos, titulo
                    })
                } else {

                }
            })
    }
    updateProducto() {
        fetch('/api/market/actualizarproducto', {
            method: 'POST',
            body: JSON.stringify(this.state),
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
                    toaster.notify('Producto actualizado', {
                        duration: 10000,
                        position: 'bottom-right',
                    })
                }
            })
    }
    addProducto() {
        var producto = this.state
        producto.ID_categoria = this.state.categoria
        fetch('/api/market/agregarproducto', {
            method: 'POST',
            body: JSON.stringify(producto),
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
                    toaster.notify('Producto agregado', {
                        duration: 10000,
                        position: 'bottom-right',
                    })
                }
            })
    }
    cambiarestado(ID_producto, Estado) {
        fetch('/api/market/cambiarestado', {
            method: 'POST',
            body: JSON.stringify({
                ID_producto,
                Estado: Estado == 'Disponible' ? 'No Disponible' : 'Disponible'
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
                    toaster.notify('Estado modificado correctamente', {
                        duration: 10000,
                        position: 'bottom-right',
                    })
                    this.componentDidMount()
                } else {
                    toaster.notify('Error modificando estado', {
                        duration: 10000,
                        position: 'bottom-right',
                    })
                }
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
    deleteProduct(ID_producto) {
        if (confirm("Esta seguro que desea eliminar el producto?")) {
            fetch('/api/market/eliminarproducto/admin', {
                method: 'DELETE',
                body: JSON.stringify({ ID_producto }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('authtoken')
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        toaster.notify('Producto eliminado exitosamente', {
                            duration: 10000,
                            position: 'bottom-right',
                        })
                        this.componentDidMount()
                    }
                })
        }
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
                    <Button
                        onClick={() => {
                            this.setState({
                                add_modal: true,
                                ID_producto: '',
                                Nombre: '',
                                Cantidad: '',
                                Precio: '',
                                Oferta: '',
                                Fecha_expiracion: '',
                                Estado: ''
                            })
                        }}
                        style={{
                            float: 'right',
                            marginBottom: 20
                        }}>Añadir producto</Button>
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
                                            <td>{data.Estado}</td>
                                            <td>
                                                <i style={{ cursor: 'pointer', float: 'right' }} onClick={() => { this.deleteProduct(data.ID_producto) }} className="material-icons">delete</i>
                                                <i style={{ cursor: 'pointer', float: 'right' }} onClick={() => { this.cambiarestado(data.ID_producto, data.Estado) }} className="material-icons">do_not_disturb</i>
                                                <i style={{ cursor: 'pointer', float: 'right' }} onClick={() => {
                                                    this.setState({
                                                        edit_modal: true,
                                                        ID_producto: data.ID_producto,
                                                        Nombre: data.Nombre,
                                                        Cantidad: data.Cantidad,
                                                        Precio: data.Precio,
                                                        Oferta: data.Oferta,
                                                        Fecha_expiracion: data.Fecha_expiracion,
                                                        Estado: data.Estado
                                                    })
                                                }} className="material-icons">create</i></td>
                                        </tr>
                                    )
                                })}
                                <Modal show={this.state.edit_modal} onHide={() => this.setState({ edit_modal: false })}>
                                    <Modal.Body>
                                        <div style={{ marginLeft: 15, marginTop: 10 }}>
                                            <strong>Editar Producto</strong>
                                            <div style={{ width: 'fit-content', height: 'fit-content', position: 'absolute', top: 10, right: 10, cursor: 'pointer' }} onClick={() => { this.setState({ edit_modal: false }) }}><i className="material-icons left" style={{ fontSize: 18 }}>clear</i></div>
                                        </div>
                                        <div style={{ marginTop: 20 }}>
                                            <p>ID Producto:</p>
                                            <Form.Control id="ID_producto" value={this.state.ID_producto} onChange={(e) => { this.handleChange(e) }} />
                                            <p>Nombre:</p>
                                            <Form.Control id="Nombre" value={this.state.Nombre} onChange={(e) => { this.handleChange(e) }} />
                                            <p>Cantidad:</p>
                                            <Form.Control id="Cantidad" value={this.state.Cantidad} onChange={(e) => { this.handleChange(e) }} />
                                            <p>Precio:</p>
                                            <Form.Control id="Precio" value={this.state.Precio} onChange={(e) => { this.handleChange(e) }} />
                                            <p>Oferta:</p>
                                            <Form.Control id="Oferta" value={this.state.Oferta} onChange={(e) => { this.handleChange(e) }} />
                                            <p>Fecha Expiracion:</p>
                                            <Form.Control id="Fecha_expiracion" value={this.state.Fecha_expiracion} onChange={(e) => { this.handleChange(e) }} />
                                            <p>Estado:</p>
                                            <Form.Control id="Estado" value={this.state.Estado} onChange={(e) => { this.handleChange(e) }} />
                                        </div>
                                        <Button
                                            className='btn-blue'
                                            onClick={() => { this.updateProducto(); this.setState({ edit_modal: false }) }}
                                            style={{
                                                width: '100%',
                                                padding: 10,
                                                color: '#FFF',
                                                marginTop: 15
                                            }}><strong>Actualizar</strong></Button>
                                    </Modal.Body>
                                </Modal>
                                <Modal show={this.state.add_modal} onHide={() => this.setState({ add_modal: false })}>
                                    <Modal.Body>
                                        <div style={{ marginLeft: 15, marginTop: 10 }}>
                                            <strong>Añadir Producto</strong>
                                            <div style={{ width: 'fit-content', height: 'fit-content', position: 'absolute', top: 10, right: 10, cursor: 'pointer' }} onClick={() => { this.setState({ add_modal: false }) }}><i className="material-icons left" style={{ fontSize: 18 }}>clear</i></div>
                                        </div>
                                        <div style={{ marginTop: 20 }}>
                                            <p>ID Producto:</p>
                                            <Form.Control id="ID_producto" value={this.state.ID_producto} onChange={(e) => { this.handleChange(e) }} />
                                            <p>Nombre:</p>
                                            <Form.Control id="Nombre" value={this.state.Nombre} onChange={(e) => { this.handleChange(e) }} />
                                            <p>Categoria:</p>
                                            <Form.Control
                                                onChange={e => { this.setState({ categoria: e.target.value }, () => { this.getCategoria() }) }}
                                                as="select">
                                                {this.state.categorias.map(data => {
                                                    return (<option value={data.ID_categoria}>{data.Nombre}</option>)
                                                })}
                                            </Form.Control>
                                            <p>Cantidad:</p>
                                            <Form.Control id="Cantidad" value={this.state.Cantidad} onChange={(e) => { this.handleChange(e) }} />
                                            <p>Precio:</p>
                                            <Form.Control id="Precio" value={this.state.Precio} onChange={(e) => { this.handleChange(e) }} />
                                            <p>Oferta:</p>
                                            <Form.Control id="Oferta" value={this.state.Oferta} onChange={(e) => { this.handleChange(e) }} />
                                            <p>Fecha Expiracion:</p>
                                            <Form.Control id="Fecha_expiracion" value={this.state.Fecha_expiracion} onChange={(e) => { this.handleChange(e) }} />
                                            <p>Estado:</p>
                                            <Form.Control id="Estado" value={this.state.Estado} onChange={(e) => { this.handleChange(e) }} />
                                        </div>
                                        <Button
                                            className='btn-blue'
                                            onClick={() => { this.addProducto(); this.setState({ edit_modal: false }) }}
                                            style={{
                                                width: '100%',
                                                padding: 10,
                                                color: '#FFF',
                                                marginTop: 15
                                            }}><strong>Añadir</strong></Button>
                                    </Modal.Body>
                                </Modal>

                            </tbody>
                        </Table>
                    </Row>
                </Container>
            </div>
        )
    }
}