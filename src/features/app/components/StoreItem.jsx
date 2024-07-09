import { PATH } from 'constants/path';
import React from 'react';
import { Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function StoreItem({ store }) {
  const navigate = useNavigate();

  const handleStoreClick = (id) => {
    navigate(PATH.APP.STORE_DETAIL.replace(':storeId', id));
  };

  return (
    <div onClick={() => handleStoreClick(store?._id)}>
      <div className='w-100 mb-2'>
        <Image src={store?.images[0]} className='w-100 rounded' />
      </div>
      <h6
        style={{
          fontSize: '0.9rem',
        }}
      >{store?.name}</h6>
    </div>
  );
}

export default StoreItem;
