import orderApi from 'api/orderApi';
import React, { useEffect } from 'react';
import OrderInfo from '../components/OrderInfo';

function OrderHistoryPage() {
  const [orderHistory, setOrderHistory] = React.useState([]);
  const order = JSON.parse(localStorage.getItem('order') || '{}');
  console.log(orderHistory)
  useEffect(() => {
    orderApi
      .queryOrder({ tel: order?.tel })
      .then((res) => {
        setOrderHistory(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if(orderHistory.length === 0) {
    return <p className='text-center p-0 m-0'>Không tìm thấy đơn hàng của bạn!</p>
  }

  return <>
    {
      orderHistory?.map((order, index) => {
        return (
          <div className='border border-1 mb-5'>
            <h4 className='text-center py-2 m-0'>Đơn hàng #{order?.code}</h4>{' '}
            <OrderInfo key={index} order={order} />
          </div>
        );
      })
    }
    
  </>;
}

export default OrderHistoryPage;
