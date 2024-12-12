import { i18nKeys } from '@src/configs/i18n';
import { Box, Button, Row, Text } from 'native-base';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

const { width } = Dimensions.get('window');

export type TConfirmationModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onBtnConfirm?: () => void;
  onBtnCancel?: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

export const ConfirmationModal = memo(
  ({
    isVisible,
    onClose,
    onBtnConfirm,
    onBtnCancel,
    title,
    description,
    confirmText,
    cancelText,
  }: TConfirmationModalProps) => {
    const { t } = useTranslation();

    return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={() => {
          onClose();
        }}
        animationInTiming={500}
        animationOutTiming={500}
      >
        <Box style={styles.container}>
          <Text fontWeight="bold" fontSize="xl" color="primary.700">
            {title || t(i18nKeys.common.warning)}
          </Text>

          <Text mt={2} style={styles.description}>
            {description || t(i18nKeys.common.confirmText)}
          </Text>

          <Row space={3} mt={4}>
            <Button
              onPress={() => {
                onBtnCancel && onBtnCancel();
                onClose();
              }}
              variant="outline"
              flex={1}
            >
              {cancelText || t(i18nKeys.common.cancel)}
            </Button>

            <Button
              onPress={() => {
                onBtnConfirm && onBtnConfirm();
                onClose();
              }}
              flex={1}
            >
              {confirmText || t(i18nKeys.common.confirm)}
            </Button>
          </Row>
        </Box>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: width * 0.84,
    borderRadius: 15,
    alignItems: 'center',
    padding: 10,
    paddingVertical: 20,
    alignSelf: 'center',
  },

  title: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
    // color: Colors.neroGrey,
  },

  description: {
    fontSize: 14,
    // color: Colors.neroGrey,
    textAlign: 'center',
  },

  otpPinWrapper: {
    width: '60%',
    marginTop: 10,
    alignSelf: 'center',
  },

  textBtn: {
    fontSize: 14,
    // color: Colors.white,
  },

  btnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },

  //   outlineBtn: {
  //     backgroundColor: Colors.white,
  //     width: '48%',
  //     justifyContent: 'center',
  //     borderRadius: 10,
  //     borderColor: Colors.primary,
  //     borderWidth: 1,
  //   },

  //   confirmBtn: {
  //     backgroundColor: Colors.primary,
  //     width: '48%',
  //     justifyContent: 'center',
  //     borderRadius: 10,
  //   },
});
