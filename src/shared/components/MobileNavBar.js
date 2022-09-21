import React, { useState } from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { HiHome, HiOutlineHome } from 'react-icons/hi'
import { MdAccountCircle, MdOutlineAccountCircle } from 'react-icons/md'
import { RiCoupon2Line, RiCoupon3Fill } from 'react-icons/ri'
import { BsDot } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import styles from './mobileNavBar.module.css'

export default function MobileNavBar() {
  const navigate = useNavigate()
  const [activeKey, setActiveKey] = useState(window.location.pathname)

  const handleHomeClick = () => {
    setActiveKey('/')
    navigate('/')
  }

  const handleExploreClick = () => {
    setActiveKey('/explore')
    navigate('/explore')
  }

  const handleAccountClick = () => {
    setActiveKey('/account')
    navigate('/account')
  }

  const BottomNavBar = () => {
    return (
      <Styles>
        <Navbar bg="light" variant="light" fixed="bottom" className="pb-0">
          <Container fluid className="p-3 container">
            <Nav className="mx-0 p-0 d-flex justify-content-around w-100" activeKey={activeKey}>
              <Nav.Link className="m-0 p-1 position-relative" onClick={handleHomeClick} eventKey="/">
                {activeKey === '/' ? (
                  <>
                    <HiHome className={`mx-auto ${styles.navIcon}`} size="25" />
                    <BsDot className="dot" size="25" />
                  </>
                ) : (
                  <HiOutlineHome className={`mx-auto ${styles.navIcon}`} size="25" />
                )}
                {/* <p className={('m-0 p-0', styles.navText)}>Trang chủ</p> */}
              </Nav.Link>
              <Nav.Link className="m-0 p-1 position-relative" onClick={handleExploreClick} eventKey="/explore">
                {activeKey === '/explore' ? (
                  <>
                    <RiCoupon3Fill className={`mx-auto ${styles.navIcon}`} size="25" />
                    <BsDot className="dot" size="25" />
                  </>
                ) : (
                  <RiCoupon2Line className={`mx-auto ${styles.navIcon}`} size="25" />
                )}
              </Nav.Link>
              <Nav.Link className="m-0 p-1 position-relative" onClick={handleAccountClick} eventKey="/account">
                {activeKey === '/account' ? (
                  <>
                    <MdAccountCircle className={`mx-auto ${styles.navIcon}`} size="25" />
                    <BsDot className="dot" size="25" />
                  </>
                ) : (
                  <MdOutlineAccountCircle className={`mx-auto ${styles.navIcon}`} size="25" />
                )}

                {/* <p className={('m-0 p-0', styles.navText)}>Cá nhân</p> */}
              </Nav.Link>
            </Nav>
          </Container>
        </Navbar>
      </Styles>
    )
  }

  return <BottomNavBar />
}

const Styles = styled.div`
  .navIcon {
    width: 100%;
    color: var(--primary);
  }

  .navText {
    font-size: 0.9rem;
    margin: 0 0 0.5rem 0;
  }

  .container {
    box-shadow: rgba(60, 64, 67, 0.1) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
    border-radius: 10px 10px 0 0;
  }

  .accountButton {
    background-color: transparent;
    border-width: 0;
  }

  .dot {
    color: var(--secondary);
    position: absolute;
    bottom: -1rem;
    left: 50%;
    transform: translateX(-50%);
  }
`
