import React, { Component } from 'react';
import './App.css';
import { currentUser } from './api';
import { getTokens } from './tokens';
import RetinaImage from 'react-retina-image';
import { Login,	Signup,	Logout,	Main, NotFound, HomePage, About } from './components/index';
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  if(rest.loaded) {
    return <Route {...rest} render={props => (
      rest.user ? (
        <Component {...props}/>
      ) : (
        <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }}/>
      )
    )}/>
  }
  else
  {
    return <Route {...rest} render={() => <div className="loading-screen">Loading...</div>}/>
  }
}

const User = (props) => {
    if(props.data){
        return (
            <div className="current-user">
              <RetinaImage src={props.data.avatar_url} alt=""/>
              <Link style={{color:'white'}} to='/'><h2 className="current-user-name">{props.data.name}</h2></Link>
              <Link className="current-user-logout" to="/logout">Log out</Link>
            </div>
        )
    }
    else {
        return null
    }
}

class App extends Component {
    constructor(props) {
    super(props);
        this.state = {
            loaded: false,
            user: false
        }
    this.updateUser = this.updateUser.bind(this);    
    }

    updateUser() {
        let token = getTokens(); 
        if (!token) { 
            this.setState({ user: false });             
        } else {
            currentUser(token,(cb) => cb.res ? this.setState({ user: cb.res }) : this.setState({ user: false })); 
        }                           
    }
      
    componentDidMount() {
        let token = getTokens(); 
        if (!token) { 
            this.setState({ user: false, loaded: true });            
        } else {            
          currentUser(token,(cb) => cb.res ? this.setState({ user: cb.res, loaded: true }) : 
            this.setState({ user: false, loaded: true }));  
        }         
    }

    render() {
	    return (
        <Router>
          <div className="container">
            <aside className="sidebar">
              <div className="logo">
                <Link to="/home"><RetinaImage src={process.env.PUBLIC_URL + '/images/IdeaPool_icon.png'} alt=""/></Link>
                <Link style={{color: "white"}} to="/about"><h1 className="site-title">The Idea Pool</h1></Link>
              </div>
              <User data={this.state.user}/>
            </aside>
            <div className="content">
              <Switch>
                <PrivateRoute exact path="/" loaded={this.state.loaded} user={this.state.user} component={Main} />
                <Route exact path="/home" render={() => <HomePage />} />
                <Route exact path="/about" render={() => <About />} />
                <Route exact path="/login" render={() => <Login onAuthenticate={this.updateUser}/>} />
                <Route exact path="/signup" render={() => <Signup onAuthenticate={this.updateUser}/>} />
                <Route exact path="/logout" render={() => <Logout onLogout={this.updateUser}/>} />
                <Route component={NotFound} />
              </Switch>  
            </div> 
          </div>    
        </Router>          
      )
    }
}

export default App;