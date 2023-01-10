import React from "react";
import styled from "styled-components";
import useMediaQuery from "hooks/useMediaQuery";

const Logo = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <Styles isDesktop={isDesktop}>
      <img className="logo" src="/logo5.png" alt="logo" />
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
