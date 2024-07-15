import { Box, Text } from 'native-base';
import React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

type TMainLayoutProps = {
  children: React.ReactNode;
  title: string;
  right?: JSX.Element;
  styleTitleWrapper?: StyleProp<ViewStyle>;
  styleTitle?: StyleProp<TextStyle>;
};

const MainLayout = (props: TMainLayoutProps) => {
  return (
    <Box h="full" flex={1}>
      <Box
        flexDir="row"
        p={2}
        bgColor="white"
        h="16"
        alignItems="center"
        justifyContent="space-between"
        style={[props.styleTitleWrapper]}
      >
        <Text fontSize="3xl" fontWeight="bold" style={[props.styleTitle]}>
          {props.title}
        </Text>

        {props.right ? props.right : <Box />}
      </Box>

      {props.children}
    </Box>
  );
};

export default MainLayout;
