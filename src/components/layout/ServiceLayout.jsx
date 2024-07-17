import useMediaQuery from 'hooks/useMediaQuery';
import styled from 'styled-components';
import TitleBar from 'components/TitleBar';
import useScrollDirection from 'hooks/useScrollDirection';

function ServiceLayout({
  pageTitle,
  navigationTo,
  navbarColor,
  children,
  noTitle,
  backTo,
  state,
}) {
  const isTablet = useMediaQuery('(max-width: 768px)');
  const scrollDirection = useScrollDirection();

  return (
    <div>
      <NavStyled status={scrollDirection}>
        {!noTitle && (
          <TitleBar
            title={pageTitle}
            navigation={navigationTo}
            backgroundColor={navbarColor}
            path={backTo}
            state={state}
          />
        )}
      </NavStyled>
      <LayoutStyled isTablet={isTablet}>{children}</LayoutStyled>
    </div>
  );
}

const LayoutStyled = styled.div`
  margin: ${(props) => (props.isTablet === true ? '0' : '0 5%')};
  background-color: ${({ theme }) => theme.color.background};
  padding: 1rem;
  padding-bottom: 5rem;
  border-radius: 1rem;
`;

const NavStyled = styled.div`
  position: sticky;
  z-index: 1050;
  top: ${(props) => (props.status === 'down' ? '-150px' : '0px')};
  transition: all;
  transition-duration: 0.25s;
`;

export default ServiceLayout;
