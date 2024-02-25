import useMediaQuery from "hooks/useMediaQuery";
import React, { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser, selectUser } from "../store/userSlice";
import styles from "./desktopNavBar.module.css";
import Logo from "./Logo";
import Tool from "./Tool";
import { PATH } from "constants/path";

function DesktopNavBar(props) {
  const user = useSelector(selectUser);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [activeKey, setActiveKey] = useState(window.location.pathname || "/");

  const handleSelectedKeyChange = (selectedKey) => {
    setActiveKey(selectedKey);
    console.log(selectedKey);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleHomeClick = () => {
    setActiveKey("/");
    navigate("/");
  };

  const handleSignUpClick = () => {
    setActiveKey(null);
    navigate("/login");
  };

  const handleLoginClick = () => {
    setActiveKey(null);
    navigate("/login");
  };

  const handleProfileClick = () => {
    setActiveKey(null);
    navigate(PATH.USER.PROFILE);
  };

  const handleLogoutClick = () => {
    dispatch(logoutUser());
  };
  const NavBarComponent = () => {
    return (
      <Navbar bg="light">
        <Container fluid>
          <Navbar.Brand>
            <Nav.Link onClick={handleHomeClick}>
              <Logo />
            </Nav.Link>
          </Navbar.Brand>
          <Nav
            className="w-100 justify-content-start"
            activeKey={activeKey}
            onSelect={handleSelectedKeyChange}
          >
            <Nav.Link
              eventKey="/"
              className={`${styles.navItem} ${
                activeKey === "/" ? styles.selectedNav : styles.unSelectedNav
              }`}
              onClick={handleHomeClick}
            >
              Trang chủ
            </Nav.Link>

            <Nav.Link
              eventKey="/explore"
              className={`${styles.navItem} ${styles.navItemBadge} ${
                activeKey === "/explore"
                  ? styles.selectedNav
                  : styles.unSelectedNav
              } `}
              onClick={() => {
                setActiveKey("/explore");
                navigate("/explore");
              }}
            >
              Ưu đãi
            </Nav.Link>
          </Nav>
          <div className={`d-flex flex-row ${styles.dropDownMenu}`}>
            {user.isLoggedIn ? (
              <>
                <button
                  onClick={handleProfileClick}
                  style={{ backgroundColor: "transparent", borderWidth: "0" }}
                >
                  <img
                    src={user.data.avatarUrl || "/common/avatar.png"}
                    alt="avt"
                    style={{
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "50px",
                    }}
                  />
                  <span>{user.data.email}</span>
                </button>
                <div className={styles.dropDown}>
                  <Tool title="Đăng xuất" handle={handleLogoutClick} />
                </div>
              </>
            ) : (
              <>
                <button
                  className={styles.buttonContainer}
                  onClick={handleLoginClick}
                >
                  Đăng nhập
                </button>
                <button
                  className={styles.buttonContainer}
                  onClick={handleSignUpClick}
                >
                  Đăng ký
                </button>
              </>
            )}
          </div>
        </Container>
      </Navbar>
    );
  };

  return (
    <React.Fragment>
      <NavBarComponent />
    </React.Fragment>
  );
}

export default DesktopNavBar;
