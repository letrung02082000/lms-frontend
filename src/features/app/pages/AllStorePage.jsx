import storeApi from 'api/storeApi';
import { PATH } from 'constants/path';
import React, { useEffect } from 'react';
import { Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import StoreItem from '../components/StoreItem';
import useMediaQuery from 'hooks/useMediaQuery';

function AllStorePage() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [stores, setStores] = React.useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    storeApi
      .getStores()
      .then((res) => {
        setStores(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleStoreClick = (id) => {
    navigate(PATH.APP.STORE_DETAIL.replace(':storeId', id));
  }

  return <StyledLayout isDesktop={isDesktop}>
    <div className='d-flex flex-wrap justify-content-between w-100 mb-3'>
          {stores.map((store) => {
            return (
              <div
                key={store?._id}
                className='store-item mb-3 d-flex flex-column justify-content-between'
              >
                <StoreItem store={store} />
              </div>
            );
          })}
        </div>
  </StyledLayout>;
}

const StyledLayout = styled.div`
  .store-item {
    width: ${(props) => (props.isDesktop === true ? '22%' : '45%')};
  }
`;

export default AllStorePage;
