import MainLayout from '@src/components/main-layout';
import { i18nKeys } from '@src/configs/i18n';
import { Box, Button, Row, Spinner, Text } from 'native-base';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import {
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCView,
} from 'react-native-webrtc';
import { Socket, io } from 'socket.io-client';

const relayId = 'fe:fb:86:4d:fe:92';
const rtsp =
  'rtsp://rtspstream:b0fb17672543f51e2bfa52529e3dc238@zephyr.rtsp.stream/pattern';

const DashboardScreen = () => {
  const { t } = useTranslation();

  const socket = useRef<Socket | null>(null);

  const pc = useRef<RTCPeerConnection | null>(null);

  const [startBtnDisabled, setStartBtnDisabled] = useState(false);
  const [stopBtnDisabled, setStopBtnDisabled] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const createPeerConnection = () => {
    try {
      pc.current = new RTCPeerConnection({
        iceServers: [
          {
            urls: 'stun:stun.l.google.com:19302',
          },
        ],
      });

      pc.current.addEventListener('icecandidate', (e) => {
        if (e.candidate) {
          console.log('generated ICE candidate:', e.candidate);

          socket.current?.emit('clientRtc', {
            type: 'candidate',
            candidate: e.candidate,
          });
        }
      });

      pc.current.addEventListener('track', (e) => {
        console.log('Received track', e.streams);
        if (e.streams && e.streams?.[0]) {
          setSpinning(false);
          setRemoteStream(e.streams[0]);
        }
      });

      console.log('ok');
    } catch (error) {
      console.log('Error creating peer connection:', error);
    }
  };

  const handleHangUp = useCallback(() => {
    socket.current?.emit('disconnectStream');

    if (pc.current) {
      pc.current.close();
      pc.current = null;
    }
    setStartBtnDisabled(false);
    setStopBtnDisabled(true);
    setRemoteStream(null);
    setSpinning(false);
  }, []);

  const handleOffer = useCallback(
    async (offer: RTCSessionDescription) => {
      if (!pc.current) {
        createPeerConnection();
      }
      try {
        await pc.current?.setRemoteDescription(offer);
        const answer = await pc.current?.createAnswer();
        await pc.current?.setLocalDescription(answer);
        setStatus('Sending answer...');

        socket.current?.emit('clientRtc', {
          type: 'answer',
          answer: answer,
        });
      } catch (error: any) {
        setStatus('Error handling offer');
        console.error('Error handling offer:', error);
        handleHangUp();
      }
    },
    [handleHangUp],
  );

  const handleCandidate = useCallback(async (candidate: RTCIceCandidate) => {
    if (!pc.current) {
      console.error('No peerConnection');
      return;
    }
    try {
      await pc.current?.addIceCandidate(new RTCIceCandidate(candidate));
      setStatus('Added ICE candidate');
    } catch (error) {
      setStatus('Error adding ICE candidate');
      console.error('Error adding ICE candidate:', error);
    }
  }, []);

  const handleStartBtn = () => {
    if (pc.current) {
      console.log('Peer connection already exists.');
      return;
    }
    setStartBtnDisabled(true);
    setStopBtnDisabled(false);
    setSpinning(true);
    createPeerConnection();
    socket.current?.emit('requestStream', {
      relayId,
      rtsp,
    });
  };

  useEffect(() => {
    socket.current = io('https://ntkieen.site:4001/relay', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.current.on('connect', () => {
      setStatus('Connected to signaling server');
    });

    socket.current.on('disconnect', () => {
      setStatus('Disconnected from signaling server');
      handleHangUp();
    });

    socket.current.on('connect_error', (error) => {
      setStatus(`Connection error: ${error.message}`);
    });

    socket.current.on('relayRtc', async (message) => {
      // const data = JSON.parse(await message.data);
      console.log('Message received:', message);
      if (message.type === 'offer') {
        await handleOffer(message);
      } else if (message.type === 'candidate') {
        await handleCandidate(message.candidate);
      }
    });

    socket.current.on('relayNotOnline', () => {
      setStatus('Relay is not online');
    });
  }, [handleCandidate, handleHangUp, handleOffer]);

  return (
    <MainLayout title={t(i18nKeys.bottomTab.dashboard)}>
      <Box p={4} style={styles.container}>
        <Box
          position="relative"
          style={styles.video}
          justifyItems="center"
          alignItems={'center'}
        >
          {remoteStream && (
            <RTCView
              streamURL={remoteStream.toURL()}
              style={{ width: '100%', height: '100%' }}
              objectFit="cover"
            />
          )}
          {spinning && <Spinner size="lg" style={styles.spinner} />}
        </Box>

        <Text fontSize="md">{status}</Text>

        <Row mt="auto" space={4}>
          <Button
            flex={1}
            onPress={handleStartBtn}
            disabled={startBtnDisabled}
            isDisabled={startBtnDisabled}
          >
            Start
          </Button>

          <Button
            colorScheme="secondary"
            flex={1}
            onPress={handleHangUp}
            disabled={stopBtnDisabled}
            isDisabled={stopBtnDisabled}
          >
            Stop
          </Button>
        </Row>
      </Box>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  video: {
    width: '100%',
    aspectRatio: 16 / 9,
  },

  spinner: {
    position: 'absolute',
    zIndex: 1,
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12.5 }, { translateY: -12.5 }],
  },
});

export default DashboardScreen;
