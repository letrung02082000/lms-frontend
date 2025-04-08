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

function ElearningStudentTestPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [initialAttemptToResume, setInitialAttemptToResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAttempts, setIsCheckingAttempts] = useState(false);
  const [error, setError] = useState(null);
  const [activeQuizName, setActiveQuizName] = useState('');
  const [courses, setCourses] = useState([]);

  const submitHandlerRef = useRef(null);
  const [isSubmittingViaButton, setIsSubmittingViaButton] = useState(false);

  const registerSubmitHandler = useCallback((handler) => {
    console.log(
      'ElearningStudentTestPage: Registering submit handler',
      handler
    );
    submitHandlerRef.current = handler;
  }, []);

  const handleFinishAttemptClick = async () => {
    if (submitHandlerRef.current && !isSubmittingViaButton) {
      console.log(
        'ElearningStudentTestPage: Calling submit handler from Navbar'
      );
      setIsSubmittingViaButton(true);
      try {
        await submitHandlerRef.current();
      } catch (e) {
        console.error('Lỗi xảy ra khi gọi submit từ Navbar:', e);
        setError('Có lỗi xảy ra khi cố gắng nộp bài.');
      } finally {
        setIsSubmittingViaButton(false);
      }
    } else {
      console.warn(
        'ElearningStudentTestPage: Submit handler not registered or already submitting.'
      );
    }
  };

  const loadInitialData = useCallback(async (courseIds) => {
    if (!courseIds.length) {
      setError('Chưa cung cấp ID Khóa học.');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setIsCheckingAttempts(false);
    setError(null);
    setQuizzes([]);
    setSelectedQuizId(null);
    setInitialAttemptToResume(null);
    setActiveQuizName('');

    let fetchedQuizzes = [];

    try {
      console.log(`Đang lấy danh sách quiz cho khóa học ID: ${courses}`);
      const response = await moodleApi.getQuizzesByCourses(courses);
      console.log('Phản hồi từ getQuizzesByCourses:', response);

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

      if (fetchedQuizzes.length > 0) {
        setIsCheckingAttempts(true); // Bắt đầu check attempts
        let foundAttempt = null;
        for (const quiz of fetchedQuizzes) {
          try {
            const attemptResponse = await moodleApi.getUserAttempts(
              quiz.id,
              'inprogress'
            );
            if (
              attemptResponse &&
              attemptResponse.attempts &&
              attemptResponse.attempts.length > 0
            ) {
              // Tìm thấy attempt đang làm dở!
              foundAttempt = attemptResponse.attempts[0]; // Lấy attempt đầu tiên (thường là mới nhất)
              console.log(
                `Tìm thấy attempt đang làm dở: Quiz ID ${quiz.id}, Attempt ID ${foundAttempt.id}`
              );
              setActiveQuizName(quiz.name); // Lưu tên quiz đang làm dở
              setSelectedQuizId(quiz.id); // Đặt quiz ID được chọn
              setInitialAttemptToResume(foundAttempt); // Đặt attempt để truyền vào QuizContainer
              break; // Thoát vòng lặp vì đã tìm thấy
            }
          } catch (attemptError) {
            // Bỏ qua lỗi khi check attempt cho 1 quiz cụ thể, tiếp tục check quiz khác
            console.warn(
              `Lỗi khi kiểm tra attempt cho Quiz ID ${quiz.id}:`,
              attemptError.message
            );
          }
        }
        if (!foundAttempt) {
          console.log('Không tìm thấy attempt nào đang làm dở.');
          // Không cần làm gì thêm, sẽ hiển thị danh sách quiz
        }
        setIsCheckingAttempts(false); // Kết thúc check attempts
      } else {
        console.log('Không có quiz nào trong khóa học để kiểm tra attempts.');
      }
    } catch (err) {
      console.error('Lỗi trong loadInitialData:', err);
      setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu ban đầu.');
    } finally {
      setIsLoading(false); // Kết thúc loading tổng thể
    }
  }, []); // Callback ổn định

  // --- useEffect để gọi loadInitialData ---
  useEffect(() => {
    // Chỉ gọi khi component mount lần đầu HOẶC khi quay lại danh sách (selectedQuizId là null và initialAttempt là null)
    if (!selectedQuizId && !initialAttemptToResume && courses.length > 0) {
      loadInitialData(courses?.map((course) => course.id)); // Truyền vào danh sách ID khóa học
    }
    // Không nên phụ thuộc vào initialAttemptToResume ở đây nếu không muốn loop vô hạn
  }, [selectedQuizId, loadInitialData]); // Chỉ gọi lại khi selectedQuizId thay đổi

  useEffect(() => {
    moodleApi
      .getMyEnrolledCourses()
      .then((data) => {
        setCourses(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // --- Hàm xử lý khi người dùng chọn một quiz từ danh sách ---
  const handleSelectQuiz = (quizId, quizName) => {
    console.log(`Người dùng đã chọn Quiz ID: ${quizId}`);
    setSelectedQuizId(quizId);
    setActiveQuizName(quizName); // Lưu tên quiz được chọn
    setInitialAttemptToResume(null); // Đảm bảo không resume attempt cũ khi chọn mới
    setError(null);
  };

  // --- Hàm xử lý khi người dùng muốn quay lại danh sách ---
  const handleGoBackToList = () => {
    setSelectedQuizId(null);
    setInitialAttemptToResume(null); // Reset cả attempt resume
    setActiveQuizName(''); // Reset tên quiz đang active
    // useEffect sẽ tự động gọi lại loadInitialData để kiểm tra lại attempt và tải danh sách
  };

  // --- Render Logic ---
  const renderContent = () => {
    // Trường hợp 1: Đang loading ban đầu (bao gồm cả check attempt)
    if (isLoading) {
      return <LoadingSpinner />;
    }

    // Trường hợp 2: Có lỗi xảy ra trong quá trình tải ban đầu
    if (error && !selectedQuizId) {
      return (
        <div className='mt-4'>
          <ErrorMessage message={error} />
          <Button
            variant='outline-primary'
            size='sm'
            onClick={() => loadInitialData(courses?.map((course) => course.id))} // Gọi lại loadInitialData với danh sách khóa học
          >
            Thử lại
          </Button>
        </div>
      );
    }

    // Trường hợp 3: Đã chọn quiz (hoặc resume) -> Hiển thị QuizContainer
    if (selectedQuizId) {
      // Nếu đang resume, hiển thị thông báo nhỏ
      const isResuming = !!initialAttemptToResume;
      return (
        <div>
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <Button
              variant='outline-secondary'
              size='sm'
              onClick={handleGoBackToList}
            >
              &laquo; Quay lại danh sách
            </Button>
            {isResuming && <Badge bg='info'>Đang tiếp tục bài làm dở</Badge>}
          </div>

          <QuizContainer
            key={
              initialAttemptToResume
                ? `attempt-${initialAttemptToResume.id}`
                : `quiz-${selectedQuizId}`
            } // Key khác nhau cho resume và start new
            quizId={selectedQuizId}
            initialAttempt={initialAttemptToResume} // Truyền attempt đang làm dở (nếu có)
            registerSubmitHandler={registerSubmitHandler} // Truyền callback để đăng ký hàm submit
          />
        </div>
      );
    }

    // Trường hợp 4: Hiển thị danh sách quiz (nếu không có attempt resume)
    if (quizzes.length > 0) {
      return (
        <div>
          <h2 className='mb-3'>Chọn bài kiểm tra</h2>
          {isCheckingAttempts && (
            <p className='text-muted'>
              <Spinner animation='grow' size='sm' /> Đang kiểm tra bài làm dở...
            </p>
          )}
          <ListGroup>
            {quizzes.map((quiz) => (
              <ListGroup.Item
                key={quiz.id}
                action
                onClick={() => handleSelectQuiz(quiz.id, quiz.name)} // Truyền cả tên quiz
                className='d-flex justify-content-between align-items-start'
              >
                <div className='ms-2 me-auto'>
                  <div className='fw-bold'>{quiz.name}</div>
                  {/* Có thể hiển thị thêm thông tin quiz. Ví dụ: Thời gian mở/đóng */}
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
                  {quiz.timelimit > 0 && (
                    <small className='d-block text-muted'>
                      Thời gian làm bài: {Math.floor(quiz.timelimit / 60)} phút
                    </small>
                  )}
                </div>
                <Button variant='primary' size='sm'>
                  Bắt đầu
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      );
    }

    // Trường hợp 5: Không lỗi, không loading, chưa chọn, danh sách rỗng
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

    // Trường hợp mặc định
    return (
      <div className='text-center mt-5'>
        <p>Đang chờ dữ liệu...</p>
        <Button
          variant='outline-primary'
          size='sm'
          onClick={() => loadInitialData(courses?.map((course) => course.id))} // Gọi lại loadInitialData với danh sách khóa học
        >
          Tải lại
        </Button>
      </div>
    );
  };

  return (
    <div className='ElearningStudentTestPage'>
      {/* Header */}
      <Navbar bg='dark' variant='dark' expand='lg' className='mb-4 shadow-sm'>
        <Container>
          <Navbar.Brand href='#'>Kiểm tra trực tuyến</Navbar.Brand>
          {/* Hiển thị tên quiz đang làm */}
          {activeQuizName && (
            <Navbar.Text className='ms-2 me-auto text-white-50 d-none d-lg-inline'>
              | {activeQuizName}
            </Navbar.Text>
          )}
          {/* Nút Kết thúc bài - chỉ hiển thị khi đang làm bài */}
          {selectedQuizId &&
            !initialAttemptToResume?.state === 'finished' && ( // Kiểm tra xem có đang làm bài không (selectedQuizId có giá trị) và attempt chưa finished
              <Button
                variant='danger'
                size='sm'
                className='ms-auto' // Đẩy sang phải
                onClick={handleFinishAttemptClick}
                disabled={isSubmittingViaButton} // Disable khi đang xử lý submit
              >
                {isSubmittingViaButton && (
                  <Spinner
                    as='span'
                    animation='border'
                    size='sm'
                    role='status'
                    aria-hidden='true'
                    className='me-1'
                  />
                )}
                Kết thúc bài
              </Button>
            )}
        </Container>
      </Navbar>

      {/* Nội dung chính */}
      <Container>{renderContent()}</Container>
    </div>
  );
}

export default ElearningStudentTestPage;
