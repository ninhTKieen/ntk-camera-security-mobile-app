import { useNavigation } from '@react-navigation/native';
import { Box, Text } from 'native-base';
import React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

import IconGeneral from './icon-general';

type TSubLayoutProps = {
  children: React.ReactNode;
  title: string;
  right?: JSX.Element;
  styleTitleWrapper?: StyleProp<ViewStyle>;
  styleTitle?: StyleProp<TextStyle>;
  notGoBack?: boolean;
};

const SubLayout = (props: TSubLayoutProps) => {
  const navigation = useNavigation();

  return (
    <Box h="full" flex={1}>
      <Box
        flexDir="row"
        p={4}
        bgColor="white"
        h="16"
        alignItems="center"
        justifyContent="space-between"
        style={[props.styleTitleWrapper]}
      >
        {!props.notGoBack ? (
          <IconGeneral
            type="Ionicons"
            name="chevron-back"
            size={25}
            onPress={() => navigation.goBack()}
          />
        ) : (
          <Box />
        )}
        <Text
          flex={1}
          textAlign="center"
          fontSize="xl"
          fontWeight="semibold"
          style={[props.styleTitle]}
        >
          {props.title}
        </Text>

        {props.right ? props.right : <Box />}
      </Box>

      {props.children}
    </Box>
  );
};

export default SubLayout;
