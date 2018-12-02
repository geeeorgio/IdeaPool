import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class NotFound extends Component {
  render() {
    return (
      <div className='container'>
        <div className="alert alert-error">
          <h4 className="alert-heading">Oh snap! Page not found</h4>
          <p>Bro, you are doing something wrong. </p>
          <p>Anyway keep it real.</p>
          <p>Back to <Link to='/home'>home page</Link>?</p>            
        </div>
      </div>
    )
  }
}