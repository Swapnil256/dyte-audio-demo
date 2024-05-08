import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
import { useParams } from 'react-router-dom';
import Audio from '../Audio';
import axios from 'axios';

const dyteBaseURL = 'https://api.dyte.io/v2';
const payload = {
  name: `Dyte Demo Participant`,
  preset_name: 'pg-custom-preset',
  custom_participant_id: '123',
};

const dyteOrgId = '',
  dyteAPIKey = '';

const getAuthToken = () => {
  const encoder = new TextEncoder();
  const encodedArray = encoder.encode(`${dyteOrgId}:${dyteAPIKey}`);
  let binaryString = '';
  encodedArray.forEach((byte) => {
    binaryString += String.fromCharCode(byte);
  });

  // Convert binary string to base64
  const base64String = btoa(binaryString);
  return base64String;
};

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Basic ${getAuthToken()}`,
};

const DyteContainer: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [meeting, initMeeting] = useDyteClient({ resetOnLeave: true });
  const [token, setToken] = useState(null);
  let { sessionId } = useParams<{ sessionId: string }>();

  useEffect(() => {
    axios
      .post(`${dyteBaseURL}/meetings/${sessionId}/participants`, payload, {
        headers,
      })
      .then((val) => {
        setToken(val.data.data.token);
      })
      .catch((err) => console.error('Error while adding participants', err));
  }, [sessionId]);

  useEffect(() => {
    if (token) {
      initMeeting({
        authToken: token,
        defaults: {
          audio: true,
          video: true,
        },
      }).then((val) => {
        val?.join();
      });
    }
  }, [token]);

  useEffect(
    () => () => {
      if (!meeting) {
        return;
      }
      meeting.self.disableVideo();
      meeting.self.disableAudio();
    },
    [meeting]
  );

  return !meeting ? (
    <p>No Meeting</p>
  ) : (
    <DyteProvider value={meeting}>
      <>
        <Audio />
        {token && children}
      </>
    </DyteProvider>
  );
};

export default DyteContainer;
