import React from 'react'
import styled from 'styled-components'
import useMediaQuery from 'hooks/useMediaQuery'

const Logo = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <Styles isDesktop={isDesktop}>
      <img className="logo" src="/logo3.png" alt="logo" />
    </Styles>
  )
}

const Styles = styled.div`
  display: flex;
  justify-content: flex;
  align-items: center;

  .logo {
    width: 10rem;
  }

  .i {
    color: #18579d;
    font-weight: bold;
  }

  .inhvien {
    color: #ee6a26;
    font-weight: bold;
  }
`

export default Logo
