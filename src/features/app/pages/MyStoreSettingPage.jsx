import { useNavigate } from "react-router-dom";
//redux
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logoutUser } from "store/userSlice";
import styled from "styled-components";
import Item from "../components/my-store/Item";
import ProfileImage from "../components/my-store/ProfileImage";

import { PATH } from "constants/path";
import { formatPhoneNumber, profileMsg } from "utils/commonUtils";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import storeApi from "api/storeApi";

function MyStoreSettingPage() {
  const navigate = useNavigate();
  const storeId = JSON.parse(localStorage.getItem('user-info'))?.store;
  const [storeInfo, setStoreInfo] = useState({});

  useEffect(() => {
    if (!storeId) {
      // Redirect to store creation page
    }

    storeApi
      .getStoreById(storeId)
      .then((res) => {
        setStoreInfo(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [storeId]);

  const handleLoginClick = () => {
    navigate(PATH.AUTH.SIGNIN);
  };

  const handleSignUpClick = () => {
    navigate(PATH.AUTH.SIGNIN);
  };

  return (
    <Styles>
      {storeId ? (
        <>
          <ProfileImage src={"/common/avatar.png"} />
          <div className="d-flex flex-column align-items-center justify-content-center mb-5">
            <p className="mb-1">{profileMsg(storeInfo?.name)}</p>
            <div><small>{formatPhoneNumber(storeInfo?.zalo)}</small></div>
            <Button onClick={() => navigate(PATH.ACCOUNT)} variant="outline-primary" className="mt-2 rounded-pill">Về trang cá nhân</Button>
          </div>
          <Item path={PATH.APP.MY_STORE.ORDER}>Quản lý đơn hàng</Item>
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
            <Item path={PATH.APP.MY_ORDER}>Đơn hàng của tôi</Item>
            <Item path={PATH.SUPPORT.ROOT}>Hỗ trợ</Item>
          </div>
        </>
      )}
    </Styles>
  );
}
export default MyStoreSettingPage;

const Styles = styled.div`
  .content {
    margin: 0 auto;
    margin-bottom: 10rem;
    width: ${({ theme }) => (theme.isDesktop ? '60%' : '95%')};
  }

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
