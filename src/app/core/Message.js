import { amber, blue, green } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import Typography from '@mui/material/Typography';
import { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage, hideMessage } from 'app/store/messageSlice';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import Grid from '@mui/material/Grid';

const StyledSnackbar = styled(Snackbar)(({ theme, variant }) => ({
  '& .Message-content': {
    ...(variant === 'success' && {
      backgroundColor: green[600],
      color: '#FFFFFF',
    }),

    ...(variant === 'error' && {
      backgroundColor: theme.palette.error.dark,
      color: theme.palette.getContrastText(theme.palette.error.dark),
    }),

    ...(variant === 'info' && {
      backgroundColor: blue[600],
      color: '#FFFFFF',
    }),

    ...(variant === 'warning' && {
      backgroundColor: amber[600],
      color: '#FFFFFF',
    }),
  },
}));

function Message(props) {
  const dispatch = useDispatch();
  const state = useSelector(({ message }) => message.state);
  const options = useSelector(({ message }) => message.options);

  // handle axios messages
  useEffect(() => {
    const id = axios.interceptors.response.use(null, err => {
      if (!axios.isAxiosError(err) || !err.response) {
        dispatch(
          showMessage({
            message: err.message,
            variant: 'error',
          }),
        );
      } else {
        dispatch(
          showMessage({
            message: err.response.data.msg,
            variant: 'error',
          }),
        );
      }

      throw err;
    });

    return () => {
      axios.interceptors.response.eject(id);
    };
  }, []);

  return (
    <StyledSnackbar
      {...options}
      open={state}
      onClose={() => dispatch(hideMessage())}
      ContentProps={{
        variant: 'body2',
        headlineMapping: {
          body1: 'div',
          body2: 'div',
        },
      }}
    >
      <SnackbarContent
        className='Message-content'
        message={
          <Grid container direction='row' alignItems='center' spacing={0}>
            <Grid item>
              <IconButton>
                {options.variant === 'success' && <CheckCircleIcon sx={{ backgroundColor: green[600], color: '#FFFFFF' }} />}
                {options.variant === 'warning' && <WarningIcon sx={{ backgroundColor: amber[600], color: '#FFFFFF' }} />}
                {options.variant === 'error' && <ErrorIcon sx={{ backgroundColor: green[600], color: '#FFFFFF' }} />}
                {options.variant === 'info' && <InfoIcon sx={{ backgroundColor: blue[600], color: '#FFFFFF' }} />}
              </IconButton>
            </Grid>
            <Grid item>
              <Typography className='mx-8'>{options.message}</Typography>
            </Grid>
          </Grid>
        }
        action={[
          <IconButton key='close' aria-label='Close' color='inherit' onClick={() => dispatch(hideMessage())} size='large'>
            <CloseIcon />
          </IconButton>,
        ]}
      />
    </StyledSnackbar>
  );
}

export default memo(Message);
