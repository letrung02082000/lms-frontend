import React from 'react'
import { useState, useEffect } from 'react'
import DesktopNavBar from './DesktopNavBar'
import MobileNavBar from './MobileNavBar'
import styled from 'styled-components'

import './header.css'
import useMediaQuery from 'hooks/useMediaQuery'

import { useScrollDirection } from 'utils'

function Header() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const scrollDirection = useScrollDirection()

  if (isMobile) {
    return <MobileNavBar />
  }
  return (
    <DesktopNavStyled status={scrollDirection}>
      <DesktopNavBar />
    </DesktopNavStyled>
  )
}

const DesktopNavStyled = styled.div`
  position: sticky;
  z-index: 2000;
  top: ${props => (props.status === 'down' ? '-150px' : '0px')};
  transition: all;
  transition-duration: 0.25s;
`

export default Header
