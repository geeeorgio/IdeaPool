import React, { Component } from 'react';
import '../App.css';
import { setTokens } from '../tokens';
import { userSignUp } from '../api';
import {
  Redirect,
	Link
} from 'react-router-dom'

class Signup extends Component {
	constructor(props) {
    super(props);
		this.state = {
			name: '',
			email: '',
			password: '',
			created: false,	
			errors: '',		
		}
		this.submit = this.submit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}
	handleInputChange(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	}
	submit(event) {
		event.preventDefault();
		let param = {
			email: this.state.email,
			name: this.state.name,
			password: this.state.password,
		}	
		userSignUp(param, (reply) => {
		    if (reply.res) {
		    	setTokens(reply.res);
		    	this.props.onAuthenticate();
		    	setTimeout(() => this.setState({ created: true }), 300)		    			         		     
		    } else {
			    this.setState({ errors: reply.err })
		    }
		});
	}
  
   render() {
		if (this.state.created) {			
			return <Redirect to="/" />			
		}
    return (
			<div className="form-container">
				<h1>Sign Up</h1>
				<form onSubmit={this.submit}>
					<div className="form-errors">
						{this.state.errors}
					</div>
					<div>
						<input type="text" placeholder="Name" name="name" onChange={this.handleInputChange} required/>
					</div>
					<div>
						<input type="email" placeholder="Email" name="email" onChange={this.handleInputChange} required/>
					</div>
					<div>
						<input type="password" placeholder="Password" name="password" onChange={this.handleInputChange} required/>
					</div>
					<div className="form-footer">
						<input type="submit" className="btn" value="Sign Up"/>
						<span>Already have an account? <Link to="/login">Log in</Link></span>
					</div>
				</form>
			</div>
    );
  }
}

export default Signup;
