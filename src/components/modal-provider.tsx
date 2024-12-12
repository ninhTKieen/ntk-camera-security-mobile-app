import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

import {
  ConfirmationModal,
  TConfirmationModalProps,
} from './confirmation-modal';

type TOpenConfirmationModal = Omit<
  TConfirmationModalProps,
  'onClose' | 'isVisible'
>;

type TModalContext = {
  openConfirmationModal: (params: TOpenConfirmationModal) => void;
  closeConfirmationModal: () => void;
};

export const ModalContext = createContext<TModalContext | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return context;
};

const initialConfirmationModalProps: TOpenConfirmationModal = {
  onBtnConfirm: () => {},
  onBtnCancel: () => {},
  title: '',
  description: '',
  confirmText: '',
  cancelText: '',
};

type ModalProviderProps = {
  children: ReactNode;
};

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [confirmModalProps, setConfirmModalProps] = useState<
    TOpenConfirmationModal & { isVisible: boolean }
  >({
    ...initialConfirmationModalProps,
    isVisible: false,
  });

  const closeConfirmationModal = useCallback(() => {
    setConfirmModalProps((prev) => ({
      ...prev,
      ...initialConfirmationModalProps,
      isVisible: false,
    }));
  }, []);

  const openConfirmationModal = useCallback(
    (params: TOpenConfirmationModal) => {
      setConfirmModalProps((prev) => ({
        ...prev,
        ...params,
        isVisible: true,
      }));
    },
    [],
  );

  return (
    <ModalContext.Provider
      value={{
        openConfirmationModal,
        closeConfirmationModal,
      }}
    >
      {children}
      <ConfirmationModal
        {...confirmModalProps}
        onClose={closeConfirmationModal}
      />
    </ModalContext.Provider>
  );
};
