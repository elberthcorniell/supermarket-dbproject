import React, { Component } from 'react';
import {
    Card,
    Col,
    Container,
    Row,
    Button,
    Form,
    Table
} from "react-bootstrap"
import toaster from 'toasted-notes';
class Oneauth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            sent: false,
            sent_err: ''
        };
        this.form_dark = {
            display: 'inline-block',
            width: '50%',
            height: '100%',
            backgroundColor: '#f99f01',
            borderStyle: 'none',
            color: '#FFF',
            fontWeight: 'bold',
            textAlign: 'right',
        
        }
        this.form_dark_2 = Object.assign({}, this.form_dark)
        this.form_dark_2.width = 'auto'
        this.form_dark_2.backgroundColor = '#f3f5f7'
        this.form_dark_2.color = '#000'
        this.handleChange = this.handleChange.bind(this);
        this.send = this.send.bind(this);
        this.handleOnFileChange = this.handleOnFileChange.bind(this);
    }
    componentDidMount() {

    }
    handleChange(e) {
        const { id, value } = e.target;
        this.setState({
            [id]: value
        })
    }
    handleOnFileChange(e){
        let file = e.target.files[0];
        var link = URL.createObjectURL(file)
        this.setState({
            [e.target.id] : file,
            [e.target.id+'_URL'] : link
        })
    }
    validateEmail(){
        fetch('/api/validate/email/validate',{
            method: "POST",
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('authtoken')
            }
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.success){
                this.props.update()
                toaster.notify('Please check your email', {
                    duration: 10000,
                    position: 'bottom-right',
                  })
            }
        })
    }
    send(e){
        e.preventDefault()
        var data = new FormData()
        data.append('ID', this.state.ID)
        data.append('selfie',  this.state.selfie )
       // data.append( )
        fetch('/upload',{
            method: "POST",
            body: data,
            headers:{
                //'Content-Type': 'multipart/form-data',
                "authorization" : localStorage.getItem('authtoken')
            }
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.success){
                this.setState({
                    sent: true,
                    sent_err: ''
                })
        toaster.notify('Images successfully sent', {
            duration: 10000,
            position: 'bottom-right',
          })
            }else{
                this.setState({
                    sent_err: data.msg
                })
            }
        })
    }
    areaToShow(area) {
        switch (area) {
            case 0: return (
                <Card>
                    <Card.Body style={{ maxWidth: 800, margin: 'auto' }}>
                        <strong>Increase your limits</strong>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <img width="100%" style={{ margin: 10 }} src={'../assets/images/kyc_0.png'} />
                        </div>
                        <p style={{ lineHeight: 0, padding: 0, margin: 0 }}>Account level:</p>
                        <p style={{ fontSize: 60, textAlign: 'center' }}>Lvl. 0</p>
                        <div className="dark-form" style={{ whiteSpace: 'nowrap', marginTop: 15, textAlign: 'left' }}>
                            <p style={{ display: 'inline-block', marginLeft: 15, width: 'fit-content' }}><strong>Email</strong></p>
                            <Form.Control id='email' value={this.props.email} className="form-dark" style={this.form_dark_2} ></Form.Control>   
                        </div>
                        {this.props.kyc_status == 1?<div><strong style={{ color: 'green' }}>We have sent you an email to validate your email address.</strong></div>: ''}
                        <Button
                            className='btn-blue'
                            onClick={() => { this.validateEmail() }}
                            disabled={this.props.kyc_status==1}
                            style={{
                                width: '100%',
                                padding: 10,
                                color: '#FFF',
                                marginTop: 15
                            }}><strong>Validate</strong></Button>
                        <ul style={{ margin: 20 }}>
                            <li>Available withdrawals.</li>
                            <li>Availability to join the network.</li>
                            <li>New login IP notification.</li>
                        </ul>
                    </Card.Body>
                </Card>
            )
            case 1: return (
                <Card>
                    <Card.Body style={{ maxWidth: 800, margin: 'auto' }}>
                        <strong>Increase your limits</strong>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <img width="100%" style={{ margin: 10 }} src={'../assets/images/kyc_1.png'} />
                        </div>
                        <p style={{ lineHeight: 0, padding: 0, margin: 0 }}>Account level:</p>
                        <p style={{ fontSize: 60, textAlign: 'center' }}>Lvl. 1</p>
                        <Form method="POST" action='/upload' encType="multipart/form-data" onSubmit={this.send} >
                        <div style={{ display: 'inline-block', padding: 10, width: '50%', textAlign: 'left' }}>
                            <div className="dark-form" style={{padding: 5}}>
                            <p style={{ marginLeft: 15, width: 'fit-content' }}><strong>ID Document</strong></p>
                                <Form.Control  id='ID' name="ID" type='file' accept="image/x-png,image/jpeg" onChange={this.handleOnFileChange} style={{opacity: 0}} ></Form.Control>
                                <label htmlFor="ID" style={{width: '100%', textAlign: 'center' , cursor: 'pointer'}}><img width='100%' style={{maxWidth: 240}} src={ this.state.ID_URL ||'../assets/images/ID.png'} /></label>
                            </div>
                        </div>
                        <Form.Control hidden id="username" name="username" value={this.props.username} />
                        <div style={{ display: 'inline-block', padding: 10, width: '50%', textAlign: 'left' }}>
                            <div className="dark-form" style={{padding: 5}}>
                            <p style={{ marginLeft: 15, width: 'fit-content' }}><strong>Selfie w/ ID</strong></p>
                                <Form.Control id='selfie' name="selfie" accept="image/x-png,image/jpeg" onChange={this.handleOnFileChange} type='file' style={{opacity: 0}} ></Form.Control>
                                <label htmlFor="selfie" style={{width: '100%', textAlign: 'center', cursor: 'pointer'}}><img width='100%' style={{maxWidth: 240}}  src={ this.state.selfie_URL ||'../assets/images/selfie.png'} /></label>
                              </div>
                        </div>
                        <p style={{marginLeft: 20}}>Files format must be <strong>.png</strong> or <strong>.jpeg</strong></p>
                        <div><strong style={{ color: 'red' }}>{this.state.sent_err}</strong></div>
                        {this.props.kyc_status == 1?<div><strong style={{ color: 'green' }}>We have received your documents. You must be notified on change.</strong></div>: ''}
                        <Button
                            className='btn-blue'
                            type="submit"
                            disabled={this.state.selfie==undefined||this.state.ID==undefined||this.state.sent}
                            style={{
                                width: '100%',
                                padding: 10,
                                color: '#FFF',
                                marginTop: 15
                            }}><strong>Send</strong></Button>
                            </Form>
                        <ul style={{ margin: 20 }}>
                            <li>Increase investment limits.</li>
                            <li>Availability for insurance.</li>
                            <li>Advanced support.</li>
                        </ul>
                    </Card.Body>
                </Card>
            )
            case 2: return (
                <Card>
                    <Card.Body style={{ maxWidth: 800, margin: 'auto' }}>
                        <strong>Increase your limits</strong>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <img width="100%" style={{ margin: 10 }} src={'../assets/images/kyc_2.png'} />
                        </div>
                        <p style={{ lineHeight: 0, padding: 0, margin: 0 }}>Account level:</p>
                        <p style={{ fontSize: 60, textAlign: 'center' }}>Lvl. 2</p>
                        <div style={{width: '100%', textAlign: 'center'}}>
                        <h1 style={{color: 'green'}}>Your account is now fully verified</h1>
                        <p>Account level 3 will be live soon.</p>
                        </div>
                    </Card.Body>
                </Card>
                
            )
        }
    }
    render() {
        return (
            <Container>
                <Row>
                    <Col lg={12} xs={12}>
                        {this.areaToShow(this.props.kyc_level)}
                        <div style={{ height: 60 }}></div>
                    </Col>
                </Row>
            </Container>
        )
    }
}
export default Oneauth;