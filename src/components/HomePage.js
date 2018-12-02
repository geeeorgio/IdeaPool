import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class HomePage extends Component {
  render() {
    return (
      <div className='home'>
        <div className="greetings">
          <h4 className="alert-heading">Welcome Camper!</h4>
          <p>Soon you will find something interesting here. </p>
          <p>Stay tuned and keep it real.</p>
          <p>Take this link and <Link to='/login'>login</Link></p>            
        </div>
      </div>
    )
  }
}