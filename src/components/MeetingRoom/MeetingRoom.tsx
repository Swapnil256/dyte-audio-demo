import React from 'react';
import DyteContainer from '../DyteContainer';
import MeetingControls from '../MeetingControls';
import VideoTiles from '../VideoTiles';

const MeetingRoom = () => {
  console.log('meeting room');
  return (
    <DyteContainer>
      <div className="meeting-tiles" style={{ display: 'flex' }}>
        <VideoTiles />
      </div>
      <div className="meeting-controls">
        <MeetingControls />
      </div>
    </DyteContainer>
  );
};

export default MeetingRoom;
