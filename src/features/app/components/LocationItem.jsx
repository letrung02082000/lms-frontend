import { PATH } from 'constants/path';
import React from 'react';
import { Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function LocationItem({ location }) {
  const navigate = useNavigate();

  const handleLocationClick = (id) => {
    navigate(PATH.APP.STORE_BY_LOCATION.replace(':locationId', id));
  };

  return (
    <div onClick={() => handleLocationClick(location?._id)}>
      <div className='w-100 mb-2'>
        <Image src={location?.images[0]} className='w-100 rounded' />
      </div>
      <h6>{location?.title}</h6>
    </div>
  );
}

export default LocationItem;
