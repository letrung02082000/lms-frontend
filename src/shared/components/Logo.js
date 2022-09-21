import React from 'react'
import styled from 'styled-components'
import useMediaQuery from 'hooks/useMediaQuery'

const Logo = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <Styles isDesktop={isDesktop}>
      {/* <span className="i">i</span>
      <img className="logo" src="/logo.png" alt="logo" />
      <span className="inhvien">inhvien</span> */}
      <img className="logo" src="/logo3.png" alt="logo" />
    </Styles>
  )
}

const Styles = styled.div`
  display: flex;
  justify-content: flex;
  align-items: center;
  margin: ${props => (props.isDesktop === true ? '0' : '1rem 0.5rem')};

  .logo {
    width: 10rem;
    /* border-radius: 15px; */
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
