import MessageSentModal from '@src/components/message-modal';
import {
  ModalOptions,
  ModalStackConfig,
  createModalStack,
} from 'react-native-modalfy';

const modalConfig: ModalStackConfig = { MessageSentModal };
const defaultOptions: ModalOptions = { backdropOpacity: 0.6 };

export type TModalStackParams = {
  MessageSentModal: { message: string };
};
export const modalStack = createModalStack(modalConfig, defaultOptions);
