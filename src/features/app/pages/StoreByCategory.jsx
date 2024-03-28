import storeApi from 'api/storeApi';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StoreItem from '../components/StoreItem';
import styled from 'styled-components';

function StoreByCategory() {
  const categoryId = useParams().categoryId;
  const [stores, setStores] = React.useState([]);
  useEffect(() => {
    storeApi
      .getStoresByCategory(categoryId)
      .then((res) => {
        setStores(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
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
    </StyledLayout>
  );
}

const StyledLayout = styled.div`
  .store-item {
    width: ${(props) => (props.isDesktop === true ? '20%' : '45%')};
  }
`;

export default StoreByCategory;
