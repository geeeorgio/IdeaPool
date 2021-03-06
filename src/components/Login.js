import React, { Component } from 'react';
import '../App.css';
import { userLogIn } from '../api';
import { setTokens } from '../tokens';
import {
  Redirect,
	Link
} from 'react-router-dom'

class Login extends Component {
	constructor(props) {
    super(props);
		this.state = {
			email: '',
			password: '',
			authenticated: false,
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
			password: this.state.password,
		}
		userLogIn(param, (reply) => {
		    if (reply.res) {
		    	setTokens(reply.res);
		        this.props.onAuthenticate(); 
		        setTimeout(() => this.setState({ authenticated: true }), 300);
		    } else {		    	
		        this.setState({ errors: reply.err })	     		               		        
			}
		})		
	}

    render() {
		if (this.state.authenticated) {
			return <Redirect to="/"/>
		}
        return (
			<div className="form-container">
				<h1>Log In</h1>
				<form onSubmit={this.submit}>
					<div className="form-errors">
						{this.state.errors}
					</div>
					<div>
						<input type="email" placeholder="Email" name="email" onChange={this.handleInputChange} required/>
					</div>
					<div>
						<input type="password" placeholder="Password" name="password" onChange={this.handleInputChange} required/>
					</div>
					<div className="form-footer">
						<input type="submit" className="btn" value="Log In"/>
						<span>Don’t have an account? <Link to="/signup">Create an account</Link></span>
					</div>
				</form>
			</div>
        );
   }
}

export default Login;
