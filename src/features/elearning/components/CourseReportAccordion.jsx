import React from "react";
import { Accordion, Table } from "react-bootstrap";
import { formatTime } from "utils/commonUtils";

const CourseReportAccordion = ({ courseReport }) => {
  const courseEntries = Object.entries(courseReport?.courses);

  return (
    <Accordion defaultActiveKey={courseEntries[0][0]}>
      {courseEntries.map(([courseKey, course], index) => (
        <Accordion.Item eventKey={courseKey} key={courseKey}>
          <Accordion.Header>{course.coursename}</Accordion.Header>
          <Accordion.Body>
            {Object.entries(course.modules).map(([moduleType, items]) => (
              <div key={moduleType} className='mb-4'>
                <h5>{moduleType === 'quiz' ? 'Bài kiểm tra' : 'Bài giảng'}</h5>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Tên</th>
                      {moduleType === 'quiz' ? (
                        <>
                          <th>Điểm</th>
                          <th>Điểm cần đạt</th>
                          <th>Số câu hỏi</th>
                          <th>Kết quả</th>
                        </>
                      ) : (
                        <>
                          <th>Điểm</th>
                          <th>Điểm cần đạt</th>
                          <th>Thời lượng đã xem</th>
                          <th>Thời lượng bài giảng</th>
                          <th>Kết quả</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.itemname}</td>
                        <td>
                          {item.finalgrade != null
                            ? `${item.finalgrade} / ${item.grademax}`
                            : 'Chưa có'}
                        </td>
                        <td>{item.gradepass}</td>
                        {moduleType === 'quiz' ? (
                          <td>
                            {item.quizsumgrades != null
                              ? item.quizsumgrades
                              : 'N/A'}
                          </td>
                        ) : (
                          <>
                            <td>
                              {item.finalgrade != null
                                ? formatTime(
                                    Math.floor(
                                      (item.duration * item.finalgrade) / 100
                                    )
                                  )
                                : '0 giây'}
                            </td>
                            <td>
                              {item.duration != null
                                ? formatTime(item.duration)
                                : '0 giây'}
                            </td>
                          </>
                        )}
                        <td>
                          {item.finalgrade != null ? item.finalgrade >= item.gradepass
                            ? <span className="text-success fw-bold">Đạt</span>
                            : <span className="text-danger">Chưa đạt</span>: <span className="text-warning">Chưa thực hiện</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ))}
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default CourseReportAccordion;
