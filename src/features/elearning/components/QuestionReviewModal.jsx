import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import QuestionItem from './QuestionItem';
import { parseQuestionHTML } from 'utils/commonUtils';

const QuestionReviewModal = ({ show, onHide, summary, onFinish }) => {
  return (
    <Modal size='lg' show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Xem lại câu trả lời</Modal.Title>
      </Modal.Header>
      <Modal.Body className='overflow-auto' style={{ maxHeight: '65vh' }}>
        {summary?.questions?.length > 0 ? (
          summary?.questions.map((q, index) => (
            <>
              <h5>Câu {q.number}</h5>
              <QuestionItem
                question={parseQuestionHTML(q.html)}
                key={index}
                disabled={true}
              />
            </>
          ))
        ) : (
          <p>Không có câu hỏi nào để hiển thị.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <div className='d-flex justify-content-center w-100'>
          <Button variant='primary' onClick={onFinish}>
            Kết thúc bài làm
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default QuestionReviewModal;
