import React from 'react'
import styled from 'styled-components'
import useMediaQuery from 'hooks/useMediaQuery'

const Logo = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <Styles isDesktop={isDesktop}>
      <span className="i">i</span>
      <img className="logo" src="/logo.png" alt="logo" />
      <span className="inhvien">inhvien</span>
    </Styles>
  )
}

const Styles = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: ${props => (props.isDesktop === true ? '0.5rem' : '1.5rem 0.5rem')};

  .logo {
    width: 2rem;
    border-radius: 15px;
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
