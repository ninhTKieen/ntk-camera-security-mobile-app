import { Spinner } from 'native-base';
import { Modal } from 'native-base';
import React from 'react';

const LoadingModal = ({ isVisible }: { isVisible: boolean }): JSX.Element => {
  return (
    <Modal
      style={{
        margin: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      isOpen={isVisible}
    >
      <Modal.Content h="32" w="32" justifyContent="center" alignItems="center">
        <Spinner size="lg" />
      </Modal.Content>
    </Modal>
  );
};

export default LoadingModal;
