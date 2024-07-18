import { useNavigate } from "react-router-dom";
//redux
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logoutUser } from "store/userSlice";
import styled from "styled-components";
import MainLayout from "components/layouts/MainLayout";
import Item from "./components/Item";
import ProfileImage from "./components/ProfileImage";

import AccountApi from "api/accountApi";
import { PATH } from "constants/path";
import { formatPhoneNumber, profileMsg } from "utils/commonUtils";

function AccountPage() {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  console.log(userInfo)

  const handleLoginClick = () => {
    navigate(PATH.AUTH.SIGNIN);
  };

  const handleSignUpClick = () => {
    navigate(PATH.AUTH.SIGNIN);
  };

  return (
    <Styles>
        {user.isLoggedIn ? (
          <>
            <ProfileImage src={user.data.avatarUrl || "/common/avatar.png"} />
            <div className="d-flex flex-column align-items-center justify-content-center mb-5">
              <p className="mb-1">{profileMsg(userInfo?.name)}</p>
              <div><small>{formatPhoneNumber(userInfo?.zalo)}</small></div>
            </div>
            <Item path={PATH.EXPLORE.ROOT}>Ưu đãi</Item>
            <Item path={PATH.APP.ORDER_SUCCESS}>Đơn hàng của bạn</Item>
            <Item path={PATH.SUPPORT.ROOT}>Hỗ trợ</Item>
            {/* <Item onClick={handleLogout}>Đăng xuất</Item> */}
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
              <Item path={PATH.EXPLORE.ROOT}>Ưu đãi</Item>
              <Item path={PATH.APP.ORDER_SUCCESS}>Đơn hàng của bạn</Item>
              <Item path={PATH.SUPPORT.ROOT}>Hỗ trợ</Item>
            </div>
          </>
        )}
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
