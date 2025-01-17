import { SvgIcon } from '@src/components/svg-icons';
import { useTheme } from 'native-base';
import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export type TDirection = 'up' | 'right' | 'left' | 'down' | 'stop';

type TProps = {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  handleControl: (direction: TDirection) => void;
  handleControlStream: (isPlaying: boolean) => void;
  disabled?: boolean;
};

const DIRECTIONS: TDirection[] = ['up', 'right', 'left', 'down'];

const DirectionControlButton = ({
  direction,
  handleControl,
  disabled,
}: {
  direction: 'up' | 'right' | 'left' | 'down';
  handleControl: (direction: TDirection) => void;
  disabled?: boolean;
}) => {
  const mapDirectionToDeg = {
    up: '-45deg',
    right: '45deg',
    left: '-135deg',
    down: '135deg',
  };
  const mapDirectionToBorderRadius = {
    up: { borderTopLeftRadius: 90 },
    right: { borderTopRightRadius: 90 },
    left: { borderBottomLeftRadius: 90 },
    down: { borderBottomRightRadius: 90 },
  };

  const positionStyles: { [key in TDirection]: ViewStyle } = {
    up: { bottom: 0, right: 0, position: 'absolute' },
    right: { bottom: 0, left: 0, position: 'absolute' },
    down: { top: 0, left: 0, position: 'absolute' },
    left: { top: 0, right: 0, position: 'absolute' },
    stop: {},
  };

  const theme = useTheme();

  return (
    <Pressable
      onPressIn={() => {
        handleControl(direction);
      }}
      onPressOut={() => {
        handleControl('stop');
      }}
      disabled={disabled}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.button,
            {
              backgroundColor: pressed ? theme.colors.primary[200] : '#FFFFFF',
            },
            mapDirectionToBorderRadius[direction],
          ]}
        >
          <SvgIcon
            name="arrow-up-filled"
            style={{
              transform: [{ rotate: mapDirectionToDeg[direction] }],
            }}
            color="#00000073"
          />

          <View
            style={[
              styles.innerCircle,
              {
                backgroundColor: pressed
                  ? theme.colors.primary[200]
                  : '#FFFFFF',
              },
              mapDirectionToBorderRadius[direction],
              positionStyles[direction],
            ]}
          />
        </View>
      )}
    </Pressable>
  );
};

export const DirectionsControl = ({
  isPlaying,
  setIsPlaying,
  handleControl,
  handleControlStream,
  disabled,
}: TProps) => {
  return (
    <View style={styles.directionControlButtonContainer}>
      <View style={styles.stopButton}>
        <Pressable
          style={[styles.stopButtonInner, styles.shadowStopBtn]}
          onPress={() => {
            if (isPlaying) {
              handleControlStream(true);
              setIsPlaying(false);
            } else {
              handleControlStream(false);
              setIsPlaying(true);
            }
          }}
        >
          <LinearGradient
            colors={['#FAFAFA', '#F0F0F0']}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 999,
              justifyContent: 'center',
              alignItems: 'center',
              transform: [{ rotate: '-45deg' }],
            }}
          >
            <SvgIcon name={isPlaying ? 'pause' : 'play'} color="#000" />
          </LinearGradient>
        </Pressable>
      </View>

      {DIRECTIONS.map((direction) => (
        <DirectionControlButton
          key={direction}
          direction={direction as any}
          handleControl={handleControl}
          disabled={disabled}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  directionControlButtonContainer: {
    marginTop: 20,
    width: 180,
    height: 180,
    borderRadius: 90,
    flexDirection: 'row',
    flexWrap: 'wrap',
    transform: [{ rotate: '45deg' }],
    backgroundColor: '#FFF',
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 86,
    width: 86,
    borderWidth: 1,
    borderColor: '#00000026',
    margin: 2,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    height: 38,
    width: 38,
    borderWidth: 1,
    borderColor: '#00000026',
  },
  stopButton: {
    width: 81,
    height: 81,
    zIndex: 999,
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    padding: 8,
  },
  stopButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
  shadowStopBtn: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 4,
  },
});
