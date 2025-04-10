// components/QuestionNavigator.js
import React from 'react';
import { Button } from 'react-bootstrap';

function QuestionNavigator({
  summaryQuestions = [],
  currentPage,
  setCurrentPage,
}) {
  return (
    <div style={{ position: 'sticky', top: 100 }}>
      <h5>Chuyển đến trang</h5>
      <div className='d-flex flex-wrap gap-2'>
        {summaryQuestions.map((q, index) => {
          const answered = q.stateclass !== 'notyetanswered';
          return (
            <Button
              key={q.slot}
              variant={
                index === currentPage
                  ? 'primary'
                  : answered
                  ? 'success'
                  : 'outline-secondary'
              }
              size='sm'
              onClick={() => setCurrentPage(index)}
            >
              {index + 1}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default QuestionNavigator;
