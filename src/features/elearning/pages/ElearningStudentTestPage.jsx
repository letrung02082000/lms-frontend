import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import moodleApi from 'services/moodleApi';
import { PATH } from 'constants/path';
import { MdQuiz } from 'react-icons/md';
import TimeExceedWarning from '../components/TimeExceedWarning';
import { useSelector } from 'react-redux';
import { selectElearningData } from 'store/elearning.slice';

function ElearningStudentTestPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAttempts, setIsCheckingAttempts] = useState(false);
  const [error, setError] = useState(null);
  const elearningData = useSelector(selectElearningData);
  const { elearningCourses, isLimitExceeded, timeLimitPerDay, totalTodayTime } =
    elearningData;
  const courses = useMemo(() => {
    return Object?.values(elearningCourses).filter((course) => course?.visible);
  }, [elearningCourses]);

  const loadInitialData = useCallback(async (courseIds) => {
    if (!courseIds.length) {
      setError('Bạn chưa tham gia khoá học nào.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setQuizzes([]);

    try {
      const fetchedQuizzes = await moodleApi.getQuizzesByCourses(courseIds);

      if (fetchedQuizzes) {
        setQuizzes(fetchedQuizzes.filter((quiz) => quiz.timelimit > 0));
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

  if (isLimitExceeded) {
    return (
      <TimeExceedWarning
        timeLimitPerDay={timeLimitPerDay}
        totalTodayTime={totalTodayTime}
      />
    );
  }

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
                    Số câu hỏi: {quiz?.sumgrades || ''}
                  </small>
                  <small className='d-block text-muted'>
                    Điểm đạt: {quiz?.gradepass}/{quiz.grade}
                  </small>
                  {quiz.timeopen > 0 && (
                    <small className='d-block text-muted'>
                      Mở lúc: {new Date(quiz?.timeopen * 1000).toLocaleString()}
                    </small>
                  )}
                  {quiz.timeclose > 0 && (
                    <small className='d-block text-muted'>
                      Đóng lúc:{' '}
                      {new Date(quiz?.timeclose * 1000).toLocaleString()}
                    </small>
                  )}
                  {quiz?.timelimit > 0 ? (
                    <small className='d-block text-muted'>
                      Thời gian làm bài:{' '}
                      <strong>{Math.floor(quiz.timelimit / 60)} phút</strong>
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
                  <MdQuiz className='me-1' />
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
          Không tìm thấy bài kiểm tra nào trong khóa học này (ID: {courses}) mà
          bạn có quyền truy cập, hoặc đang chờ kiểm tra bài làm dở.
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
    <div style={{ height: '100vh', overflowY: 'scroll', padding: '20px' }}>
      <Container>
        <h2 className='mb-4 h2'>Chọn bài kiểm tra</h2>
        {renderContent()}
      </Container>
    </div>
  );
}

export default ElearningStudentTestPage;
