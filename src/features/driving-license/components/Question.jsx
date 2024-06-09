import { DRIVING_TAG } from 'constants/driving';
import React, { useEffect, useState } from 'react';
import { Form, Button, Image } from 'react-bootstrap';

function Question({ number, question, answers, explanation, questionData }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    setSelectedOption(null);

  }, [number]);

  return (
    <Form>
      <Form.Group controlId='question'>
        <Form.Text className='d-block mb-2'>
          Câu hỏi số {number}
          <span
            className={`form-text border rounded p-1 ms-2 ${
              DRIVING_TAG[questionData?.point] === DRIVING_TAG[6]
                ? 'text-danger border-danger'
                : 'text-info border-info'
            }`}
          >
            {DRIVING_TAG[questionData?.point]}
          </span>
        </Form.Text>
        <Form.Label>{question}</Form.Label>
        {questionData?.images.length > 0 && (
          <Image
            key={number}
            id={`image-${number}`}
            name={`image-${number}`}
            src={questionData?.images[0]}
            height={200}
            className='mt-2 mb-3'
          />
        )}
        {answers.map((answer, index) => (
          <Form.Check
            style={{
              color: selectedOption && (answer?.correct ? 'green' : 'red'),
              fontWeight: selectedOption && 'bold',
            }}
            value={index}
            key={index}
            type='radio'
            label={answer?.text}
            name={`question-${number}`}
            id={`option-${index}`}
            onChange={handleOptionChange}
            checked={selectedOption === index.toString()}
          />
        ))}
        {selectedOption && <p className='mt-2'>Giải thích: {explanation}</p>}
      </Form.Group>
    </Form>
  );
}

export default Question;
