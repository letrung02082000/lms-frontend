import React from "react";
// import Footer from 'shared/components/Footer';
import Header from "components/Header";

const MainLayout = ({ children }) => {
  return (
    <div>
      <div>
        <a target="_blank" href="tel:+84877876877" rel="noopener noreferrer">
          <img
            src="/hotlineicon.gif"
            alt="icon"
            style={{
              width: "3.3rem",
              borderRadius: "50px",
            }}
          />
        </a>
      </div>
      <Header />
      {children}
      {/* <Footer /> */}
    </div>
  );
};

export default MainLayout;
