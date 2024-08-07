import React, { useState } from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { HiHome, HiOutlineHome } from 'react-icons/hi'
import { MdAccountCircle, MdOutlineAccountCircle } from 'react-icons/md'
import { RiDiscountPercentFill, RiDiscountPercentLine } from 'react-icons/ri'
import { BsDot } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import styles from './mobileNavBar.module.css'
import { PATH } from 'constants/path'

export default function MobileNavBar() {
  const navigate = useNavigate()
  const activeKey = window.location.pathname;

  const handleHomeClick = () => {
    navigate(PATH.HOME)
  }

  const handleExploreClick = () => {
    navigate(PATH.EXPLORE.ROOT)
  }

  const handleAccountClick = () => {
    navigate(PATH.USER.PROFILE)
  }

  const BottomNavBar = () => {
    return (
      <Styles>
        <Navbar bg="light" variant="light" fixed="bottom" className="pb-0">
          <Container fluid className="p-3 container">
            <Nav className="mx-0 p-0 d-flex justify-content-around w-100" activeKey={activeKey}>
              <Nav.Link className="m-0 p-1 position-relative" onClick={handleHomeClick} eventKey="/">
                {activeKey === PATH.HOME ? (
                  <>
                    <HiHome className={`mx-auto ${styles.navIcon}`} size="25" />
                    <BsDot className="dot" size="25" />
                  </>
                ) : (
                  <HiOutlineHome className={`mx-auto ${styles.navIcon}`} size="25" />
                )}
              </Nav.Link>
              <Nav.Link className="m-0 p-1 position-relative" onClick={handleExploreClick} eventKey="/explore">
                {activeKey === PATH.EXPLORE.ROOT ? (
                  <>
                    <RiDiscountPercentFill className={`mx-auto ${styles.navIcon}`} size="25" />
                    <BsDot className="dot" size="25" />
                  </>
                ) : (
                  <RiDiscountPercentLine className={`mx-auto ${styles.navIcon}`} size="25" />
                )}
              </Nav.Link>
              <Nav.Link className="m-0 p-1 position-relative" onClick={handleAccountClick} eventKey="/account">
                {activeKey === PATH.ACCOUNT || activeKey === PATH.USER.PROFILE ? (
                  <>
                    <MdAccountCircle className={`mx-auto ${styles.navIcon}`} size="25" />
                    <BsDot className="dot" size="25" />
                  </>
                ) : (
                  <MdOutlineAccountCircle className={`mx-auto ${styles.navIcon}`} size="25" />
                )}

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
