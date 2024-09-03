import { PATH } from 'constants/path';
import Maintained from 'features/maintainance/Maintained';
import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function MyStoreSettingPage() {
  const navigate = useNavigate();
  return <Container>
    <Button onClick={() => navigate(PATH.APP.ROOT)}>Về trang chủ</Button>
  </Container>
}

export default MyStoreSettingPage;
