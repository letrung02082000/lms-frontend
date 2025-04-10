import React, { useRef, useEffect, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import VideoProgressMapa from './VideoProgressBar';

const VideoPlayer = ({
  url,
  videoView,
  onMapaUpdate,
  intervalTime = 5,
}) => {
  const [mapa, setMapa] = useState(videoView?.mapa || []);
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const mapaRef = useRef(videoView?.mapa || []);
  const lastValidTime = useRef(videoView?.currenttime || 0);

  useEffect(() => {
    if (!url || !videoRef.current || playerRef.current) return;

    const player = videojs(videoRef.current, {
      techOrder: ['html5'],
      sources: [
        {
          src: url,
          type: 'video/mp4',
        },
      ],
      controls: true,
      responsive: true,
      fluid: true,
      loop: false,
    });

    playerRef.current = player;

    player.ready(() => {
      const startTime =
        (videoView?.duration * videoView?.percent) / 100 ||
        videoView?.currenttime ||
        0;
      player.currentTime(startTime);
    });

    player.on('ended', function () {
      player.pause();
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [url]);

  useEffect(() => {
    const updateMapa = () => {
      const player = playerRef.current;
      if (!player || player.paused()) return;

      if(mapaRef.current.length === 0) {
        return;
      }

      if(lastValidTime.current > playerRef.current.currentTime()) {
        playerRef.current.currentTime(lastValidTime.current);
        return;
      }

      const currentTime = Math.floor(player.currentTime());
      const duration = Math.floor(player.duration());

      const viewedCount = mapaRef.current.filter((v) => v === 1).length;
      const percent = Math.floor((viewedCount / mapaRef.current.length) * 100) || 0;

      if(percent >= 100) {
        player.pause();
      }

      onMapaUpdate(mapaRef.current, currentTime, duration, percent);
      setMapa([...mapaRef.current]);
    };

    const intervalId = setInterval(updateMapa, intervalTime * 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const handleTimeUpdate = () => {
      const currentTime = player.currentTime();
      const duration = player.duration();

      if(!videoView) return;

      if (currentTime >= duration) {
        player.pause();
        return;
      }

      if (mapaRef.current.length === 0) {
        const totalIntervals = Math.floor(duration / intervalTime);
        const initialMapa = new Array(totalIntervals).fill(0);
        mapaRef.current = initialMapa;
        lastValidTime.current = 0;
        player.currentTime(0);
        return;
      }

      if (lastValidTime.current > currentTime) {
        player.currentTime(lastValidTime.current);
        return;
      }

      if (currentTime - lastValidTime.current > intervalTime + 1) {
        player.currentTime(lastValidTime.current);
        return;
      }

      lastValidTime.current = currentTime;

      const currentIndex = Math.floor(currentTime / intervalTime);
      mapaRef.current = [...mapaRef.current];
      mapaRef.current[currentIndex] = 1;
    };

    player.on('timeupdate', handleTimeUpdate);
    return () => {
      player.off('timeupdate', handleTimeUpdate);
    };
  }, []);

  useEffect(() => {
    if (videoView?.mapa) {
      setMapa(videoView.mapa);
      mapaRef.current = videoView.mapa;
      lastValidTime.current = videoView.currenttime || 0;
    }
  }, [videoView]);

  return (
    <div className='my-4'>
      <div data-vjs-player>
        <video
          ref={videoRef}
          className='video-js vjs-big-play-centered'
          playsInline
        />
      </div>
      <div className='my-2'></div>
      <VideoProgressMapa mapa={mapa} />
      <div className='d-flex justify-content-between'>
        <p>Độ dài: {mapa.length * intervalTime} giây</p>
        <p>
          {Math.floor(
            (mapa.filter((item) => item === 1).length / mapa.length || 0) * 100
          )}
          %
        </p>
        <p>
          Đã xem: {mapa.filter((item) => item === 1).length * intervalTime} giây
        </p>
      </div>
    </div>
  );
};

export default VideoPlayer;
