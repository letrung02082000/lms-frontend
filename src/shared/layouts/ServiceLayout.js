import useMediaQuery from 'hooks/useMediaQuery'
import styled from 'styled-components'
import TitleBar from 'shared/components/TitleBar'
import useScrollDirection from 'hooks/useScrollDirection'

function ServiceLayout({ pageTitle, navigationTo, navbarColor, children }) {
  const isTablet = useMediaQuery('(max-width: 768px)')
  const scrollDirection = useScrollDirection()

  return (
    <div>
      <NavStyled status={scrollDirection}>
        <TitleBar title={pageTitle} navigation={navigationTo} backgroundColor={navbarColor} />
      </NavStyled>
      <LayoutStyled isTablet={isTablet}>{children}</LayoutStyled>
    </div>
  )
}

const LayoutStyled = styled.div`
  margin: ${props => (props.isTablet === true ? '0 0%' : '0 15%')};
`

const NavStyled = styled.div`
  position: sticky;
  z-index: 2000;
  top: ${props => (props.status === 'down' ? '-150px' : '0px')};
  transition: all;
  transition-duration: 0.25s;
`

export default ServiceLayout
