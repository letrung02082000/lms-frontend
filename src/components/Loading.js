import React from 'react'
import Logo from 'assets/logo.png'

const Loading = props => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 99999,
  }} className='d-flex flex-column justify-content-center align-items-center bg-white opacity-75'>
    <img alt="Loading" src={Logo} className='w-50' />
    <p style={{ backgroundColor: '#F5F5FA', textAlign: 'center' }}>{props.message}</p>
    <div className="spinner-border text-primary" role="status">
    </div>
  </div>
)

export default Loading
