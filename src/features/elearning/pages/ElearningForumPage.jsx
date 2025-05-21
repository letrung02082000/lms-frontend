import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  Container,
  Row,
  Col,
  Spinner,
  Pagination,
  Button,
  Modal,
  Form,
  InputGroup,
} from 'react-bootstrap';
import moodleApi from 'services/moodleApi';
import BackButton from 'components/BackButton';

function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function ElearningForumPage() {
  const forumId = Number(useParams().id);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  console.log(discussions);
  const [showModal, setShowModal] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');

  const handleClose = () => {
    setShowModal(false);
    setNewSubject('');
    setNewMessage('');
  };

  const handleSubmit = async () => {
    try {
      // Gọi API tạo thảo luận mới nếu cần
      console.log('Tạo thảo luận:', newSubject, newMessage);
      handleClose();
    } catch (error) {
      console.error('Lỗi khi tạo thảo luận:', error);
    }
  };

  const handleOpenReplies = async (discussion) => {
    setSelectedDiscussion(discussion);
    try {
      const data = await moodleApi.getDiscussionPosts(discussion.discussion);
      setReplies(data);
    } catch (error) {
      console.error('Lỗi khi lấy phản hồi:', error);
      setReplies([]);
    }
  };

  const handleAddReply = async () => {
    if (!replyMessage.trim()) return;

    try {
      const postId = selectedDiscussion?.id; // ID của bài post gốc
      const subject = 'Re: ' + selectedDiscussion.subject;
      const message = replyMessage;

      await moodleApi.addDiscussionReply({
        postId: postId,
        subject: subject,
        message: message,
      });

      // Làm mới danh sách phản hồi sau khi gửi thành công
      const data = await moodleApi.getDiscussionPosts(
        selectedDiscussion.discussion
      );
      setReplies(data);

      setReplyMessage('');
    } catch (error) {
      console.error('Lỗi khi gửi phản hồi:', error);
      alert('Không thể gửi phản hồi. Vui lòng thử lại.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await moodleApi.getForumDiscussions(forumId);
        setDiscussions(data);
      } catch (err) {
        console.error('Không thể lấy danh sách thảo luận:', err);
      } finally {
        setLoading(false);
      }
    };

    if (forumId) fetchData();
  }, [forumId]);

  useEffect(() => {
    const fetchReplyContent = async () => {
      if (selectedDiscussion) {
        try {
          const data = await moodleApi.getDiscussionPost(6);
          console.log('Phản hồi:', data);
        } catch (err) {
          console.error('Không thể lấy danh sách phản hồi:', err);
        }
      }
    };

    fetchReplyContent();
  }, [replies]);

  const paginatedDiscussions = discussions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(discussions.length / itemsPerPage);

  return (
    <div style={{ height: '100vh', overflowY: 'scroll', padding: '20px' }}>
      <Container>
        <BackButton />
        <Row>
          {selectedDiscussion && (
            <Col lg={8} className='border pt-3' style={{ height: '91vh' }}>
              <div className='mb-3'>
                <strong>{selectedDiscussion.subject}</strong>
                <div
                  dangerouslySetInnerHTML={{
                    __html: selectedDiscussion.message,
                  }}
                  style={{ fontSize: '0.9rem' }}
                />
              </div>
              <div
                style={{
                  overflowY: 'scroll',
                  height: '81%',
                }}
              >
                {[...replies].reverse().map((reply) => (
                  <div key={reply.id} className='mb-3'>
                    <div className='d-flex'>
                      <img
                        src={reply?.author?.urls?.profileimage}
                        className='rounded-circle me-2'
                        alt='avatar'
                        width={40}
                        height={40}
                      />
                      <div>
                        <div style={{ fontWeight: 'bold' }}>
                          {reply?.author?.fullname}
                        </div>
                        <div
                          className='text-muted'
                          style={{ fontSize: '0.8rem' }}
                        >
                          {formatDate(reply.timecreated)}
                        </div>
                        <div
                          style={{ fontSize: '0.9rem' }}
                          dangerouslySetInnerHTML={{
                            __html: reply.message,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <InputGroup className='mb-3'>
                <Form.Control
                  placeholder='Nhập phản hồi...'
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                />
                <Button onClick={handleAddReply} variant='primary'>
                  Gửi
                </Button>
              </InputGroup>
            </Col>
          )}
          <Col lg={selectedDiscussion ? 4 : 12}>
            <h2 className='mb-4 h2'>Danh sách chủ đề</h2>
            {loading ? (
              <div className='text-center'>
                <Spinner animation='border' />
              </div>
            ) : discussions.length === 0 ? (
              <p>Không có chủ đề thảo luận nào.</p>
            ) : (
              paginatedDiscussions.map((discussion) => (
                <Card className='mb-3 shadow-sm' key={discussion.id}>
                  <Card.Body>
                    <Row>
                      <Col xs={2} md={1}>
                        <img
                          src={discussion.userpictureurl}
                          alt={discussion.userfullname}
                          className='img-fluid rounded-circle'
                          style={{ width: '50px' }}
                        />
                      </Col>
                      <Col xs={10} md={11}>
                        <h5>{discussion.subject}</h5>
                        <div
                          className='text-muted mb-2'
                          style={{ fontSize: '0.9rem' }}
                        >
                          {discussion.userfullname} -{' '}
                          {formatDate(discussion.created)}
                        </div>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: discussion.message,
                          }}
                        />
                        <div className='mt-2 d-flex justify-content-between'>
                          <span
                            className='text-secondary'
                            style={{ fontSize: '0.85rem' }}
                          >
                            {discussion.numreplies} phản hồi
                          </span>
                          <Button
                            variant='outline-primary'
                            size='sm'
                            onClick={() => selectedDiscussion ? setSelectedDiscussion(null) : handleOpenReplies(discussion)}
                          >
                            {selectedDiscussion ? 'Đóng' : 'Xem phản hồi'}
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))
            )}

            {totalPages > 1 && (
              <Pagination className='justify-content-center mt-4'>
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={currentPage === index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            )}
          </Col>
        </Row>

        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>📝 Thảo luận mới</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className='mb-3' controlId='formSubject'>
                <Form.Label>Tiêu đề</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Nhập tiêu đề'
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                />
              </Form.Group>
              <Form.Group className='mb-3' controlId='formMessage'>
                <Form.Label>Nội dung</Form.Label>
                <Form.Control
                  as='textarea'
                  rows={4}
                  placeholder='Nhập nội dung'
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleClose}>
              Hủy
            </Button>
            <Button variant='primary' onClick={handleSubmit}>
              Tạo
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default ElearningForumPage;
