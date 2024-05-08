import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core';
import React, { useEffect, useRef } from 'react';

const VideoTile = ({ user }: any) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { videoTrack, videoEnabled } = user;
  useEffect(() => {
    try {
      if (videoTrack && videoEnabled) {
        const videoStream = new MediaStream();
        videoStream.addTrack(videoTrack);
        if (videoRef.current) {
          videoRef.current.srcObject = videoStream;
          videoRef.current.pause();
          setTimeout(() => {
            videoRef.current
              ?.play()
              .catch((e) =>
                console.debug('Exception while playing video stream', e)
              );
          }, 100);
        }
      } else {
        if (videoRef.current && videoRef.current.srcObject) {
          (videoRef.current.srcObject as MediaStream)
            .getVideoTracks()
            .map((track) => track.stop());
        }
      }
    } catch (error) {
      console.debug('Exception while setting video stream', error);
    }
  }, [videoTrack, videoEnabled]);
  return (
    <div
      className="video-tile"
      style={{ maxHeight: '400px', maxWidth: '400px', margin: '20px' }}
    >
      <video
        ref={videoRef}
        className="video-el"
        style={{
          transform: 'scaleX(-1)',
          objectFit: 'cover',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

const VideoTiles = () => {
  const currentUserJoined = useDyteSelector((m) => m.self);
  const joinedUsers = useDyteSelector((m) => m.participants.joined);

  return (
    <>
      {joinedUsers.toArray().map((user) => (
        <VideoTile user={user} />
      ))}
      <VideoTile user={currentUserJoined} />
    </>
  );
};

export default VideoTiles;
