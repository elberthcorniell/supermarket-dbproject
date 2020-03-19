import React, { Component } from 'react';
import {
    Card
} from "react-bootstrap"
    
class Banner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            background: [
                'url(\'../assets/images/banner_1.png\')',
            ],
            index: 0
        };
    }
    componentDidMount() {
        setInterval(()=>{
            if(this.state.index>=(this.state.background.length-1)){
                this.setState({
                    index: 0
                })
            }else{
                this.setState({
                    index: this.state.index+1
                })
            }
        }, 10000)
    }
    componentDidUpdate() {
    }
    render(){
        return(
            <Card style={{overflow: 'hidden', backgroundImage: this.state.background[this.state.index], backgroundSize: 'cover', backgroundPosition: 'center', minHeight: 100 }} className={this.props.mobile == true ? 'show' :'hidden'}>
            </Card>
        )
    }
}
export default Banner