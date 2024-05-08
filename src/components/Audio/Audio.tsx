import { useDyteSelector } from '@dytesdk/react-web-core';
import React, { useEffect, useRef } from 'react';

const Audio = () => {
  const joinedParticipants = useDyteSelector((m) =>
    m.participants.joined.toArray()
  );
  const audioElement = useRef<HTMLAudioElement>(null);

  // const [joinedParticipantTracks] = useParticipantsInfoAtom();

  // const mediaTracks = joinedParticipantTracks
  //   .map(pt => pt.audioTracks?.id)
  //   .filter(v => !!v);

  // console.log({ mediaTracks });

  useEffect(() => {
    let audioContextClone = (window as any).audioCtx;
    if (!audioContextClone) {
      // @ts-ignore -- legacy support
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const _audioContext = new AudioContext();
      audioContextClone = _audioContext;
      (window as any).audioCtx = _audioContext;
    }
    if (!audioElement.current) {
      console.log('no audio el found to play track');
      return;
    }

    if (audioContextClone.state === 'suspended') {
      audioContextClone.resume();
    }

    const dest = audioContextClone.createMediaStreamDestination();

    const audioSources: MediaStreamAudioSourceNode[] = [];
    for (const participant of joinedParticipants) {
      const { audioTrack, audioEnabled, screenShareEnabled } = participant;
      if (audioEnabled && audioTrack && !screenShareEnabled) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(audioTrack);
        const contextSource =
          audioContextClone.createMediaStreamSource(mediaStream);
        console.log('MediaStream tracks:', mediaStream.getAudioTracks());
        audioSources.push(contextSource);
      }
    }
    audioSources.forEach((sourceNode) => sourceNode.connect(dest));
    console.log('Destination stream --', dest.stream);
    audioElement.current.srcObject = dest.stream;
    console.log('Audio element readyState:', audioElement.current.readyState);
    console.log('AudioContext sample rate:', audioContextClone.sampleRate);
    return () => {
      if (!audioElement.current) {
        console.log('no audio el found to play track -- unmounting');
        return;
      }
      audioSources.forEach((sourceNode) => sourceNode.disconnect(dest));
      audioElement.current.srcObject = null;
      dest.disconnect();
    };
  }, [joinedParticipants]);
  return (
    <audio
      id="dyte-meeting-audio-output"
      ref={audioElement}
      autoPlay
      onPause={(el) => {
        console.log('is Paused');
      }}
      onError={(err) => console.error('error in audio el', err)}
    />
  );
};

export default Audio;
