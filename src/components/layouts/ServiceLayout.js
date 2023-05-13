import useMediaQuery from 'hooks/useMediaQuery'
import styled from 'styled-components'
import TitleBar from 'components/TitleBar'
import useScrollDirection from 'hooks/useScrollDirection'

function ServiceLayout({ pageTitle, navigationTo, navbarColor, children, noTitle }) {
  const isTablet = useMediaQuery('(max-width: 768px)')
  const scrollDirection = useScrollDirection()

  return (
    <div>
      <NavStyled status={scrollDirection}>
        {!noTitle && <TitleBar title={pageTitle} navigation={navigationTo} backgroundColor={navbarColor} />}
      </NavStyled>
      <LayoutStyled isTablet={isTablet}>{children}</LayoutStyled>
    </div>
  )
}

const LayoutStyled = styled.div`
  margin: ${props => (props.isTablet === true ? '0 0%' : '0 15%')};
  background-color: ${({theme}) => (theme.color.background)};
  margin-top: 1.5rem;
  padding: 1.5rem;
  border-radius: 1rem;
`

const NavStyled = styled.div`
  position: sticky;
  z-index: 1000;
  top: ${props => (props.status === 'down' ? '-150px' : '0px')};
  transition: all;
  transition-duration: 0.25s;
`

export default ServiceLayout
