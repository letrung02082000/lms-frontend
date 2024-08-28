import productApi from 'api/productApi';
import storeApi from 'api/storeApi';
import React, { useEffect } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import ProductItem from '../components/my-store/ProductItem';
import categoryApi from 'api/store/categoryApi';
import CategoryItem from '../components/my-store/CategoryItem';

function MyStorePage() {
  const storeId = JSON.parse(localStorage.getItem('user-info'))?.store;
  const [products, setProducts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);

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
    productApi
      .getMyProducts(storeId)
      .then((res) => {
        setProducts(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });

      categoryApi
      .getMyCategories(storeId)
      .then((res) => {
        setCategories(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [storeId]);

  return (
    <div style={{ marginBottom: '100px' }}>
      <Tabs
        variant='tabs'
        defaultActiveKey='product'
        id='uncontrolled-tab-example'
        className='mb-3'
      >
        <Tab eventKey='product' title='Sản phẩm'>
          {products?.map((product) => {
            return <ProductItem key={product?._id} product={product} />;
          })}
        </Tab>
        <Tab eventKey='category' title='Danh mục'>
          {categories?.map((category) => {
            return <CategoryItem key={category?._id} category={category} />;
          })}
        </Tab>
      </Tabs>
    </div>
  );
}

export default MyStorePage;
