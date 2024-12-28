import { Box, Text } from 'native-base';
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type SegmentedControlProps = {
  options: { label?: string; value: string; icons?: React.JSX.Element }[];
  selectedOption: string;
  onOptionPress?: (option: string) => void;
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const AnimatedBox = Animated.createAnimatedComponent(Box);

export const SegmentedControl: React.FC<SegmentedControlProps> = React.memo(
  ({ options, selectedOption, onOptionPress }) => {
    const { width: windowWidth } = useWindowDimensions();

    const internalPadding = 20;
    const segmentedControlWidth = useSharedValue(windowWidth);

    const itemWidthStyle = useAnimatedStyle(() => {
      return {
        width: (segmentedControlWidth.value - internalPadding) / options.length,
      };
    });

    const rStyle = useAnimatedStyle(() => {
      const itemWidth =
        (segmentedControlWidth.value - internalPadding) / options.length;
      return {
        left: withTiming(
          itemWidth *
            options.findIndex((option) => option.value === selectedOption) +
            internalPadding / 2,
        ),
      };
    }, [selectedOption, options]);

    return (
      <Box
        onLayout={(event) => {
          segmentedControlWidth.value = event.nativeEvent.layout.width;
        }}
        shadow={1}
        bgColor="white"
        style={[
          styles.container,
          {
            width: '100%',
            borderRadius: 15,
            paddingLeft: internalPadding / 2,
          },
        ]}
      >
        <AnimatedBox
          bgColor="muted.200"
          style={[itemWidthStyle, rStyle, styles.activeBox]}
        />
        {options.map((option, index) => {
          return (
            <AnimatedTouchable
              onPress={() => {
                onOptionPress?.(option.value);
              }}
              key={index}
              style={[itemWidthStyle, styles.labelContainer]}
            >
              {option.label && <Text style={styles.label}>{option.label}</Text>}

              {option.icons && option.icons}
            </AnimatedTouchable>
          );
        })}
      </Box>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    minHeight: 55,
  },
  activeBox: {
    position: 'absolute',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    elevation: 3,
    minHeight: '80%',
    top: '10%',
  },
  labelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'SF-Compact-Rounded-Medium',
    fontSize: 16,
    textAlign: 'center',
  },
});
