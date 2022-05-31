import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import { FormProvider, useForm } from 'react-hook-form';
import FormTextField from 'app/widgets/FormTextField';
import FormSelectField from 'app/widgets/FormSelectField';
import { yupResolver } from '@hookform/resolvers/yup';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().max(320).required(),
  scope: yup.string().max(7).required(),
});

function getDefaultValues(data = {}) {
  return {
    name: 'Task Name',
    scope: 'private',
  };
}

function TaskInfoDialog({ open, data, onClose, onCreate }) {
  const methods = useForm({
    mode: 'onBlur',
    defaultValues: getDefaultValues(data),
    resolver: yupResolver(schema),
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>New Task</DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <FormProvider {...methods}>
            <Grid item xs={12} sx={{ mt: 1 }}>
              <FormTextField label='Name' name='name' />
            </Grid>
            <Grid item xs={12} sx={{ mt: 1 }}>
              <FormSelectField label='Scope' name='scope'>
                <MenuItem value={'private'}>Private</MenuItem>
                <MenuItem value={'public'}>Public</MenuItem>
              </FormSelectField>
            </Grid>
          </FormProvider>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color='secondary' onClick={methods.handleSubmit(onCreate)}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TaskInfoDialog;
