import productApi from 'api/productApi';
import storeApi from 'api/storeApi';
import React, { useEffect } from 'react';
import { Tab, Tabs } from 'react-bootstrap';

function MyStorePage() {
  const storeId = JSON.parse(localStorage.getItem('user-info'))?.store;
  const [products, setProducts] = React.useState([]);
  console.log(products);
  useEffect(() => {
    if (!storeId) {
      // Redirect to store creation page
    }

    // storeApi
    //   .getStoreById(storeId)
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    productApi.getProductsByStoreId(storeId).then((res) => {
      setProducts(res?.data);
    }).catch((err) => {
      console.log(err);
    });

  }, [storeId]);

  return (
    <>
      <Tabs
        variant='tabs'
        defaultActiveKey='product'
        id='uncontrolled-tab-example'
        className='mb-3'
      >
        <Tab eventKey='product' title='Sản phẩm'>
          Sản phẩm
        </Tab>
        <Tab eventKey='category' title='Danh mục'>
          Danh mục
        </Tab>
      </Tabs>
    </>
  );
}

export default MyStorePage;
