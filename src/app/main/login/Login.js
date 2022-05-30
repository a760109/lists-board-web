import { useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useAuth0 } from '@auth0/auth0-react';

export default function Login() {
  const userData = useSelector(({ auth }) => auth.user.userData);
  const { logout } = useAuth0();

  return (
    <div>
      <Box
        component='form'
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete='off'
      >
        <TextField disabled label='Account' value={userData.account} variant='outlined' />
        <TextField disabled label='Name' value={userData.name} variant='outlined' />
        <TextField disabled label='Number of times logged in' value={userData.times} variant='outlined' />
      </Box>
      <Button
        variant='contained'
        onClick={() => {
          logout({
            returnTo: `${window.location.origin}`,
          });
        }}
      >
        Logout
      </Button>
    </div>
  );
}
