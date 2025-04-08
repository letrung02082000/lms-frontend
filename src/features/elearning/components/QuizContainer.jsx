// src/components/QuizContainer.jsx
import React, {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react'; // Thêm forwardRef, useImperativeHandle nếu dùng ref
// ... (các imports khác giữ nguyên) ...
import * as moodleApi from 'services/moodleApi'; // Đảm bảo đường dẫn đúng
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import QuizTimer from './QuizTimer';
import QuestionCard from './QuestionCard';
import Navigation from './Navigation';
import ResultsPage from './ResultsPage';

// Sử dụng forwardRef nếu muốn dùng ref để gọi submit từ cha (cách 1)
// Hoặc nhận callback registerSubmitHandler (cách 2 - sử dụng trong ví dụ này)
const QuizContainer = ({
  quizId,
  initialAttempt = null,
  registerSubmitHandler = null,
}) => {
  // initialAttempt là object attempt từ getUserAttempts nếu có
  const [attempt, setAttempt] = useState(initialAttempt); // Khởi tạo với attempt có sẵn nếu có
  // ... (các state khác giữ nguyên: questions, currentQuestionIndex, etc.) ...
  const [isLoading, setIsLoading] = useState(!initialAttempt); // Chỉ loading ban đầu nếu không có attempt sẵn
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [reviewData, setReviewData] = useState(null);
  const [quizTimeLimit, setQuizTimeLimit] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [totalQuestionsInQuiz, setTotalQuestionsInQuiz] = useState(
    initialAttempt?.questioncount || 0
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]); // Giữ nguyên state questions


  // --- Hàm fetch dữ liệu attempt (tách ra để tái sử dụng) ---
  const fetchAttemptData = useCallback(
    async (attemptIdToLoad, page = 0) => {
      // Không set isLoading ở đây nếu chỉ là chuyển trang
      if (page === 0) setIsLoading(true); // Chỉ loading khi tải trang đầu tiên
      setError(null);
      try {
        const data = await moodleApi.getAttemptData(attemptIdToLoad, page);
        if (data && data.questions) {
          setQuestions(data.questions);
          // Chỉ cập nhật attempt state nếu chưa có hoặc lấy từ trang đầu
          if (!attempt || page === 0) {
            setAttempt(data.attempt);
            setTotalQuestionsInQuiz(
              data.attempt?.questioncount || data.questions.length
            );
          }
          setCurrentPage(page);
          setCurrentQuestionIndex(0);
          setIsLastPage(data.nextpage === -1);

          // Cập nhật timer chỉ khi tải trang đầu
          if (page === 0 && data.attempt?.timelimit) {
            const startTime = data.attempt.timestart * 1000;
            const timeLimit = data.attempt.timelimit * 1000;
            const now = Date.now();
            const endTime = startTime + timeLimit;
            const remainingSeconds = Math.max(
              0,
              Math.floor((endTime - now) / 1000)
            );
            setQuizTimeLimit(
              remainingSeconds > 0 ? remainingSeconds : data.attempt.timelimit
            );
          } else if (page === 0) {
            setQuizTimeLimit(0);
          }
        } else {
          setError('Không thể tải dữ liệu câu hỏi.');
          setQuestions([]);
        }
      } catch (err) {
        setError(err.message || 'Lỗi khi tải dữ liệu lượt làm bài.');
        console.error(err);
        setQuestions([]);
      } finally {
        if (page === 0) setIsLoading(false); // Chỉ hết loading khi tải trang đầu xong
      }
    },
    [attempt]
  ); // Phụ thuộc vào attempt để lấy questioncount

  // --- useEffect để tải dữ liệu ban đầu ---
  useEffect(() => {
    setError(null); // Reset lỗi khi quizId/initialAttempt thay đổi
    if (initialAttempt && initialAttempt.id) {
      console.log('QuizContainer: Resuming attempt ID:', initialAttempt.id);
      // Nếu có attempt ID sẵn, fetch dữ liệu cho nó
      setAttempt(initialAttempt); // Đảm bảo state attempt được set
      fetchAttemptData(initialAttempt.id, 0);
    } else if (quizId) {
      console.log('QuizContainer: Starting new attempt for quiz ID:', quizId);
      setIsLoading(true);
      // Nếu không, bắt đầu attempt mới
      moodleApi
        .startQuizAttempt(quizId)
        .then((startData) => {
          if (startData && startData.attempt) {
            setAttempt(startData.attempt); // Lưu attempt mới
            // Fetch data cho attempt mới này
            return fetchAttemptData(startData.attempt.id, 0);
          } else if (
            startData &&
            (startData.errorcode || startData.exception)
          ) {
            throw new Error(
              startData.message ||
                startData.errorcode ||
                'Lỗi API khi bắt đầu attempt'
            );
          } else {
            throw new Error('Không thể bắt đầu lượt làm bài mới.');
          }
        })
        .catch((err) => {
          setError(err.message || 'Lỗi khi bắt đầu hoặc tải lượt làm bài.');
          console.error(err);
          setIsLoading(false); // Dừng loading nếu lỗi
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId, initialAttempt]); // Chỉ chạy khi quizId hoặc initialAttempt thay đổi (initialAttempt chỉ thay đổi 1 lần từ prop)

  // --- Các hàm xử lý khác (handleAnswerChange, formatAnswersForSubmit, handleSaveAttempt, handlePrevious, handleNext, handleTimeUp) ---
  // Giữ nguyên logic của các hàm này, nhưng đảm bảo chúng ổn định nếu cần
  const handleAnswerChange = useCallback(
    (questionId, slot, answerPayloadArray) => {
      setUserAnswers((prev) => ({
        ...prev,
        [`q${questionId}:${slot}`]: answerPayloadArray,
      }));
    },
    []
  );

  const formatAnswersForSubmit = useCallback(() => {
    return Object.values(userAnswers).flat();
  }, [userAnswers]);

  const handleSaveAttempt = useCallback(async () => {
    if (!attempt?.id) return; // Cần có attempt id
    console.log('Đang lưu tạm...');
    // Có thể thêm state loading riêng cho save
    try {
      const formattedAnswers = formatAnswersForSubmit();
      await moodleApi.saveAttemptData(attempt.id, formattedAnswers);
      console.log('Lưu tạm thành công.');
    } catch (err) {
      console.error('Lỗi khi lưu tạm:', err);
      // Không nên set lỗi chính ở đây
    }
  }, [attempt, formatAnswersForSubmit]);

  const handlePrevious = useCallback(() => {
    if (!attempt?.id) return;
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else if (currentPage > 0) {
      handleSaveAttempt().then(() => {
        fetchAttemptData(attempt.id, currentPage - 1);
      });
    }
  }, [
    currentQuestionIndex,
    currentPage,
    attempt,
    fetchAttemptData,
    handleSaveAttempt,
  ]);

  const handleNext = useCallback(() => {
    if (!attempt?.id) return;
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (!isLastPage) {
      handleSaveAttempt().then(() => {
        fetchAttemptData(attempt.id, currentPage + 1);
      });
    }
  }, [
    currentQuestionIndex,
    questions.length,
    isLastPage,
    attempt,
    currentPage,
    fetchAttemptData,
    handleSaveAttempt,
  ]);

  // --- Hàm Nộp bài (handleSubmit) ---
  // Bọc trong useCallback để ổn định và đăng ký với component cha
  const handleSubmit = useCallback(async () => {
    if (!attempt?.id || isSubmitting) return; // Kiểm tra cả isSubmitting
    setIsSubmitting(true);
    setError(null);
    try {
      await handleSaveAttempt(); // Lưu lần cuối
      const formattedAnswers = formatAnswersForSubmit();
      console.log('Đang nộp bài attempt ID:', attempt.id);
      const result = await moodleApi.processAttempt(
        attempt.id,
        formattedAnswers,
        true
      ); // finishAttempt = true

      if (result.state === 'finished') {
        console.log('Nộp bài thành công, đang lấy kết quả...');
        const review = await moodleApi.getAttemptReview(attempt.id);
        setReviewData(review);
        // Không reset attempt state hoàn toàn ở đây, vì ResultsPage có thể cần thông tin từ nó
        // setAttempt(prev => ({...prev, state: 'finished'})); // Cập nhật trạng thái
        setQuestions([]); // Xóa câu hỏi đi
        console.log('Đã lấy kết quả:', review);
      } else {
        const errorMsg =
          result.warnings?.map((w) => w.message).join(', ') ||
          'Không thể hoàn thành việc nộp bài.';
        setError(errorMsg);
        console.warn('Cảnh báo khi nộp bài:', result.warnings);
      }
    } catch (err) {
      setError(err.message || 'Lỗi nghiêm trọng khi nộp bài.');
      console.error('Lỗi handleSubmit:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [attempt, isSubmitting, handleSaveAttempt, formatAnswersForSubmit]); // Phụ thuộc vào các hàm và state cần thiết

  const handleTimeUp = useCallback(() => {
    console.log('Hết giờ!');
    if (attempt && !isSubmitting) {
      alert('Đã hết thời gian làm bài! Bài của bạn sẽ được nộp tự động.');
      handleSubmit(); // Gọi handleSubmit đã được useCallback
    }
  }, [attempt, isSubmitting, handleSubmit]);

  // --- Đăng ký hàm handleSubmit với component cha ---
  useEffect(() => {
    if (registerSubmitHandler) {
      console.log('QuizContainer: Registering submit handler');
      registerSubmitHandler(handleSubmit); // Đăng ký hàm submit (đã useCallback)
    }
    // Cleanup: Hủy đăng ký khi component unmount hoặc hàm thay đổi
    return () => {
      if (registerSubmitHandler) {
        console.log('QuizContainer: Unregistering submit handler');
        registerSubmitHandler(null);
      }
    };
  }, [registerSubmitHandler, handleSubmit]); // Phụ thuộc vào callback từ prop và hàm submit nội bộ

  // --- Render Logic ---
  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (error && !reviewData) {
    // Chỉ hiển thị lỗi nếu chưa có kết quả review
    return <ErrorMessage message={error} />;
  }
  if (reviewData) {
    // Truyền attempt vào ResultsPage nếu cần thêm thông tin
    return <ResultsPage reviewData={reviewData} />;
  }
  if (attempt && questions.length > 0) {
    const currentQuestionData = questions[currentQuestionIndex];
    const currentAnswers =
      userAnswers[`q${currentQuestionData.id}:${currentQuestionData.slot}`] ||
      [];
    const questionNumberDisplay =
      currentQuestionData.number !== undefined
        ? currentQuestionData.number + 1
        : currentPage * questions.length + currentQuestionIndex + 1; // Logic tính toán cần xem lại nếu phân trang không đều

    return (
      <div className='quiz-attempt-area'>
        {/* Không cần hiển thị tên quiz ở đây vì đã có ở Navbar */}
        {/* <h3 className="mb-3">{attempt.quizname || `Quiz ID: ${quizId}`}</h3> */}

        {/* Timer */}
        <QuizTimer durationSeconds={quizTimeLimit} onTimeUp={handleTimeUp} />

        <QuestionCard
          questionData={currentQuestionData}
          questionNumber={questionNumberDisplay}
          totalQuestions={totalQuestionsInQuiz || 'N/A'}
          userAnswer={currentAnswers}
          onAnswerChange={handleAnswerChange}
        />

        <Navigation
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          // Không cần nút submit ở đây nữa vì đã có ở Navbar
          // onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isFirstPage={currentPage === 0}
          isLastPage={isLastPage}
        />
      </div>
    );
  }
  // Nếu không loading, không lỗi, không review, không question -> có thể là đang chờ start attempt hoặc có vấn đề khác
  if (!isLoading && !error && !reviewData && questions.length === 0) {
    return (
      <p className='text-center text-muted'>
        Đang tải câu hỏi hoặc không có câu hỏi nào...
      </p>
    );
  }

  return null; // Trạng thái không hợp lệ khác
};

export default QuizContainer;
