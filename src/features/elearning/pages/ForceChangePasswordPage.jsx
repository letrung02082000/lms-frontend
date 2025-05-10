import elearningApi from 'api/elearningApi';
import React, { useState } from 'react';
import {
  Form,
  Button,
  Alert,
  Spinner,
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import moodleApi from 'services/moodleApi';

function ForceChangePasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const userId = JSON.parse(localStorage.getItem('moodleSiteInfo') || '{}')?.userid || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ các trường.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }

    const token = localStorage.getItem('moodleToken');
    if (!token) {
      setError('Token không tồn tại. Vui lòng đăng nhập lại.');
      return;
    }

    try {
      setLoading(true);

      const response = await elearningApi.changeUserPasswordByMoodleToken(
        token,
        newPassword
      );
      localStorage.setItem('forcePasswordChange', '0');
      setSuccess('Đổi mật khẩu thành công! Bạn sẽ được chuyển hướng...');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err) {
      console.error('Lỗi đổi mật khẩu:', err);
      setError(err.message || 'Đã có lỗi xảy ra khi đổi mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className='mt-5'>
      <Row className='justify-content-md-center'>
        <Col md={6}>
          <h3>Đổi mật khẩu lần đầu</h3>

          {error && <Alert variant='danger'>{error}</Alert>}
          {success && <Alert variant='success'>{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-3' controlId='newPassword'>
              <Form.Label>Mật khẩu mới</Form.Label>
              <Form.Control
                type='password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className='mb-3' controlId='confirmPassword'>
              <Form.Label>Nhập lại mật khẩu mới</Form.Label>
              <Form.Control
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                isInvalid={confirmPassword && confirmPassword !== newPassword}
              />
              <Form.Control.Feedback type='invalid'>
                Mật khẩu không khớp.
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant='primary' type='submit' disabled={loading}>
              {loading ? (
                <Spinner size='sm' animation='border' />
              ) : (
                'Cập nhật mật khẩu'
              )}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default ForceChangePasswordPage;
