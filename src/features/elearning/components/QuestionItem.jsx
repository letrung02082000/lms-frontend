import React from 'react';
import { Card, Form } from 'react-bootstrap';

const QuestionItem = ({ question, onAnswerChange }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{question.text}</Card.Title>
        <Form>
          {question.answers.map((ans) => (
            <Form.Check
              key={ans.id}
              type="radio"
              id={`${question.id}-${ans.id}`}
              name={`question-${question.id}`} // nhóm radio theo câu hỏi
              label={ans.label}
              value={ans.value}
              onChange={() => onAnswerChange(question.id, ans.value)}
              className="mb-2"
            />
          ))}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default QuestionItem;
