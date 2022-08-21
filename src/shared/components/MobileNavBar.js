import React, { useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { HiHome } from 'react-icons/hi';
import { MdAccountCircle, MdExplore } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import styles from './mobileNavBar.module.css';

export default function MobileNavBar() {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState(window.location.pathname);

  const handleHomeClick = () => {
    setActiveKey('/');
    navigate('/');
  };

  const handleExploreClick = () => {
    setActiveKey('/explore');
    navigate('/explore');
  };

  const handleAccountClick = () => {
    setActiveKey('/account');
    navigate('/account');
  };

  const BottomNavBar = () => {
    return (
      <Navbar bg='light' variant='light' fixed='bottom' className='pb-0'>
        <Container fluid className={`p-0 ${styles.bottomNavContainer}`}>
          <Nav
            className='mx-0 p-0 d-flex justify-content-around w-100'
            activeKey={activeKey}
          >
            <Nav.Link
              className='m-0 p-1'
              onClick={handleHomeClick}
              eventKey='/'
            >
              <HiHome className={`mx-auto ${styles.navIcon}`} />
              <p className={('m-0 p-0', styles.navText)}>Trang chủ</p>
            </Nav.Link>
            <Nav.Link
              className='m-0 p-1'
              onClick={handleExploreClick}
              eventKey='/explore'
            >
              <MdExplore className={`mx-auto ${styles.navIcon}`} />
              <p className={('m-0 p-0', styles.navText)}>Ưu đãi</p>
            </Nav.Link>
            <Nav.Link
              className='m-0 p-1'
              onClick={handleAccountClick}
              eventKey='/account'
            >
              <MdAccountCircle className={`mx-auto ${styles.navIcon}`} />
              <p className={('m-0 p-0', styles.navText)}>Cá nhân</p>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    );
  };

  return <BottomNavBar />;
}
