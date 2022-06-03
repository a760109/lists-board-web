import React, { useCallback, useState, useContext } from 'react';
import AlertActions from './AlertActions';
import Alert from './Alert';

const initialState = {
  open: false,
  text: '',
  title: '',
};

const Context = React.createContext();

export function useAlert() {
  return useContext(Context);
}

export default function AlertProvider({ children }) {
  const [alertProps, setAlertProps] = useState(initialState);

  const onClose = useCallback((event, reason) => {
    setAlertProps(alertProps => {
      if (reason === 'backdropClick' && alertProps.preventBackdropClick) {
        return alertProps;
      }
      return {
        ...alertProps,
        open: false,
      };
    });
  }, []);

  const asyncAlert = useCallback((text, title = '', actions = AlertActions.YES | AlertActions.NO, opt = {}) => {
    return new Promise(resolve => {
      const onAction = action => {
        const yes = action === AlertActions.YES || action === AlertActions.OK;
        resolve(yes);
      };
      setAlertProps({
        open: true,
        text,
        title,
        actions,
        onAction,
        preventBackdropClick: opt.preventBackdropClick ?? false,
      });
    });
  }, []);

  return (
    <Context.Provider value={asyncAlert}>
      {children}
      <Alert {...alertProps} onClose={onClose} />
    </Context.Provider>
  );
}
