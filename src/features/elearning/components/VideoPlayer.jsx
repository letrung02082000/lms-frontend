import React, { useRef, useEffect, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoPlayer = ({ videoUrl, updateMapa }) => {
  const videoRef = useRef(null);
  const [player, setPlayer] = useState(null);
  
  useEffect(() => {
    if (!videoRef.current) return;

    const videoJsPlayer = videojs(videoRef.current, {
      controls: true,
      autoplay: false,
      fluid: true
    });

    // Chặn tua nhanh
    videoJsPlayer.on('timeupdate', () => {
      const currentTime = videoJsPlayer.currentTime();
      const lastTime = localStorage.getItem('lastWatched') || 0;
      if (currentTime > lastTime + 10) {
        videoJsPlayer.currentTime(lastTime); // Reset lại thời gian xem
      }
    });

    // Lưu trạng thái xem video
    videoJsPlayer.on('timeupdate', () => {
      updateMapa(videoJsPlayer.currentTime());
      localStorage.setItem('lastWatched', videoJsPlayer.currentTime());
    });

    setPlayer(videoJsPlayer);

    return () => {
      if (videoJsPlayer) {
        videoJsPlayer.dispose();
      }
    };
  }, [videoUrl]);

  return (
    <div>
      <video ref={videoRef} className="video-js vjs-default-skin" />
    </div>
  );
};

export default VideoPlayer;
