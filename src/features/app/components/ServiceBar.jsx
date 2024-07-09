import React, { useEffect, useMemo } from 'react';
import { Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PATH } from 'constants/path';
import DrivingIcon from 'assets/icons/motorbike.png';
import UniformIcon from 'assets/icons/uniform.png';
import PhotocopyIcon from 'assets/icons/photocopy.png';
import RealEstateIcon from 'assets/icons/real-estate.png';
import theme from 'constants/theme';

function ServiceBar() {
  const navigate = useNavigate();
  const services = useMemo(
    () => [
      {
        _id: '1',
        name: 'Sát hạch',
        icon: DrivingIcon,
        path: PATH.DRIVING.ROOT
      },
      {
        _id: '2',
        name: 'Đồng phục',
        icon: UniformIcon,
        path: PATH.UNIFORM.ROOT
      },
      {
        _id: '2',
        name: 'In ấn',
        icon: PhotocopyIcon,
        path: PATH.PHOTOCOPY.ROOT
      },
      {
        _id: '2',
        name: 'Căn hộ',
        icon: RealEstateIcon,
        path: PATH.REAL_ESTATE.ROOT
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <div className='d-flex w-100 flex-wrap justify-content-start'>
        {services.map((service) => {
          return (
            <div
              onClick={() => navigate(service.path)}
              key={service._id}
              className='bg-white rounded m-1'
              style={{ width: '22%' }}
            >
              <div>
                <div
                  style={{
                    backgroundColor: theme.colors.teal,
                    borderRadius: '15%',
                  }}
                >
                  {service?.icon && <Image className='p-3 w-100' src={service?.icon} />}
                </div>
              </div>
              <h6
                style={{
                  fontSize: '0.9rem',
                }}
                className='text-center mt-1'
              >
                {service?.name}
              </h6>
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
}

export default ServiceBar;
