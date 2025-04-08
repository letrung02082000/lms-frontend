import React, { useRef, useEffect, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-youtube';
import { getYoutubeId } from 'utils/commonUtils';
import VideoProgressMapa from './VideoProgressBar';

const VideoPlayer = ({
  url,
  videoView,
  onMapaUpdate,
  intervalTime = 5,
}) => {
  const [mapa, setMapa] = useState(videoView?.mapa || []);
  const youtubeId = getYoutubeId(url);
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const mapaRef = useRef(videoView?.mapa || []);
  const lastValidTime = useRef(videoView?.currenttime || 0);

  useEffect(() => {
    if (!youtubeId || !videoRef.current || playerRef.current) return;

    const player = videojs(videoRef.current, {
      techOrder: ['youtube'],
      sources: [
        {
          type: 'video/youtube',
          src: `https://www.youtube.com/watch?v=${youtubeId}`,
        },
      ],
      youtube: {
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3
      },
      controls: true,
      responsive: true,
      fluid: true,
    });
    playerRef.current = player;

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [youtubeId]);

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

      onMapaUpdate(
        mapaRef.current,
        Math.floor(playerRef.current.currentTime()),
        Math.floor(playerRef.current.duration()),
        Math.floor(
          (mapaRef.current.filter((item) => item === 1).length /
            mapaRef.current.length || 0) * 100
        )
      );
      setMapa(mapaRef.current);
    };

    const intervalId = setInterval(updateMapa, intervalTime * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const player = playerRef.current;

    if (!player) return;

    const handleTimeUpdate = () => {
      const currentTime = player.currentTime();
      const duration = player.duration();

      if (mapaRef.current.length === 0 || mapaRef.current.length !== Math.floor(duration / intervalTime)) {
        const totalIntervals = Math.floor(duration / intervalTime);
        const initialMapa = new Array(totalIntervals).fill(0);
        mapaRef.current = initialMapa;
      }

      if(lastValidTime.current > currentTime){
        player.currentTime(lastValidTime.current);
        return;
      }

      if (currentTime >= duration) {
        player.pause();
        return;
      }

      if (currentTime - lastValidTime.current > intervalTime + 1) {
        playerRef.current.currentTime(lastValidTime.current);
        return;
      } else {
        lastValidTime.current = currentTime;
        mapaRef.current = [...mapaRef.current];
        const currentIndex = Math.floor(currentTime / intervalTime);
        mapaRef.current[currentIndex] = 1;
      }
    };

    player.on('timeupdate', handleTimeUpdate);

    return () => {
      if (player) {
        player.off('timeupdate', handleTimeUpdate);
      }
    };
  }, []);

  return videoRef ? (
    <div className='my-4'>
      <div data-vjs-player>
        <video ref={videoRef} className='video-js vjs-big-play-centered' />
      </div>
      <div className='my-2'></div>
      <VideoProgressMapa mapa={mapa} />
      <div className='d-flex justify-content-between'>
        <p>Độ dài: {mapa.length * intervalTime} giây</p>
        <p>
          {Math.floor(
            (mapa.filter((item) => item === 1).length / mapa.length || 0) * 100
          )}{' '}
          %
        </p>
        <p>
          Đã xem: {mapa.filter((item) => item === 1).length * intervalTime} giây
        </p>
      </div>
    </div>
  ) : (
    <div>Không thể phát video</div>
  );
};

export default VideoPlayer;
