import React, { useRef, useEffect } from 'react';
import { getYoutubeId } from 'utils/commonUtils';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-youtube';

const VideoPlayer = ({ youtubeUrl }) => {
  const videoId = getYoutubeId(youtubeUrl);
  console.log(videoId);
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        techOrder: ['youtube'],
        sources: [
          {
            type: 'video/youtube',
            src: `https://www.youtube.com/watch?v=${videoId}`,
          },
        ],
        youtube: {
          modestbranding: 1,
          rel: 0,
        },
        controls: true,
        responsive: true,
        fluid: true,
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [videoId]);

  return videoId ? (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  ) : null;
};

export default VideoPlayer;
