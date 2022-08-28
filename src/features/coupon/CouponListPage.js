import axios from 'axios';
import { useEffect, useState } from 'react';

import authHeader from 'utils/authHeader';
import styles from './couponListPage.module.css';

import Loading from 'shared/components/Loading';
import TitleBar from 'shared/components/TitleBar';
import { useSelector } from 'react-redux';
import { selectUser } from 'store/userSlice';
import VoucherCard from './components/VoucherCard';
import { useLocation } from 'react-router-dom';

export function CouponListPage(props) {
  const user = useSelector(selectUser);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const type = parseInt(query.get('type'));
  const limit = 25;
  const [data, setData] = useState([]);
  const [myCouponList, setMyCouponList] = useState([]);

  let title = '';

  switch (type) {
    case 99:
      title = 'Ưu đãi mới';
      break;
    case 100:
      title = 'Ưu đãi độc quyền';
      break;

    case 0:
      title = 'Ưu đãi tất cả dịch vụ';
      break;
    case 1:
      title = 'Ưu đãi ăn uống';
      break;
    case 2:
      title = 'Ưu đãi khóa học';
      break;
    case 3:
      title = 'Ưu đãi in ấn';
      break;
    case 4:
      title = 'Ưu đãi đồng phục';
      break;
    default:
      break;
  }

  useEffect(() => {
    if (type == 99) {
      axios
        .get('/api/coupon/available', { params: { limit: 25 } })
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data.data);
            setData(res.data.data);
          }
        });
    } else if (type == 100) {
      axios
        .get('/api/coupon/whitelist', { params: { limit: 25 } })
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data.data);
            setData(res.data.data);
          }
        });
    } else {
      axios.get('/api/coupon', { params: { type, limit } }).then((res) => {
        if (res.status === 200) {
          console.log(res.data.data);
          setData(res.data.data);
        }
      });
    }
  }, [type]);

  useEffect(() => {
    if (user.isLoggedIn) {
      axios
        .get('/api/coupon-user/my-coupon', authHeader())
        .then((res) => {
          if (res.data.data) {
            setMyCouponList(res.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user.isLoggedIn]);

  if (!myCouponList && !data) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <TitleBar title={title} navigation='/explore' />
      <div className={styles.couponListContainer}>
        {data.map((child) => {
          return (
            <VoucherCard
              key={child._id}
              coupon={child}
              myCouponList={myCouponList}
              setMyCouponList={setMyCouponList}
            />
          );
        })}
      </div>
    </div>
  );
}

export default CouponListPage;
