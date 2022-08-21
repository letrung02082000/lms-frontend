import React from 'react';
import DesktopNavBar from './DesktopNavBar';
import MobileNavBar from './MobileNavBar';

import './header.css';

function Header() {
  return (
    <>
      <div className='m-navbar'>
        <MobileNavBar />
      </div>
      <div className='d-navbar'>
        <DesktopNavBar />
      </div>
    </>
  );
}

export default Header;
