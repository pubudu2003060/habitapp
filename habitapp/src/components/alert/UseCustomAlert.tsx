import { useState, useCallback } from 'react';
import { AlertButton, AlertConfig } from '../../types/Types';

const useCustomAlert = () => {
  const [alertConfig, setAlertConfig] = useState<AlertConfig & { visible: boolean }>({
    visible: false,
    title: '',
    message: '',
    buttons: [],
  });
  
  const showAlert = useCallback((title?: string, message?: string, buttons?: AlertButton[]) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      buttons: buttons || [{ text: 'OK' }],
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  }, []);

  return {
    alertConfig,
    showAlert,
    hideAlert,
  };
};

export default useCustomAlert;