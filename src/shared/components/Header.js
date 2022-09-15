import React from 'react';
import { useState, useEffect } from 'react';
import DesktopNavBar from './DesktopNavBar';
import MobileNavBar from './MobileNavBar';
import styled, { keyframes } from 'styled-components';

import './header.css';
import useMediaQuery from 'hooks/useMediaQuery';

function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState(null);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? "down" : "up";
      if (direction !== scrollDirection && (scrollY - lastScrollY > 30 || scrollY - lastScrollY < -10)) {
        setScrollDirection(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };
    window.addEventListener("scroll", updateScrollDirection);
    return () => {
      window.removeEventListener("scroll", updateScrollDirection);
    }
  }, [scrollDirection]);

  console.log(scrollDirection + " scrollDirection");
  return scrollDirection;
};

function Header() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const scrollDirection = useScrollDirection();

  if (isMobile) {
    return (
        <MobileNavBar />
    );
  }
  return (
    <DesktopNavStyled status={scrollDirection}>
        <DesktopNavBar />
    </DesktopNavStyled>
  );
}

const DesktopNavStyled = styled.div`
  position: sticky;
  z-index: 2000;
  top: ${props => props.status === "down" ? "-150px" : "0px" };
  transition: all;
  transition-duration: 0.25s;
`;

export default Header;
