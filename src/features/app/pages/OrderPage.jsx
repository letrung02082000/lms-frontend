import React from 'react';
import { useParams } from 'react-router-dom';

function OrderPage() {
  const orderId = useParams().orderId;
  console.log('orderId', orderId);
  return <div>OrderPage</div>;
}

export default OrderPage;
