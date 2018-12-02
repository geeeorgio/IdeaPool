import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { removeTokens } from '../tokens';
import { userLogOut } from '../api'
import '../App.css';

class Logout extends Component {
	constructor(props) {
    super(props);
		this.state = {
			signedOut: false,
		}
	}

	componentDidMount() {
		userLogOut(); 
		removeTokens();
		this.props.onLogout();
		this.setState({ signedOut: true });		      
	}

    render() {
		if (this.state.signedOut) {
			return <Redirect to="/login"/>
		}
    return null;
  }
}

export default Logout;
