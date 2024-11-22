import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import IconGeneral from '@src/components/icon-general';
import { i18nKeys } from '@src/configs/i18n';
import { THomeStackParamList } from '@src/configs/routes/home.route';
import { Box, Divider, Pressable, Stack, Text, useTheme } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';

type TAddMemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateDeviceModal = ({ isOpen, onClose }: TAddMemberModalProps) => {
  const navigation =
    useNavigation<StackNavigationProp<THomeStackParamList, 'Home'>>();
  const { t } = useTranslation();

  const theme = useTheme();

  return (
    <Modal
      isVisible={isOpen}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      swipeDirection={['down', 'up', 'left', 'right']}
      onSwipeComplete={onClose}
      style={{}}
    >
      <Box bg="white" p={2} width="5/6" alignSelf="center" borderRadius="2xl">
        <Text fontSize="16" fontWeight="bold" textAlign="center" py={2}>
          {t(i18nKeys.devices.create)}
        </Text>

        <Pressable alignSelf="center" onPress={() => {}}>
          {({ isPressed }) => (
            <Stack
              style={{
                opacity: isPressed ? 0.5 : 1,
              }}
              space={4}
              p={4}
              direction="row"
              alignItems="center"
            >
              <Box bg="gray.200" borderRadius="full" p={2}>
                <IconGeneral
                  type="AntDesign"
                  name="wifi"
                  size={20}
                  color={theme.colors.primary[600]}
                />
              </Box>
              <Text fontWeight="semibold" fontSize="lg" color="primary.600">
                {t(i18nKeys.devices.scanAuto)}
              </Text>
            </Stack>
          )}
        </Pressable>

        <Stack space={2} alignItems="center" direction="row" m="2">
          <Divider
            alignSelf="center"
            _light={{
              bg: 'gray.200',
            }}
            _dark={{
              bg: 'muted.50',
            }}
            flex={1}
          />

          <Text fontSize="16" fontWeight="400" textAlign="center">
            {t(i18nKeys.common.or)}
          </Text>

          <Divider
            alignSelf="center"
            _light={{
              bg: 'gray.200',
            }}
            _dark={{
              bg: 'muted.50',
            }}
            flex={1}
          />
        </Stack>

        <Pressable
          alignSelf="center"
          onPress={() => {
            navigation.navigate('AddDeviceManual');
            onClose();
          }}
        >
          {({ isPressed }) => (
            <Stack
              style={{
                opacity: isPressed ? 0.5 : 1,
              }}
              space={4}
              p={4}
              direction="row"
              alignItems="center"
            >
              <Box bg="gray.200" borderRadius="full" p={2}>
                <IconGeneral
                  type="MaterialCommunityIcons"
                  name="progress-wrench"
                  size={20}
                  color={theme.colors.primary[600]}
                />
              </Box>
              <Text fontWeight="semibold" fontSize="lg" color="primary.600">
                {t(i18nKeys.devices.addManual)}
              </Text>
            </Stack>
          )}
        </Pressable>
      </Box>
    </Modal>
  );
};

export default CreateDeviceModal;
