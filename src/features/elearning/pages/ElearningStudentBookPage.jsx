import elearningApi from 'api/elearningApi';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, ButtonGroup } from 'react-bootstrap';
import Timer from '../components/Timer';
import { toastWrapper } from 'utils';
import { usePromptWithUnload } from 'hooks/usePromptWithUnload';
import moodleApi from 'services/moodleApi';

const ElearningStudentBookPage = () => {
  const [htmlContent, setHtmlContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [moduleTimeData, setModuleTimeData] = useState({});
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [timestart, setTimestart] = useState(Date.now());
  const [completedChapters, setCompletedChapters] = useState([]);

  const moodleToken = localStorage.getItem('moodleToken');
  const fileUrls = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urls = urlParams.get('urls')?.split(',') || [];
    return urls.map((url) => url.split('?')[0] + `?token=${moodleToken}`);
  }, [moodleToken]);

  const moduleId = Number(new URLSearchParams(window.location.search).get('m'));
  const instanceId = Number(new URLSearchParams(window.location.search).get('i'));

  usePromptWithUnload('Bạn có chắc muốn rời đi? Dữ liệu chưa được lưu.', currentChapterId !== null);

  useEffect(() => {
    const loadContent = async () => {
      const fileUrl = fileUrls[currentIndex];
      if (!fileUrl) return;

      const chapterId = Number(fileUrl.split('/').at(-2));
      setCurrentChapterId(chapterId);
      setTimestart(Date.now());

      try {
        const response = await fetch(fileUrl);
        const text = await response.text();
        setHtmlContent(text);
      } catch (error) {
        console.error('Error fetching HTML content:', error);
      }
    };

    loadContent();
  }, [currentIndex, fileUrls]);

  useEffect(() => {
    const getModuleTimeData = async () => {
      try {
        const res = await elearningApi.getModuleTime(moduleId);
        const moduleTimeMap = {};
        res?.data?.forEach((item) => {
          moduleTimeMap[item?.chapterId] = item?.readingTime;
        });
        setModuleTimeData(moduleTimeMap);
      } catch (err) {
        console.error('Error fetching module time:', err);
      }
    };

    if (moduleId) {
      getModuleTimeData();
    }
  }, [moduleId]);

  const handleTimeUp = async () => {
    if (!currentChapterId) return;

    try {
      if (instanceId) {
        await moodleApi.viewBookChapter(instanceId, currentChapterId);
        setCompletedChapters((prev) => {
          if (!prev.includes(currentChapterId)) {
            const updated = [...prev, currentChapterId];
            // Kiểm tra hoàn thành toàn bộ
            if (updated.length === fileUrls.length) {
              toastWrapper('Bạn đã hoàn thành tất cả các chương.', 'success');
            } else {
              toastWrapper('Bạn đã hoàn thành chương này. Vui lòng chuyển sang chương tiếp theo.', 'success');
            }
            return updated;
          }
          return prev;
        });
      }
    } catch (error) {
      console.error('Error viewing book chapter:', error);
    }
  };

  return (
    <>
      <div
        style={{
          height: '100vh',
          overflowY: 'scroll',
          padding: '50px',
          backgroundColor: '#fff',
        }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      <div
        style={{
          position: 'fixed',
          top: 10,
          zIndex: 1000,
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          width: '100%',
        }}
      >
        {!completedChapters?.includes(currentChapterId) &&
          moduleTimeData[currentChapterId] && (
            <Timer
              key={currentChapterId}
              timestart={timestart}
              timelimit={moduleTimeData[currentChapterId]}
              text={'Thời gian chờ còn lại: '}
              onTimeUp={handleTimeUp}
            />
          )}
        {completedChapters?.includes(currentChapterId) && (
          <Alert variant='success'>
            Bạn đã hoàn thành chương này
          </Alert>
        )}
      </div>
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          zIndex: 1000,
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          width: '100%',
        }}
      >
        <ButtonGroup className='mb-2' style={{ gap: '10px' }}>
          <Button
            disabled={currentIndex === 0}
            variant='primary'
            onClick={() => setCurrentIndex((prev) => prev - 1)}
          >
            Trở về
          </Button>
          <Button
            disabled={currentIndex === fileUrls.length - 1}
            variant='primary'
            onClick={() => setCurrentIndex((prev) => prev + 1)}
          >
            Tiếp theo
          </Button>
        </ButtonGroup>
      </div>
    </>
  );
};

export default ElearningStudentBookPage;
