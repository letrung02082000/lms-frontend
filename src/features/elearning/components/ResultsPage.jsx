// src/components/ResultsPage.jsx
import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge'; // Dùng Badge cho trạng thái

const ResultsPage = ({ reviewData, onRestart }) => {
  if (!reviewData || !reviewData.attempt) {
    return (
      <Card body className='text-center'>
        Không có dữ liệu kết quả.
      </Card>
    );
  }

  const { attempt, questions, grade } = reviewData;
  const totalGrade =
    attempt.quizmaxgrade ||
    questions?.reduce((sum, q) => sum + (q.maxmark || 0), 0) ||
    'N/A';
  const gradeFormatted =
    grade !== null ? parseFloat(grade).toFixed(2) : 'Chưa chấm';

  return (
    <Card className='mt-4 shadow-sm'>
      <Card.Header as='h4'>Kết quả bài làm</Card.Header>
      <Card.Body>
        <Card.Title as='h5'>
          Điểm số: {gradeFormatted} / {totalGrade}
        </Card.Title>
        <Card.Text>
          Trạng thái:{' '}
          <Badge bg={attempt.state === 'finished' ? 'success' : 'warning'}>
            {attempt.state === 'finished' ? 'Đã hoàn thành' : attempt.state}
          </Badge>
        </Card.Text>

        {questions && questions.length > 0 && (
          <div className='mt-4'>
            <h5>Chi tiết câu trả lời:</h5>
            {questions.map((q, index) => (
              <Card key={q.slot || index} className='mb-3'>
                <Card.Header>
                  <strong>
                    Câu {q.number !== undefined ? q.number + 1 : index + 1}:
                  </strong>{' '}
                  <Badge
                    bg={
                      q.mark > 0 && q.mark === q.maxmark
                        ? 'success'
                        : q.mark > 0
                        ? 'warning'
                        : 'danger'
                    }
                    className='float-end' // Đẩy sang phải
                  >
                    {q.mark !== null
                      ? `${q.mark}/${q.maxmark || 'N/A'}`
                      : 'N/A'}{' '}
                    điểm
                  </Badge>
                </Card.Header>
                <Card.Body>
                  {/* CẢNH BÁO BẢO MẬT */}
                  <div
                    className='question-review-content mb-2'
                    dangerouslySetInnerHTML={{ __html: q.html || '' }}
                  />
                  <p className='mb-1'>
                    <strong>Trạng thái:</strong>{' '}
                    <span
                      dangerouslySetInnerHTML={{ __html: q.status || '' }}
                    />
                  </p>
                  {q.feedbackhtml && (
                    <div className='mt-2 p-2 border rounded bg-light'>
                      <strong>Phản hồi:</strong>
                      {/* CẢNH BÁO BẢO MẬT */}
                      <div
                        dangerouslySetInnerHTML={{ __html: q.feedbackhtml }}
                      />
                    </div>
                  )}
                  {q.rightanswerhtml && (
                    <div className='mt-2 p-2 border rounded bg-light-success'>
                      {' '}
                      {/* Màu nền khác cho đáp án đúng */}
                      <strong>Đáp án đúng:</strong>
                      {/* CẢNH BÁO BẢO MẬT */}
                      <div
                        dangerouslySetInnerHTML={{ __html: q.rightanswerhtml }}
                      />
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>
        )}

        {onRestart && (
          <Button variant='primary' onClick={onRestart} className='mt-3'>
            Làm lại / Quay lại
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default ResultsPage;
