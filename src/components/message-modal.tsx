import React from 'react';
import { Button, Text, View } from 'react-native';
import { ModalProps } from 'react-native-modalfy';

type TMessageSentModalProps = {
  message: string;
};

type TProps = ModalProps<'MessageSentModal', TMessageSentModalProps>;

const MessageSentModal = (props: TProps) => {
  const { modal, message } = props;
  const { closeModal } = modal;

  return (
    <View style={{ backgroundColor: '#FFF' }}>
      <Text>Your message is {message}</Text>
      <Text>Your message was sent!</Text>
      <Button
        onPress={() => {
          closeModal();
        }}
        title="OK"
      />
    </View>
  );
};

export default MessageSentModal;
