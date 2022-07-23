import { useNavigate } from 'react-router-dom';
import axios from 'axios';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, logoutUser } from 'store/userSlice';
import Tool from 'components/common/Tool';
import styled from 'styled-components';
import MainLayout from 'components/layouts/MainLayout';

function AccountPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    const refreshToken = localStorage.getItem('user-jwt-rftk');
    axios
      .post('/api/user/logout', { refreshToken })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    localStorage.removeItem('user-info');
    localStorage.removeItem('user-jwt-tk');
    localStorage.removeItem('user-jwt-rftk');
    dispatch(logoutUser());
  };

  return (
    <Styles>
      <MainLayout>
        {user.isLoggedIn ? (
          <>
            <Tool handle={handleLogout} title='Đăng xuất' />
          </>
        ) : (
          <div style={{ position: 'relative', height: '100%' }}>
            <div>
              <div className='welcome-title'>
                <p>Chào mừng bạn đến với iSinhVien!</p>
                <button onClick={handleLoginClick} className='button-outlined'>
                  Đăng nhập
                </button>
                <button onClick={handleSignUpClick} className='button-outlined'>
                  Đăng ký ngay
                </button>
              </div>
            </div>
          </div>
        )}
      </MainLayout>
    </Styles>
  );
}

export default AccountPage;

const Styles = styled.div`
  .account-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
  }
  .account-info img {
    border-radius: 50%;
  }
  .simple-button {
    background-color: rgb(245, 245, 250);
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 0.25rem 1rem;
  }

  .general {
    padding: 0.5rem;
    border-bottom: 3px solid #ccc;
  }
  .tool {
    width: 100%;
    cursor: pointer;
  }
  .tool:hover {
    background-color: #ccc;
  }
`;
