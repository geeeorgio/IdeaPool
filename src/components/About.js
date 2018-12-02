import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class About extends Component {
  render() {
    return (
      <div className='about'>
        <div className="info">
          <h4 className="alert-heading">Work in process bro!</h4>
          <p>There will be some info about some stuff here. </p>
          <p>Stay tuned and keep it real.</p>
          <p>Take this link and <Link to='/login'>login</Link></p>            
        </div>
      </div>
    )
  }
}