import React, { Component } from 'react'
import './InboundRequests.css'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getUserInfo } from './../../ducks/reducer';
import axios from 'axios'
import Header from './../../Header'

export class InboundRequests extends Component {
    constructor() {
        super()

        this.state = {
            requests: []
        }

    }

    getRequests() {
        axios.get(`/ownerrequests/${this.props.user.userid}`)
        .then((response) => {
            this.setState({
                requests: response.data
            })
            console.log(response.data)
        })
    }

    componentDidMount() {
        this.props.getUserInfo();
        this.getRequests();
    }

    approve(id) {
        axios.put(`/approve`, {
            id: id
        }).then( () => {
        this.getRequests();
    }
)}

    deny(id) {
        axios.put('/deny', {
            id: id
        }).then( () => {
        this.getRequests();
    }
)}

    render() {

        var requestsMap = this.state.requests.map((e, i, arr) => {
            return <div key={i} class='mapcontainer'>
               <img alt='' src={e.image_url} /> <div>{e.item_name} </div>
               <button onClick={ () => this.approve(e.item_id) }
               > Approve </button> || <button onClick={() => this.deny(e.item_id)}
               > Deny </button>
            </div>
        })
        console.log(this.props.user.userid)
        console.log(this.state.requests)
        return (
            
            <div className='container'>
                <Header title='INCOMING REQUESTS'/>
            {this.props.user.auth_id ? 
                <div className='profile-pic'>
                    <Link to='/profile'>
                        <img alt='' src={this.props.user.picture} />
                    </Link>
                
                <div className='requests'>
                    {requestsMap} 
                </div> 
                {this.state.requests.length < 1 ? <h1> YOU HAVE NO REQUESTS </h1> : null}
                </div>
                
                : <h1> PLEASE <Link to='/'> SIGN IN </Link> TO VIEW YOUR REQUESTS </h1>}
                
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, { getUserInfo })(InboundRequests)
