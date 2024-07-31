import storeApi from 'api/storeApi';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StoreItem from '../components/StoreItem';
import styled from 'styled-components';
import Loading from 'components/Loading';

function StoreByLocation() {
  const locationId = useParams().locationId;
  const [loading, setLoading] = React.useState(true);
  const [stores, setStores] = React.useState([]);
  useEffect(() => {
    storeApi
      .getStoresByLocation(locationId)
      .then((res) => {
        setStores(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
    {loading && <Loading />}
      <StyledLayout className='d-flex w-100 flex-wrap justify-content-between'>
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
      {stores.length === 0 && (
        <p className='text-center w-100'>Không có cửa hàng nào</p>
      )}
    </StyledLayout>
    </>
  );
}

const StyledLayout = styled.div`
  .store-item {
    width: ${(props) => (props.isDesktop === true ? '20%' : '45%')};
  }
`;

export default StoreByLocation;
