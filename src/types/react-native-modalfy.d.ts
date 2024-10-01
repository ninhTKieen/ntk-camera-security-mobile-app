import { TModalStackParams } from '@src/configs/modal/modal.config';
import 'react-native-modalfy';

declare module 'react-native-modalfy' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ModalfyCustomParams extends TModalStackParams {}
}
