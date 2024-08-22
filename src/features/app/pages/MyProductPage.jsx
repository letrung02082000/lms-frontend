import React, { useState } from 'react'
import { Tab, Tabs } from 'react-bootstrap';

function MyProductPage() {
  return <>
    <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="mb-3">
      <Tab eventKey="home" title="Sản phẩm">
        Sản phẩm
      </Tab>
      <Tab eventKey="profile" title="Danh mục">
        Danh mục
      </Tab>
    </Tabs>
  </>;
}

export default MyProductPage;