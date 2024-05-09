import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import DyteAudioHandler from './DyteAudioHandler';

const Audio = () => {
  const { meeting } = useDyteMeeting();
  const joinedParticipants = useDyteSelector((m) =>
    m.participants.joined.toArray()
  );
  const [audioHandler] = useState(new DyteAudioHandler());
  const audioUpdateListener = useCallback((
    { id, audioEnabled, audioTrack }: { id: string, audioEnabled: boolean, audioTrack: MediaStreamTrack}
  ) => {
    const audioId = `audio-${id}`;
    if (audioEnabled && audioTrack != null) {
      audioHandler.addTrack(audioId, audioTrack);
    } else {
      audioHandler.removeTrack(audioId);
    }
  }, [audioHandler]);

  useEffect(() => {
    for (const participant of joinedParticipants) {
      audioUpdateListener(participant);
    }
  }, [audioUpdateListener, joinedParticipants]);

  useEffect(() => {

    const participantLeftListener = ({ id }: { id: string}) => {
      audioHandler.removeTrack(`audio-${id}`);
      audioHandler.removeTrack(`screenshare-${id}`);
    };

    const screenShareUpdateListener = (
      { id, screenShareEnabled, screenShareTracks }: { id: string, screenShareEnabled: boolean, screenShareTracks: any}
    ) => {
      const audioId = `screenshare-${id}`;
      if (screenShareEnabled && screenShareTracks.audio != null) {
        audioHandler.addTrack(audioId, screenShareTracks.audio);
      } else {
        audioHandler.removeTrack(audioId);
      }
    };

    const deviceUpdateListener = ({ device }: any) => {
      if (device.kind === 'audiooutput') {
        audioHandler.setDevice(device.deviceId);
      }
    };

    meeting.participants.joined.addListener('audioUpdate', audioUpdateListener);
    meeting.participants.joined.addListener('screenShareUpdate', screenShareUpdateListener);
    meeting.participants.joined.addListener('participantLeft', participantLeftListener);
    meeting.self.addListener('deviceUpdate', deviceUpdateListener);
    return () => {
      meeting.participants.joined.removeListener('audioUpdate', audioUpdateListener);
      meeting.participants.joined.removeListener('screenShareUpdate', screenShareUpdateListener);
      meeting.participants.joined.removeListener('participantLeft', participantLeftListener);
      meeting.self.removeListener('deviceUpdate', deviceUpdateListener);
    }
  }, [meeting]);

  return (
    null
  );
};

export default Audio;
