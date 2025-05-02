import React, { useEffect, useState } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import moodleApi from 'services/moodleApi';
import YoutubePlayer from '../components/YoutubePlayer';
import VideoPlayer from '../components/VideoPlayer';
import useSingleTab from 'hooks/useSingleTab';

function ElearningStudentVideoPage() {
  const { id: videoId } = useParams();
  const moduleId = new URLSearchParams(window.location.search).get('m');
  const [videoInstance, setVideoInstance] = useState(null);
  const [videoView, setVideoView] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useSingleTab('/elearning/student/video');

  useEffect(() => {
    if (!videoId) return;

    moodleApi
      .getVideoInstance(videoId)
      .then((data) => {
        console.log('Video instance data:', data);
        setVideoInstance(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching video module:', error);
        setError('Không thể tải video. Vui lòng thử lại sau.');
        setLoading(false);
      });

    moodleApi.getVideoView(moduleId).then((data) => {
      setVideoView(data?.at(-1));
    }).catch((error) => {
      console.error('Error fetching video view:', error);
    });
  }, [videoId]);

  const onMapaUpdate = (mapa, current, duration, percent) => {
    console.log('Mapa updated:', mapa);
    if(!videoView?.id) return;

    if(percent < videoView?.percent) {
      percent = videoView?.percent;
    }

    moodleApi
      .updateVideoView(videoView.id, current, duration, percent, mapa)
      .then((data) => {
        console.log('Video view updated:', data);
      })
      .catch((error) => {
        console.error('Error updating video view:', error);
      });
  };

  console.log(videoView);

  return (
    <div style={{ height: '100vh', overflowY: 'scroll' }}>
      <Container className='mt-4'>
        {loading && (
          <div className='text-center my-5'>
            <Spinner animation='border' />
            <p>Đang tải video...</p>
          </div>
        )}

        {error && <Alert variant='danger'>{error}</Alert>}

        {videoInstance && (
          <div className='w-75 mx-auto'>
            <h3 className='mb-4'>Video bài giảng: {videoInstance.name}</h3>
            {videoInstance?.origem === 'youtube' && (
              <YoutubePlayer
                url={videoInstance.videourl}
                videoView={videoView}
                onMapaUpdate={onMapaUpdate}
                intervalTime={5}
              />
            )}
            {videoInstance?.origem === 'link' && (
              <VideoPlayer
                url={videoInstance.videourl}
                videoView={videoView}
                onMapaUpdate={onMapaUpdate}
                intervalTime={5}
              />
            )}
          </div>
        )}
      </Container>
    </div>
  );
}

export default ElearningStudentVideoPage;
