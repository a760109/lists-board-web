import React, { useRef, useMemo } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import AlertActions, { Trans } from './AlertActions';

const testAction = (actions, act) => (actions >> act) % 2 !== 0;

export default function Alert({ title, text, open, actions, onAction, onClose }) {
  const refOnAction = useRef();
  const refOnClose = useRef();

  refOnAction.current = onAction;
  refOnClose.current = onClose;

  const buttons = useMemo(() => {
    return new Array(4).fill(null).map((_, act) => {
      const actValue = 1 << act;
      const isSecondary = actValue === AlertActions.YES || actValue === AlertActions.OK;

      return (
        testAction(actions, act) && (
          <Button
            key={act}
            color={isSecondary ? 'secondary' : 'primary'}
            onClick={e => {
              refOnClose.current();
              if (refOnAction.current) {
                refOnAction.current(actValue);
              }
            }}
          >
            {Trans[act]}
          </Button>
        )
      );
    });
  }, [actions]);

  return (
    <Dialog
      sx={{
        '& .MuiPaper-root': {
          minWidth: '300px',
        },
      }}
      onClose={onClose}
      open={open}
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>{buttons}</DialogActions>
    </Dialog>
  );
}
