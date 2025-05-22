import elearningApi from 'api/elearningApi';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, ButtonGroup, Container } from 'react-bootstrap';
import Timer from '../components/Timer';
import { toastWrapper } from 'utils';
import { usePromptWithUnload } from 'hooks/usePromptWithUnload';
import moodleApi from 'services/moodleApi';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectElearningData } from 'store/elearning.slice';
import TimeExceedWarning from '../components/TimeExceedWarning';
import { replaceImageSrcWithMoodleUrl } from 'utils/elearning.utils';
import LoadingSpinner from '../components/LoadingSpinner';
import BackButton from 'components/BackButton';

const ElearningStudentBookPage = () => {
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [moduleTimeData, setModuleTimeData] = useState({});
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [timestart, setTimestart] = useState(Date.now());
  const [completedChapters, setCompletedChapters] = useState([]);
  const autoPageTurning = true; // Set to true to enable auto page turning
  const moodleToken = localStorage.getItem('moodleToken');
  const fileUrls = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urls = urlParams.get('urls')?.split(',') || [];
    return urls.map((url) => url.split('?')[0] + `?token=${moodleToken}`);
  }, [moodleToken]);
  const elearningData = useSelector(selectElearningData);
  const { isLimitExceeded, timeLimitPerDay, totalTodayTime } = elearningData;

  const moduleId = Number(new URLSearchParams(window.location.search).get('m'));
  const instanceId = Number(
    new URLSearchParams(window.location.search).get('i')
  );

  usePromptWithUnload(
    'Bạn có chắc muốn rời đi? Dữ liệu chưa được lưu.',
    currentChapterId !== null
  );

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      const fileUrl = fileUrls[currentIndex];
      if (!fileUrl) return;

      const chapterId = Number(fileUrl.split('/').at(-2));
      setCurrentChapterId(chapterId);
      setTimestart(Date.now());

      try {
        const response = await fetch(fileUrl);
        const text = await response.text();
        const textWithImages = replaceImageSrcWithMoodleUrl(text, fileUrl);
        setHtmlContent(textWithImages);
      } catch (error) {
        console.error('Error fetching HTML content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [currentIndex, fileUrls]);

  useEffect(() => {
    const viewBookChapter = async (instanceId, currentChapterId) => {
      if (instanceId) {
        try {
          await moodleApi.viewBookChapter(instanceId, currentChapterId);
        } catch (error) {
          console.error('Error viewing book chapter:', error);
        }
      }
    };

    if (currentChapterId) {
      viewBookChapter(instanceId, currentChapterId);
    }
  }, [currentChapterId, instanceId]);

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

    const maxRetries = 10;
    let attempt = 0;
    let success = false;

    while (attempt < maxRetries && !success) {
      try {
        if (instanceId) {
          await moodleApi.viewBookChapter(instanceId, currentChapterId);
          success = true;
          setCompletedChapters((prev) => {
            if (!prev.includes(currentChapterId)) {
              const updated = [...prev, currentChapterId];
              if (updated.length === fileUrls.length) {
                toastWrapper('Bạn đã hoàn thành tất cả các chương.', 'success');
              } else {
                if (autoPageTurning) {
                  toastWrapper(
                    'Bạn đã hoàn thành chương này. Đang chuyển sang chương kế tiếp.',
                    'success'
                  );
                  setTimeout(() => {
                    setCurrentIndex((prev) => prev + 1);
                  }, 2000); // Auto page turning after 2 seconds
                } else {
                  toastWrapper('Bạn đã hoàn thành chương này.', 'success');
                }
              }
              return updated;
            }
            return prev;
          });
        }
      } catch (error) {
        attempt += 1;
        if (attempt >= maxRetries) {
          console.error('Error viewing book chapter:', error);
          toastWrapper('Có lỗi xảy ra khi lưu trạng thái chương.', 'error');
        }
      }
    }
  };

  if (isLimitExceeded) {
    return (
      <TimeExceedWarning
        timeLimitPerDay={timeLimitPerDay}
        totalTodayTime={totalTodayTime}
      />
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Styles>
      <Container className='my-4'>
        <BackButton />
        <div
          style={{
            height: '78vh',
            overflowY: 'scroll',
            padding: '5%',
            backgroundColor: '#fff',
          }}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
        <div
          style={{
            position: 'fixed',
            top: 10,
            right: 10,
            zIndex: 1000,
          }}
        >
          {!completedChapters?.includes(currentChapterId) ? (
            moduleTimeData[currentChapterId] ? (
              <Timer
                key={currentChapterId}
                timestart={timestart}
                timelimit={moduleTimeData[currentChapterId]}
                text={'Vui lòng đọc chương này trong '}
                onTimeUp={handleTimeUp}
              />
            ) : (
              <Timer
                key={currentChapterId}
                timestart={timestart}
                timelimit={0.1}
                text={'Vui lòng đọc chương này trong '}
                onTimeUp={handleTimeUp}
              />
            )
          ) : (
            <Alert variant='success'>Bạn đã hoàn thành chương này</Alert>
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
              Kế tiếp
            </Button>
          </ButtonGroup>
        </div>
      </Container>
    </Styles>
  );
};

export default ElearningStudentBookPage;

const Styles = styled.div`
  .video-js {
    width: 100%;
    height: revert;
    background-color: transparent;
  }
`;
