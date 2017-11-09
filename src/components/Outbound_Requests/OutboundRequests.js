import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUserInfo } from './../../ducks/reducer'
import './OutboundRequests.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Header from './../../Header';
import StripeCheckout from 'react-stripe-checkout';
import stripe from './stripeKey'


export class OutboundRequests extends Component {
    constructor() {
        super()

        this.state = {
            requests: []
        }
        this.deleteRequest = this.deleteRequest.bind(this)
    }


    onToken = (token) => {
        token.card = void 0;
        console.log('token', token);
        axios.post('http://localhost:3000/api/payment', { token, amount: 100 } ).then(response => {
          alert('we are in business')
        });
      }

    getRequests() {
        axios.get('/outbound/requests/' + this.props.user.userid)
            .then((response) => {
                this.setState({
                    requests: response.data
                })
            })
    }

    componentDidMount() {
        this.props.getUserInfo();
        this.getRequests();

    }

    deleteRequest(e) {
        axios.delete(`/remove/request`, {
            data: {
                id: this.props.user.userid,
                itemid: e
            }
        }).then((response) => {
            this.getRequests()
        })

    }

    render() {
        // var mapRequests = this.state.requests.map( (e, i, arr) => {
        //     return <div className='list-items' key={i}>
        //         <img alt='' src={e.image_url} /> {e.item_name} Lender: {e.first_name}
        //     </div>
        // })

        var sentRequests = this.state.requests.map((e, i, arr) => {
            if (e.pending === true) {
                return <div className='list-items pending' key={i} >  {e.item_name} PENDING  <button onClick={() => this.deleteRequest(e.item_id)}> CANCEL REQUEST </button> </div>
            } else if (e.approved === true && e.pending === false) {
                return <div className='list-items approved' key={i}> {e.item_name} APPROVED  <button onClick={() => this.deleteRequest(e.item_id)}> RETURNED </button> </div>
            } else if (e.approved === false && e.pending === false) {
                return <div className='list-items denied' key={i}> {e.item_name} DENIED <button onClick={() => this.deleteRequest(e.item_id)}> REMOVE </button></div>
            }
        })
        console.log(sentRequests)
        console.log(this.state.requests)
        console.log(this.props.user.userid)
        return (
            <div className='main-container'>
                <StripeCheckout
          token={this.onToken}
          stripeKey={ stripe.pub_key }
          amount={1000}
        />
                <Header title='SENT REQUESTS'/>


                <div className='list-container'>
                    <div className='list-subcontainer'>
                        {/* {mapRequests}  */}
                        {sentRequests}

                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, { getUserInfo })(OutboundRequests)
