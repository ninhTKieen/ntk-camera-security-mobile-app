import { ViewStyle, requireNativeComponent } from 'react-native';

interface RTSPVideoComponentProps {
  style?: ViewStyle;
  source: {
    uri: string;
  };
  paused?: boolean;
  onError?: (event: { nativeEvent: { error: string } }) => void;
  onLoad?: () => void;
}

export const RTSPVideoComponent =
  requireNativeComponent<RTSPVideoComponentProps>('RTSPVideoView');
