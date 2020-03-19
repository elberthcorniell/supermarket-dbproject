import React, { Component } from 'react';

var diagram = new dhx.Diagram("diagram_container", { type: "org", defaultShapeType: "img-card" });
var orgChartData = [
    {
        id: "1",
        text: "none",
        title: "none",
        img: "../assets/images/noplan.png"
    },
    {
        id: "2",
        text: "none",
        title: "none",
        img: "../assets/images/noplan.png"
    },
    {
        id: "3",
        text: "none",
        title: "none",
        img: "../assets/images/noplan.png"
    },
    {
        id: "4",
        text: "none",
        title: "none",
        img: "../assets/images/noplan.png"
    },
    {
        id: "2.1",
        text: "none",
        title: "none",
        img: "../assets/images/noplan.png"
    },
    {
        id: "2.2",
        text: "none",
        title: "none",
        img: "../assets/images/noplan.png"
    },
    {
        id: "2.3",
        text: "none",
        title: "none",
        img: "../assets/images/noplan.png"
    },
    {
        id: "3.1",
        text: "none",
        title: "none",
        img: "../assets/images/noplan.png"
    },
    {
        id: "3.2",
        text: "none",
        title: "none",
        img: "../assets/images/noplan.png"
    },
    {
        id: "3.3",
        text: "none",
        title: "none",
        img: "../assets/images/noplan.png"
    }, {
        id: "4.1",
        text: "none",
        title: "none",
        img: "../assets/images/noplan.png"
    }, {
        id: "4.2",
        text: "none",
        title: "none",
        img: "../assets/images/noplan.png"
    },
    {
        id: "4.3",
        text: "none",
        title: "none",
        img: "../assets/images/noplan.png"
    },
    { id: "1-2", from: "1", to: "2", type: "line", points: [{ x: 100, y: 100 }] },
    { id: "1-3", from: "1", to: "3", type: "line" },
    { id: "1-3", from: "1", to: "4", type: "line" },
    { id: "2-2.1", from: "2", to: "2.1", type: "line" },
    { id: "2-2.2", from: "2", to: "2.2", type: "line" },
    { id: "2-2.3", from: "2", to: "2.3", type: "line" },
    { id: "3-3.1", from: "3", to: "3.1", type: "line" },
    { id: "3-3.2", from: "3", to: "3.2", type: "line" },
    { id: "3-3.3", from: "3", to: "3.3", type: "line" },
    { id: "4-4.1", from: "4", to: "4.1", type: "line" },
    { id: "4-4.2", from: "4", to: "4.2", type: "line" },
    { id: "4-4.3", from: "4", to: "4.3", type: "line" },
];
class Tree extends Component {
    constructor() {
        super();
        this.state = {
            orgChartData
        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        const { id, value } = e.target;
        this.setState({
            [id]: value
        })
    }
    componentDidMount() {
        setTimeout(() => {
            this.getTree()
        }, 100)

        diagram.data.parse(this.state.orgChartData);
    }
    getLogo(plan) {
        return "../assets/images/" + (plan == 0 ? 'noplan' : (plan > 0 && plan < 51) ? 'BRONZE_COIN' : (plan > 50 && plan < 151) ? 'SILVER_COIN' : (plan > 150 && plan < 301) ? 'GOLD_COIN' : 'PLATINIUM_COIN') + ".png"
    }
    getTree() {
        fetch('/api/fund/network/tree', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('authtoken')
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    var plan = this.props.plan
                    console.log(this.props)
                    this.setState({
                        orgChartData: [
                            {
                                id: "1",
                                text: plan * 50 + ' USD',
                                title: this.props.username,
                                img: this.getLogo(plan)
                            },
                            {
                                id: "2",
                                text: data.data[0].investment * 50 + ' USD',
                                title: data.data[0].username,
                                img: this.getLogo(data.data[0].investment),
                                open: false
                            },
                            {
                                id: "3",
                                text: data.data[1].investment * 50 + ' USD',
                                title: data.data[1].username,
                                img: this.getLogo(data.data[1].investment),
                                open: false
                            },
                            {
                                id: "4",
                                text: data.data[2].investment * 50 + ' USD',
                                title: data.data[2].username,
                                img: this.getLogo(data.data[2].investment),
                                open: false
                            },
                            {
                                id: "2.1",
                                text: data.data[3].investment * 50 + ' USD',
                                title: data.data[3].username,
                                img: this.getLogo(data.data[3].investment)
                            },
                            {
                                id: "2.2",
                                text: data.data[4].investment * 50 + ' USD',
                                title: data.data[4].username,
                                img: this.getLogo(data.data[4].investment)
                            },
                            {
                                id: "2.3",
                                text: data.data[5].investment * 50 + ' USD',
                                title: data.data[5].username,
                                img: this.getLogo(data.data[5].investment)
                            },
                            {
                                id: "3.1",
                                text: data.data[6].investment * 50 + ' USD',
                                title: data.data[6].username,
                                img: this.getLogo(data.data[6].investment)
                            },
                            {
                                id: "3.2",
                                text: data.data[7].investment * 50 + ' USD',
                                title: data.data[7].username,
                                img: this.getLogo(data.data[7].investment)
                            },
                            {
                                id: "3.3",
                                text: data.data[8].investment * 50 + ' USD',
                                title: data.data[8].username,
                                img: this.getLogo(data.data[8].investment)
                            }, {
                                id: "4.1",
                                text: data.data[9].investment * 50 + ' USD',
                                title: data.data[9].username,
                                img: this.getLogo(data.data[9].investment)
                            }, {
                                id: "4.2",
                                text: data.data[10].investment * 50 + ' USD',
                                title: data.data[10].username,
                                img: this.getLogo(data.data[10].investment)
                            },
                            {
                                id: "4.3",
                                text: data.data[11].investment * 50 + ' USD',
                                title: data.data[11].username,
                                img: this.getLogo(data.data[11].investment)
                            },
                            { id: "1-2", from: "1", to: "2", type: "line", points: [{ x: 100, y: 100 }] },
                            { id: "1-3", from: "1", to: "3", type: "line" },
                            { id: "1-3", from: "1", to: "4", type: "line" },
                            { id: "2-2.1", from: "2", to: "2.1", type: "line" },
                            { id: "2-2.2", from: "2", to: "2.2", type: "line" },
                            { id: "2-2.3", from: "2", to: "2.3", type: "line" },
                            { id: "3-3.1", from: "3", to: "3.1", type: "line" },
                            { id: "3-3.2", from: "3", to: "3.2", type: "line" },
                            { id: "3-3.3", from: "3", to: "3.3", type: "line" },
                            { id: "4-4.1", from: "4", to: "4.1", type: "line" },
                            { id: "4-4.2", from: "4", to: "4.2", type: "line" },
                            { id: "4-4.3", from: "4", to: "4.3", type: "line" },
                        ]
                    })
                }
            }).then(() => diagram.data.parse(this.state.orgChartData))
    }
    render() {

        return (
            <div className='container'>

                <div id="diagram_container" >
                </div>
            </div>
        )
    }
}

export default Tree;