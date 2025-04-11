import React, { useState, useEffect, useCallback, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import QuizContainer from '../components/QuizContainer';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import moodleApi from 'services/moodleApi';
import { Badge } from 'react-bootstrap';
import { PATH } from 'constants/path';

function ElearningStudentTestPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAttempts, setIsCheckingAttempts] = useState(false);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);

  const loadInitialData = useCallback(async (courseIds) => {
    if (!courseIds.length) {
      setError('Bạn chưa tham gia khoá học nào.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setQuizzes([]);
    let fetchedQuizzes = [];

    try {
      const response = await moodleApi.getQuizzesByCourses(courseIds);

      if (response && response.quizzes) {
        fetchedQuizzes = response.quizzes;
        setQuizzes(fetchedQuizzes);
      } else if (response && (response.errorcode || response.exception)) {
        throw new Error(
          response.message ||
            response.errorcode ||
            'Lỗi API khi lấy danh sách quiz.'
        );
      } else {
        throw new Error('Không thể lấy danh sách quiz. Phản hồi không hợp lệ.');
      }
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu ban đầu.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData(courses?.map((course) => course.id));
  }, [courses]);

  useEffect(() => {
    setIsLoading(true);
    moodleApi
      .getMyEnrolledCourses()
      .then((data) => {
        setCourses(data);
      })
      .catch((err) => {
        console.log(err);
      }).finally(() => {
        setIsLoading(false);
      });
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error && !isLoading) {
      return (
        <div className='mt-4'>
          <ErrorMessage message={error} />
          <Button
            variant='outline-primary'
            size='sm'
            onClick={() => loadInitialData(courses?.map((course) => course.id))}
          >
            Thử lại
          </Button>
        </div>
      );
    }

    if (quizzes.length > 0) {
      return (
        <div>
          <h2 className='mb-3 mt-4'>Chọn bài kiểm tra</h2>
          <ListGroup>
            {quizzes.map((quiz) => (
              <ListGroup.Item
                key={quiz.id}
                action
                className='d-flex justify-content-between align-items-start'
              >
                <div className='ms-2 me-auto'>
                  <div className='fw-bold'>{quiz.name}</div>
                  <small className='d-block text-muted'>
                    {quiz.sumgrades} câu hỏi
                  </small>
                  {quiz.timeopen > 0 && (
                    <small className='d-block text-muted'>
                      Mở lúc: {new Date(quiz.timeopen * 1000).toLocaleString()}
                    </small>
                  )}
                  {quiz.timeclose > 0 && (
                    <small className='d-block text-muted'>
                      Đóng lúc:{' '}
                      {new Date(quiz.timeclose * 1000).toLocaleString()}
                    </small>
                  )}
                  {quiz.timelimit > 0 ? (
                    <small className='d-block text-muted'>
                      Thời gian làm bài: {Math.floor(quiz.timelimit / 60)} phút
                    </small>
                  ) : (
                    <small className='d-block text-muted'>
                      Không giới hạn thời gian
                    </small>
                  )}
                </div>
                <Button
                  variant='outline-primary'
                  size='sm'
                  href={`${PATH.ELEARNING.STUDENT.TEST_DETAIL.replace(
                    ':id',
                    quiz.id
                  )}?c=${quiz.course}&m=${quiz.coursemodule}`}
                  target='_blank'
                >
                  Thực hiện
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      );
    }

    if (!isLoading && !error && quizzes.length === 0) {
      return (
        <Alert variant='info' className='mt-4'>
          Không tìm thấy bài kiểm tra nào trong khóa học này (ID:{' '}
          {courses}) mà bạn có quyền truy cập, hoặc đang chờ kiểm tra
          bài làm dở.
          {isCheckingAttempts && <LoadingSpinner size='sm' />}
        </Alert>
      );
    }

    return (
      <div className='text-center mt-5'>
        <p>Đang chờ dữ liệu...</p>
        <Button
          variant='outline-primary'
          size='sm'
          onClick={() => loadInitialData(courses?.map((course) => course.id))}
        >
          Tải lại
        </Button>
      </div>
    );
  };

  return (
    <div style={{ height: '100vh', overflowY: 'scroll' }}>
      <Container>{renderContent()}</Container>
    </div>
  );
}

export default ElearningStudentTestPage;
