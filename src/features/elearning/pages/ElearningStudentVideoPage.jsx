import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import moodleApi from 'services/moodleApi';
import VideoPlayer from '../components/VideoPlayer';

function ElearningStudentVideoPage() {
  const videoId = useParams()?.id;
  const [videoInstance, setVideoInstance] = React.useState(null);
  console.log(videoInstance);
  useEffect(() => {
    moodleApi
      .getVideoInstance(videoId)
      .then((data) => {
        setVideoInstance(data);
      })
      .catch((error) => {
        console.error('Error fetching video module:', error);
      });
  }, []);

  useEffect(() => {
    if (videoInstance) {

    }
  }, [videoInstance]);

  return (
    <div style={{
      height: '100vh',
      overflowY: 'scroll',
    }}>
      <Container className='mt-4'>
      <h3 className='mb-4'>Bài giảng video: {videoInstance?.name}</h3>
      <VideoPlayer youtubeUrl={videoInstance?.videourl} />
    </Container>
    </div>
  );
}

export default ElearningStudentVideoPage;
