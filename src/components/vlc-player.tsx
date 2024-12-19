import React, { useCallback, useRef } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  ViewStyle,
  requireNativeComponent,
} from 'react-native';

interface VLCPlayerProps {
  rate?: number;
  seek?: number;
  resume?: boolean;
  snapshotPath?: string;
  paused?: boolean;
  source: {
    uri: string;
    initOptions: string[];
    type?: string;
    mainVer?: number;
    patchVer?: number;
    initType?: number;
    hwDecoderEnabled?: number;
    hwDecoderForced?: number;
  };
  autoplay?: boolean;
  onVideoLoadStart?: (event: NativeSyntheticEvent<any>) => void;
  onVideoError?: (event: NativeSyntheticEvent<any>) => void;
  onVideoProgress?: (event: NativeSyntheticEvent<any>) => void;
  onVideoEnded?: (event: NativeSyntheticEvent<any>) => void;
  onVideoPlaying?: (event: NativeSyntheticEvent<any>) => void;
  onVideoPaused?: (event: NativeSyntheticEvent<any>) => void;
  onVideoStopped?: () => void;
  onVideoBuffering?: (event: NativeSyntheticEvent<any>) => void;
  onVideoOpen?: (event: NativeSyntheticEvent<any>) => void;
  onError?: (event: NativeSyntheticEvent<any>) => void;
  onProgress?: (event: NativeSyntheticEvent<any>) => void;
  onEnded?: (event: NativeSyntheticEvent<any>) => void;
  onStopped?: () => void;
  onPlaying?: (event: NativeSyntheticEvent<any>) => void;
  onPaused?: (event: NativeSyntheticEvent<any>) => void;
  style?: ViewStyle;
}

const RCTVLCPlayer = requireNativeComponent<any>('RCTVLCPlayer');

export const VLCPlayer: React.FC<VLCPlayerProps> = ({
  source,
  autoplay = true,
  onVideoLoadStart,
  onVideoError,
  onVideoProgress,
  onVideoEnded,
  onVideoPlaying,
  onVideoPaused,
  onVideoStopped,
  onVideoBuffering,
  onVideoOpen,
  style,
  ...rest
}) => {
  const videoRef = useRef<any>(null);

  const handleLoadStart = useCallback(
    (event: NativeSyntheticEvent<any>) => {
      onVideoLoadStart?.(event);
    },
    [onVideoLoadStart],
  );

  const handleError = useCallback(
    (event: NativeSyntheticEvent<any>) => {
      onVideoError?.(event);
    },
    [onVideoError],
  );

  const handleProgress = useCallback(
    (event: NativeSyntheticEvent<any>) => {
      onVideoProgress?.(event);
    },
    [onVideoProgress],
  );

  const handleEnded = useCallback(
    (event: NativeSyntheticEvent<any>) => {
      onVideoEnded?.(event);
    },
    [onVideoEnded],
  );

  const handlePlaying = useCallback(
    (event: NativeSyntheticEvent<any>) => {
      onVideoPlaying?.(event);
    },
    [onVideoPlaying],
  );

  const handlePaused = useCallback(
    (event: NativeSyntheticEvent<any>) => {
      onVideoPaused?.(event);
    },
    [onVideoPaused],
  );

  const handleStopped = useCallback(() => {
    onVideoStopped?.();
  }, [onVideoStopped]);

  const handleBuffering = useCallback(
    (event: NativeSyntheticEvent<any>) => {
      onVideoBuffering?.(event);
    },
    [onVideoBuffering],
  );

  const handleOpen = useCallback(
    (event: NativeSyntheticEvent<any>) => {
      onVideoOpen?.(event);
    },
    [onVideoOpen],
  );

  const uri = source.uri?.match(/^\//) ? `file://${source.uri}` : source.uri;

  const isNetwork =
    uri?.match(/^https?:/) || uri?.match(/^rtsp:/) ? true : false;
  const isAsset = uri?.match(
    /^(assets-library|file|content|ms-appx|ms-appdata):/,
  )
    ? true
    : false;

  const nativeProps = {
    ...rest,
    style: [styles.base, style],
    source: {
      ...source,
      uri,
      isNetwork,
      isAsset,
      autoplay,
      initOptions: [...(source.initOptions || []), '--input-repeat=1000'],
    },
    onVideoLoadStart: handleLoadStart,
    onVideoOpen: handleOpen,
    onVideoError: handleError,
    onVideoProgress: handleProgress,
    onVideoEnded: handleEnded,
    onVideoPlaying: handlePlaying,
    onVideoPaused: handlePaused,
    onVideoStopped: handleStopped,
    onVideoBuffering: handleBuffering,
    progressUpdateInterval: 250,
  };

  return <RCTVLCPlayer ref={videoRef} {...nativeProps} />;
};

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
