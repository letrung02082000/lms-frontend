import React, { useState } from "react";
// import styles from "./drivingAdminLayout.module.css";
import styled from "styled-components";

function CouponAdminLayout({ children, onNavigate, onLogout }) {
  const [visible, setVisible] = useState(true);

  return (
    <Styled>
      {visible ? (
        <div className={"leftNav"}>
          <h3 className={"pageTitle"}>
            Quản lý
            <br />
            Coupon
          </h3>
          <div className={"navItems"}>
            <div>
              <div className={"navItem"} onClick={() => onNavigate("/admin")}>
                <p>Quản lý</p>
              </div>
              <div className={"navItem"} onClick={() => onNavigate("/QR")}>
                <p>Quét QR</p>
              </div>
              <div className={"navItem"} onClick={() => setVisible(false)}>
                <p>Ẩn</p>
              </div>
            </div>
            <div className={"navItem"} onClick={() => onLogout()}>
              <p>Đăng xuất</p>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            setVisible(true);
          }}
        >
          Hiện
        </button>
      )}
      <div className={"mainBoard"}>{children}</div>
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  /* border: 1px solid black; */
  min-height: 100vh;

  .pageTitle {
    color: white;
    font-weight: bold;
    text-align: center;
    padding: 1rem;
    font-size: 1.5rem;
    text-transform: uppercase;
    line-height: 2.5rem;
  }

  .navItems {
    height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .navItem {
    display: flex;
    cursor: pointer;
    width: 100%;
  }

  .navItem p {
    width: 100%;
    text-align: center;
    background-color: rgb(65, 179, 154);
    color: var(--white);
    font-weight: bold;
    margin: 0.2rem;
    padding: 0.7rem 0;
    border-radius: 5px;
  }

  .leftNav {
    width: 17%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--primary);
  }

  .mainBoard {
    width: 100%;
    height: 100vh;
    overflow: scroll;
  }
`;

export default CouponAdminLayout;
