import { useNavigate } from "react-router-dom";
//redux
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logoutUser } from "store/userSlice";
import styled from "styled-components";
import MainLayout from "shared/layouts/MainLayout";
import Item from "./components/Item";
import ProfileImage from "./components/ProfileImage";

import AccountApi from "api/accountApi";

function AccountPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleSignUpClick = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    const refreshToken = localStorage.getItem("user-jwt-rftk");
    AccountApi.logoutUser(refreshToken)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    localStorage.removeItem("user-info");
    localStorage.removeItem("user-jwt-tk");
    localStorage.removeItem("user-jwt-rftk");
    dispatch(logoutUser());
  };

  return (
    <Styles>
      <MainLayout>
        {user.isLoggedIn ? (
          <>
            <ProfileImage src={user.data.avatarUrl || "/common/avatar.png"} />
            <div style={{ display: "flex", justifyContent: "center" }}>
              Xin chào {user?.data?.name || "bạn"}!
            </div>
            <Item path="/support">Hỗ trợ</Item>
            <Item onClick={handleLogout}>Đăng xuất</Item>
          </>
        ) : (
          <>
            <div className="welcome">
              <p className="welcome-title">Chào mừng bạn đến với iSinhVien!</p>
              <button onClick={handleLoginClick} className="btn fw-bold">
                Đăng nhập
              </button>
              <button onClick={handleSignUpClick} className="btn fw-bold ms-3">
                Đăng ký ngay
              </button>
            </div>
            <div className="content">
              <Item path="/support">Hỗ trợ</Item>
            </div>
          </>
        )}
      </MainLayout>
    </Styles>
  );
}
export default AccountPage;

const Styles = styled.div`
  .welcome {
    padding: 1rem;
    background-color: var(--primary);

    p {
      color: var(--white);
      font-weight: bold;
    }

    button {
      color: white;
      border: 1px solid white;
    }
  }

  .content {
    margin-top: 1rem;
  }
`;
