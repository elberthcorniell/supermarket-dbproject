import React, { Component } from 'react';
import {
    Container,
    Form,
    Modal
} from "react-bootstrap"
import { authenticator } from '../public/app/otplib-browser'
class Authenticator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 0,
            id: "1",
            fail: 0,
            unlock_modal: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.onKeyPressed = this.onKeyPressed.bind(this);
    }
    componentDidMount() {
        document.getElementById(this.state.id).focus();
    }
    onKeyPressed(event) {
        if ((event.keyCode == 8 || event.keyCode == 46) & event.target.value.length == 0) {
            document.getElementById((parseInt(event.target.id) - 1).toString()).focus()
        }
    }
    handleChange(e) {
        const { id, value } = e.target;
        if(value.length == 6){
            this.setState({
                "1": value.slice(0,1),
                "2": value.slice(1,2),
                "3": value.slice(2,3),
                "4": value.slice(3,4),
                "5": value.slice(4,5),
                "6": value.slice(5,6),
            },()=>{
                try{
                    if(authenticator.check(this.state["1"]+this.state["2"]+this.state["3"]+this.state["4"]+this.state["5"]+this.state["6"], this.props.secret)){
                        this.props.callback()
                    }else{
                        if(this.state.fail == 4){
                            this.onFail()
                        }
                        document.getElementById("1").focus()
                        this.setState({
                            "1": '',
                            "2": '',
                            "3": '',
                            "4": '',
                            "5": '',
                            "6": '',
                            fail: this.state.fail + 1
                        })
                    }
                }catch(e){
                    
                }
            })
        }
        if (value.length <= 1) {
            this.setState({
                [id]: value.toString()
            })
            if (value.length == 1) {
                if(id == "6"){
                 try{
                    if(authenticator.check(this.state["1"]+this.state["2"]+this.state["3"]+this.state["4"]+this.state["5"]+value, this.props.secret)){
                        this.props.callback()
                        this.props.cancel()
                    }else{
                        if(this.state.fail == 4){
                            this.onFail()
                        }
                        document.getElementById("1").focus()
                        this.setState({
                            "1": '',
                            "2": '',
                            "3": '',
                            "4": '',
                            "5": '',
                            "6": '',
                            fail: this.state.fail + 1
                        })
                    }
                }catch(e){
                    console.log(e)
                }
                }else{
                    document.getElementById((parseInt(id) + 1).toString()).focus()
                }
            }
        }
    }
    onFail(){
        try{
            setTimeout(()=>{this.props.cancel()}, 500)
            this.props.onFail()
        }catch(e){

        }
    }
    render() {
        const form_dark = {
            display: 'inline-block',
            width: '100%',
            height: '100%',
            backgroundColor: '#f3f5f7',
            borderStyle: 'none',
            fontWeight: 'bold',
            paddigBottom: 10,
            paddigTop: 10,
            textAlign: 'center'
        }
        return (
            <Container>
                  <Modal show={this.state.unlock_modal} onHide={() =>setTimeout(()=>{this.props.cancel()}, 500)}>
                    <div style={{ marginLeft: 15, marginTop: 10 }}>
                        <strong>2 factor authentication</strong>
                        <div style={{ width: 'fit-content', height: 'fit-content', position: 'absolute', top: 10, right: 10, cursor: 'pointer' }} onClick={() => { this.setState({ unlock_modal: false }); setTimeout(()=>{this.props.cancel()}, 500)  }}><i className="material-icons left" style={{ fontSize: 18 }}>clear</i></div>
                    </div>
                    <Modal.Body style={{ padding: 20, marginTop: 40, marginBottom: 45 }}>
                <div style={{width: '100%', textAlign: 'center'}}>
                    <img src="../assets/images/oneauth_light@2x.png" width={80} style={{margin: 20 }} />
                    <div>
                    <strong style={{ display: 'inline-block' }}>
                        Input the 6-digit code in your Authenticator app:
                        </strong>
                    </div>
                    <div>
                        <div className="dark-form" style={{ margin: 5, display: 'inline-block', width: 'calc(16.6% - 10px)' }}>
                            <Form.Control id="1" value={this.state["1"]} className="form-dark" onChange={this.handleChange} onKeyDown={this.onKeyPressed} tabIndex="0" style={form_dark} autoComplete="off"></Form.Control>
                        </div>
                        <div className="dark-form" style={{ margin: 5, display: 'inline-block', width: 'calc(16.6% - 10px)' }}>
                            <Form.Control id="2" value={this.state["2"]} className="form-dark" onChange={this.handleChange} onKeyDown={this.onKeyPressed} tabIndex="0" style={form_dark} autoComplete="off"></Form.Control>
                        </div>
                        <div className="dark-form" style={{ margin: 5, display: 'inline-block', width: 'calc(16.6% - 10px)' }}>
                            <Form.Control id="3" value={this.state["3"]} className="form-dark" onChange={this.handleChange} onKeyDown={this.onKeyPressed} tabIndex="0" style={form_dark} autoComplete="off"></Form.Control>
                        </div>
                        <div className="dark-form" style={{ margin: 5, display: 'inline-block', width: 'calc(16.6% - 10px)' }}>
                            <Form.Control id="4" value={this.state["4"]} className="form-dark" onChange={this.handleChange} onKeyDown={this.onKeyPressed} tabIndex="0" style={form_dark} autoComplete="off"></Form.Control>
                        </div>
                        <div className="dark-form" style={{ margin: 5, display: 'inline-block', width: 'calc(16.6% - 10px)' }}>
                            <Form.Control id="5" value={this.state["5"]} className="form-dark" onChange={this.handleChange} onKeyDown={this.onKeyPressed} tabIndex="0" style={form_dark} autoComplete="off"></Form.Control>
                        </div>
                        <div className="dark-form" style={{ margin: 5, display: 'inline-block', width: 'calc(16.6% - 10px)' }}>
                            <Form.Control id="6" value={this.state["6"]} className="form-dark" onChange={this.handleChange} onKeyDown={this.onKeyPressed} tabIndex="0" style={form_dark} autoComplete="off"></Form.Control>
                        </div>
                    </div>
                    <p style={{marginTop: 10}}>Lost access to your 2fa? <a href="https://bitnationdo.freshdesk.com/"><strong>Click here.</strong></a></p>
                    
                </div>
                    </Modal.Body>
                </Modal>
            </Container>
        )
    }
}

export default Authenticator;