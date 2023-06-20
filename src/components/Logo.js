import React from "react";
import styled from "styled-components";
import useMediaQuery from "hooks/useMediaQuery";
import LogoImage from "assets/logo.png";

const Logo = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <Styles isDesktop={isDesktop}>
      <img className="logo" src={LogoImage} alt="logo" />
    </Styles>
  );
};

const Styles = styled.div`
  display: flex;
  justify-content: flex;
  align-items: center;

  .logo {
    width: 10rem;
    margin: 0 2rem;
  }
`;

export default Logo;
