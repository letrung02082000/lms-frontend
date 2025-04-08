import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, ListGroup, Card, Accordion } from 'react-bootstrap';
import elearningApi from 'api/elearningApi';
import VideoPlayer from '../components/YoutubePlayer';

function ElearningStudentCourseDetailPage() {
  const { courseId } = useParams();
  const [courseContent, setCourseContent] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    document.title = 'Học viên | E-learning';
    elearningApi.getCourseContent(courseId)
      .then((response) => {
        setCourseContent(response.data);
        if (response.data.length > 0) {
          // Chọn phần đầu tiên có nội dung mặc định
          const firstModule = response.data.find(section => section.modules.length > 0)?.modules[0];
          if (firstModule && firstModule.contents.length > 0) {
            setSelectedContent(firstModule.contents[0]);
          }
        }
      })
      .catch((error) => console.log('Failed to fetch course content: ', error));
  }, [courseId]);

  return (
    <Container fluid className="py-4">
      <Row>
        {/* Sidebar bên trái */}
        <Col md={3} className="border-end">
          <h5 className="mb-3">Danh sách bài học</h5>
          <Accordion defaultActiveKey="0">
            {courseContent.map((section, sectionIndex) => (
              <Accordion.Item eventKey={String(sectionIndex)} key={section.id}>
                <Accordion.Header>{section.name}</Accordion.Header>
                <Accordion.Body>
                  <ListGroup variant="flush">
                    {section.modules.map((module) => (
                      <ListGroup.Item key={module.id}>
                        <strong>{module.modname} </strong>
                        <strong>{module.name}</strong>
                        {module.contents?.length > 0 && (
                          <ListGroup variant="flush">
                            {module.contents.map((content) => (
                              <ListGroup.Item
                                key={content.fileurl}
                                action
                                onClick={() => setSelectedContent(content)}
                                active={selectedContent?.fileurl === content.fileurl}
                              >
                                {content.filename}
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        )}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>

        {/* Nội dung bên phải */}
        <Col md={9}>
          {selectedContent ? (
            <Card className="shadow-sm">
              <Card.Header>
                <h5>{selectedContent.filename}</h5>
              </Card.Header>
              <Card.Body>
                {selectedContent.type === 'google-drive' ? (
                  // <VideoPlayer videoUrl={selectedContent.fileurl} updateMapa={(time) => console.log('Cập nhật Mapa:', time)} />
                  <iframe
                    src={selectedContent.fileurl}
                    title="Google Drive Video"
                    width="100%"
                    height="400px"
                    allow="autoplay"
                  ></iframe>
                ) : (
                  <p>Không có nội dung hiển thị.</p>
                )}
              </Card.Body>
            </Card>
          ) : (
            <p>Vui lòng chọn một nội dung để xem.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ElearningStudentCourseDetailPage;
