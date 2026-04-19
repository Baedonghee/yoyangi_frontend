/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Alert from 'components/UI/Alert';
import ModalContainer from 'components/UI/ModalContainer';

interface IAlert {
  open: boolean;
  type: 'check' | 'error' | 'warning' | 'info' | 'success';
  alertType: 'alert' | 'confirm';
  title: string;
  description?: string;
  confirmText: string;
  onConfirm?: () => void;
  onClose?: () => void;
}

interface IAlertContext {
  alert: IAlert;
  handleShowAlert: ({
    type,
    title,
    alertType,
    description,
    confirmText,
  }: {
    type?: 'check' | 'error' | 'warning' | 'info' | 'success';
    alertType?: 'alert' | 'confirm';
    title?: string;
    description?: string;
    confirmText?: string;
    onConfirm?: () => void;
    onClose?: () => void;
  }) => void;
  handleClose: () => void;
}

const AlertContext = createContext<IAlertContext | undefined>(undefined);

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}

export function AlertProvider({ children }: React.PropsWithChildren<any>) {
  const { pathname } = useLocation();
  useEffect(() => {
    handleClose();
  }, [pathname]);

  const [alert, setAlert] = useState<IAlert>({
    open: false,
    type: 'check',
    alertType: 'alert',
    title: '알림',
    description: '',
    confirmText: '확인',
    onConfirm: () => {},
    onClose: undefined,
  });

  const handleShowAlert = ({
    type = 'check',
    title = '알림',
    alertType = 'alert',
    description,
    confirmText = '확인',
    onConfirm,
    onClose,
  }: {
    type?: 'check' | 'error' | 'warning' | 'info' | 'success';
    alertType?: 'alert' | 'confirm';
    title?: string;
    description?: string;
    confirmText?: string;
    onConfirm?: () => void;
    onClose?: () => void;
  }) => {
    setAlert({
      open: true,
      type,
      alertType,
      title,
      description,
      confirmText,
      onConfirm,
      onClose,
    });
  };

  const handleClose = () => {
    if (alert.onClose) {
      alert.onClose();
    }
    setAlert({
      open: false,
      type: 'check',
      alertType: 'alert',
      title: '',
      description: '',
      confirmText: '확인',
      onConfirm: undefined,
      onClose: undefined,
    });
  };

  const handleConfirm = () => {
    if (alert.onConfirm) {
      alert.onConfirm();
    } else {
      handleClose();
    }
  };

  const contextValue: IAlertContext = {
    alert,
    handleShowAlert,
    handleClose,
  };

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      {alert?.open && (
        <ModalContainer onClose={handleClose}>
          <Alert
            title={alert.title}
            type={alert.type}
            alertType={alert.alertType}
            description={alert.description}
            confirmText={alert.confirmText}
            onClose={handleClose}
            onConfirm={handleConfirm}
          />
        </ModalContainer>
      )}
    </AlertContext.Provider>
  );
}
