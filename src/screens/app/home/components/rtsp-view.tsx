import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SvgIcon } from '@src/components/svg-icons';
import { APP_API_ENDPOINT, RCT_CONFIGS } from '@src/configs/constant';
import { THomeStackParamList } from '@src/configs/routes/home.route';
import { Box, IconButton, Row, Spinner, Text, useTheme } from 'native-base';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native-reanimated/lib/typescript/Animated';
import {
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCView,
} from 'react-native-webrtc';
import { useEffectOnce } from 'react-use';
import { Socket, io } from 'socket.io-client';

import { DirectionsControl, TDirection } from './directions-control';

interface IProps {
  deviceId: number;
  relayId: string;
  rtsp: string;
  saveFileToLibrary?: () => void;
  handleVideoProgress?: () => void;
}

export type RtspViewRef = {
  rctView: React.RefObject<View>;
  requestRef: React.MutableRefObject<number | null>;
};

export const RTSPView = forwardRef<RtspViewRef, IProps>(
  (
    { deviceId, relayId, rtsp, saveFileToLibrary, handleVideoProgress },
    ref,
  ) => {
    const navigation =
      useNavigation<StackNavigationProp<THomeStackParamList, 'DeviceDetail'>>();
    const isFocused = useIsFocused();
    const theme = useTheme();

    const socket = useRef<Socket | null>(null);
    const videoRef = useRef<View>(null);
    const requestRef = useRef<number | null>(null);

    useImperativeHandle(ref, () => ({
      rctView: videoRef,
      requestRef,
    }));

    const pc = useRef<RTCPeerConnection | null>(null);

    const [startBtnDisabled, setStartBtnDisabled] = useState(false);
    const [spinning, setSpinning] = useState(false);
    const [status, setStatus] = useState<string | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

    const createPeerConnection = () => {
      try {
        pc.current = new RTCPeerConnection(RCT_CONFIGS);

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
      } catch (error) {
        console.log('Error creating peer connection:', error);
      }
    };

    const handleHangUp = useCallback(() => {
      console.log('hang up');
      socket.current?.emit('disconnectStream');

      if (pc.current) {
        pc.current.close();
        pc.current = null;
      }
      setStartBtnDisabled(false);
      setRemoteStream(null);
      setSpinning(false);
      setStatus('Disconnected');
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
        console.log('Added ICE candidate:', candidate);
        await pc.current?.addIceCandidate(new RTCIceCandidate(candidate));
        console.log('Added ICE candidate successfully');
        setStatus('Added ICE candidate');
      } catch (error) {
        setStatus('Error adding ICE candidate');
        console.error('Error adding ICE candidate:', error);
      }
    }, []);

    const handleStartBtn = useCallback(() => {
      if (pc.current) {
        return;
      }
      setStartBtnDisabled(true);
      setSpinning(true);
      socket.current = io(`${APP_API_ENDPOINT}/relay`, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      socket.current.on('connect', () => {
        setStatus('Connected to signaling server');
        // handleStartBtn();
      });

      socket.current.on('disconnect', () => {
        setStatus('Disconnected from signaling server');
        if (pc.current) {
          handleHangUp();
        }
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
      try {
        setStartBtnDisabled(true);
        console.log('Requesting stream...');
        setStatus('Requesting stream...');
        createPeerConnection();
        socket.current?.emit('requestStream', {
          relayId,
          rtsp,
        });
      } catch (error) {
        console.error('Error creating peer connection:', error);
        setStatus('Error creating peer connection');
        setStartBtnDisabled(false);
      }
    }, [handleCandidate, handleHangUp, handleOffer, relayId, rtsp]);

    const handlePtzCommand = useCallback(
      (direction: TDirection) => {
        socket.current?.emit('ptzCommand', {
          relayId,
          command: direction,
          speed: 0.5,
          rtsp,
        });
      },
      [relayId, rtsp],
    );

    useEffect(() => {
      if (!isFocused) {
        handleHangUp();
      }
    }, [handleHangUp, isFocused]);

    useEffectOnce(() => {
      handleStartBtn();
    });

    useEffect(() => {
      if (remoteStream) {
        if (handleVideoProgress) {
          requestRef.current = requestAnimationFrame(handleVideoProgress);
        }
      }

      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    }, [remoteStream, handleVideoProgress]);

    return (
      <Box>
        <Box
          position="relative"
          style={styles.video}
          ref={videoRef}
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

        <Row space="10" mt="4">
          <IconButton
            size="lg"
            _icon={{
              as: () => (
                <SvgIcon
                  name={
                    startBtnDisabled
                      ? 'pause-circle-outlined'
                      : 'play-circle-outlined'
                  }
                  color={theme.colors.primary[700]}
                />
              ),
            }}
            onPress={() => {
              if (startBtnDisabled) {
                handleHangUp();
              } else {
                handleStartBtn();
              }
            }}
          />

          <IconButton
            size="lg"
            _icon={{
              as: () => (
                <SvgIcon
                  name={'upload-image'}
                  color={theme.colors.primary[700]}
                />
              ),
            }}
            onPress={() => {
              startBtnDisabled && saveFileToLibrary && saveFileToLibrary();
            }}
            disabled={!startBtnDisabled}
          />

          <IconButton
            size="lg"
            _icon={{
              as: () => (
                <SvgIcon
                  name={'multiple-image'}
                  color={theme.colors.primary[700]}
                />
              ),
            }}
            onPress={() => {
              navigation.navigate('HumanDetectionImages', {
                deviceId,
              });
            }}
          />
        </Row>

        <Box alignSelf="center" mt={4}>
          <DirectionsControl
            handleControl={handlePtzCommand}
            handleControlStream={() => {
              if (startBtnDisabled) {
                handleHangUp();
              } else {
                handleStartBtn();
              }
            }}
            disabled={!startBtnDisabled}
            isPlaying={startBtnDisabled}
            setIsPlaying={setStartBtnDisabled}
          />
        </Box>

        <Text
          style={{
            position: 'absolute',
            bottom: -30,
            right: 0,
          }}
          fontSize="xs"
          display={__DEV__ ? 'flex' : 'none'}
        >
          {status}
        </Text>
      </Box>
    );
  },
);

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
