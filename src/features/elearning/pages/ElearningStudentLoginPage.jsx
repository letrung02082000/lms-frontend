// src/components/ElearningStudentLoginPage.jsx
import React, { useState, useCallback, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import moodleApi from 'services/moodleApi'; // Import moodleApi chứa hàm getToken
import { useNavigate } from 'react-router-dom';
import { PATH } from 'constants/path';
import drivingApi from 'api/drivingApi';
import { Image } from 'react-bootstrap';

function ElearningStudentLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const hostname = window.location.hostname;
  const subdomain = hostname.split('.')[0];
  const [center, setCenter] = useState(null);

  useEffect(() => {
    if (subdomain) {
      drivingApi
        .queryDrivingCenters({
          filter: { shortName: subdomain },
          page: 1,
        })
        .then((response) => {
          setCenter(response?.data?.[0] || null);
          localStorage.setItem('center', JSON.stringify(response?.data?.[0]));
        })
        .catch((error) => {
          console.error('Lỗi khi lấy thông tin trung tâm:', error);
        });
    }
  }, [subdomain]);

  const onLoginSuccess = useCallback((token) => {
    localStorage.setItem('moodleToken', token);
    moodleApi
      .getSiteInfo(token)
      .then((data) => {
        delete data.userprivateaccesskey;
        delete data.functions;
        localStorage.setItem('moodleSiteInfo', JSON.stringify(data)); // Lưu thông tin trang Moodle vào localStorage
        console.log('Thông tin trang Moodle:', data);
        moodleApi
          .getUserInfoById(data?.userid)
          .then((userInfo) => {
            console.log('Thông tin người dùng:', userInfo);
            const forcePasswordChange = userInfo.preferences.find(
              (p) => p.name === 'auth_forcepasswordchange'
            )?.value;
            localStorage.setItem('forcePasswordChange', forcePasswordChange);

            if (forcePasswordChange === '1') {
              navigate(PATH.ELEARNING.CHANGE_PASSWORD);
            } else {
              window.location.href = PATH.ELEARNING.STUDENT.ROOT;
            }
          })
          .catch((error) => {
            console.error('Lỗi khi lấy thông tin người dùng:', error);
          });
      })
      .catch((error) => {
        console.error('Lỗi khi lấy thông tin trang Moodle:', error);
      });
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setError(null);
      setIsLoading(true);

      try {
        // Gọi hàm getToken từ moodleApi.js
        const token = await moodleApi.getToken(username, password);

        // Gọi callback onLoginSuccess với token nhận được
        if (onLoginSuccess && token) {
          console.log(
            'ElearningStudentLoginPage: Gọi onLoginSuccess với token.'
          );
          onLoginSuccess(token); // Chỉ truyền token lên component cha
        } else {
          // Trường hợp lạ: API thành công nhưng không có token?
          throw new Error('Lấy token thành công nhưng không nhận được token.');
        }
      } catch (err) {
        console.error('Lỗi đăng nhập:', err);
        setError(err.message || 'Đã xảy ra lỗi trong quá trình đăng nhập.');
      } finally {
        setIsLoading(false);
      }
    },
    [username, password, onLoginSuccess]
  );

  const navigate = useNavigate();

  return (
    <Container className='mt-5'>
      {center && (
        <div className='text-center mb-4'>
          <Image
            src={center.logo}
            alt='Logo'
            className='mb-2'
            width={110}
            height={110}
            style={{ objectFit: 'contain' }}
          />
          <h6>{center.name}</h6>
        </div>
      )}
      <Row className='justify-content-center'>
        <Col md={8} lg={6} xl={5}>
          <Card className='shadow-sm'>
            <Card.Body className='p-4'>
              <Form onSubmit={handleSubmit}>
                {error && (
                  <Alert
                    variant='danger'
                    onClose={() => setError(null)}
                    dismissible
                  >
                    {error}
                  </Alert>
                )}
                <Form.Group className='mb-3' controlId='loginUsername'>
                  <Form.Label>Tên đăng nhập</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Nhập tên đăng nhập'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </Form.Group>
                <Form.Group className='mb-3' controlId='loginPassword'>
                  <Form.Label>Mật khẩu</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Nhập mật khẩu'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </Form.Group>
                <div className='d-grid'>
                  <Button variant='primary' type='submit' disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Spinner
                          as='span'
                          animation='border'
                          size='sm'
                          role='status'
                          aria-hidden='true'
                          className='me-1'
                        />
                        Đang xử lý...
                      </>
                    ) : (
                      'Đăng nhập'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ElearningStudentLoginPage;
