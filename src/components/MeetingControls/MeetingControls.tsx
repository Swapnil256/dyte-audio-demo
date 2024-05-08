import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core';
import React from 'react';

const MeetingControls = () => {
  const { meeting } = useDyteMeeting();
  const audioEnabled = useDyteSelector((m) => m.self.audioEnabled);
  const videoEnabled = useDyteSelector((m) => m.self.videoEnabled);
  return (
    <>
      <div className="audio">
        <button
          onClick={() => {
            if (audioEnabled) {
              meeting.self.disableAudio();
            } else {
              meeting.self.enableAudio();
            }
          }}
        >
          {audioEnabled ? 'Disable Audio' : 'Enable Audio'}
        </button>
        <button
          onClick={() => {
            if (videoEnabled) {
              meeting.self.disableVideo();
            } else {
              meeting.self.enableVideo();
            }
          }}
        >
          {videoEnabled ? 'Disable Video' : 'Enable Video'}
        </button>
      </div>
    </>
  );
};

export default MeetingControls;
