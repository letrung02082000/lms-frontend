// src/components/ElearningStudentLoginPage.jsx
import React, { useState, useCallback } from 'react';
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

function ElearningStudentLoginPage() {
  // onLoginSuccess sẽ nhận token
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const onLoginSuccess = useCallback((token) => {
    localStorage.setItem('moodleToken', token);

    moodleApi
      .getSiteInfo(token)
      .then((data) => {
        delete data.userprivateaccesskey;
        delete data.functions;
        localStorage.setItem('moodleSiteInfo', JSON.stringify(data)); // Lưu thông tin trang Moodle vào localStorage
        console.log('Thông tin trang Moodle:', data);
      })
      .catch((error) => {
        console.error('Lỗi khi lấy thông tin trang Moodle:', error);
      });
    navigate(PATH.ELEARNING.STUDENT.ROOT); // Chuyển hướng đến trang Moodle
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

  // --- Phần JSX giữ nguyên như trước ---
  return (
    <Container className='mt-5'>
      <Row className='justify-content-center'>
        <Col md={8} lg={6} xl={5}>
          <Card className='shadow-sm'>
            <Card.Body className='p-4'>
              <h2 className='text-center mb-4'>Đăng nhập Học viên</h2>
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
                    placeholder='Nhập tên đăng nhập Moodle'
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
