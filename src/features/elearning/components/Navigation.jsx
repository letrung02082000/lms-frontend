// src/components/Navigation.jsx
import React from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const Navigation = ({
  currentQuestionIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting,
  isFirstPage,
  isLastPage,
}) => {
  // Thêm isFirstPage, isLastPage
  const isFirstQuestionOnPage = currentQuestionIndex === 0;
  const isLastQuestionOnPage = currentQuestionIndex === totalQuestions - 1;

  // Logic disable nút Previous/Next dựa trên cả trang và câu hỏi trên trang
  const disablePrevious =
    (isFirstPage && isFirstQuestionOnPage) || isSubmitting;
  const disableNext = (isLastPage && isLastQuestionOnPage) || isSubmitting;

  return (
    // Sử dụng flexbox của Bootstrap để căn chỉnh nút
    <div className='d-flex justify-content-between mt-4'>
      <Button
        variant='outline-secondary'
        onClick={onPrevious}
        disabled={disablePrevious}
      >
        &laquo; Câu trước
      </Button>

      {/* Chỉ hiển thị nút Next nếu chưa phải câu cuối/trang cuối */}
      {!disableNext ? (
        <Button
          variant='outline-primary'
          onClick={onNext}
          disabled={disableNext}
        >
          Câu tiếp theo &raquo;
        </Button>
      ) : (
        // Hiển thị nút Submit khi ở câu cuối/trang cuối
        <Button variant='success' onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting && (
            <Spinner
              as='span'
              animation='border'
              size='sm'
              role='status'
              aria-hidden='true'
              className='me-1' // Thêm margin end
            />
          )}
          {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
        </Button>
      )}

      {/* Hoặc luôn hiển thị nút Nộp bài */}
      {/* <Button variant="success" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting && <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-1" />}
            {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
        </Button> */}
    </div>
  );
};

export default Navigation;
