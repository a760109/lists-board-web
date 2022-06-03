import * as React from 'react';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import { FormProvider, useForm } from 'react-hook-form';
import FormTextField from 'app/widgets/Form/FormTextField';
import FormSelectField from 'app/widgets/Form/FormSelectField';
import { yupResolver } from '@hookform/resolvers/yup';
import MenuItem from '@mui/material/MenuItem';
import * as yup from 'yup';
import _ from 'lodash';

const schema = yup.object({
  name: yup.string().max(320).required(),
  scope: yup.string().max(7).required(),
});

function getDefaultValues(data = {}) {
  return {
    id: data.id ?? null,
    name: data.name ?? 'Task Name',
    descriptions: data.descriptions ?? '',
    scope: data.scope ?? 'private',
    releaseAccount: data.releaseAccount ?? [],
  };
}

function TaskInfoDialog({ open, data, onClose, onSubmitted }) {
  const form = useForm({
    mode: 'onChange',
    defaultValues: getDefaultValues(data),
    resolver: yupResolver(schema),
  });

  React.useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(data));
    }
  }, [open, data]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>New Task</DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <FormProvider {...form}>
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
        <Button color='secondary' onClick={form.handleSubmit(onSubmitted)}>
          {data && _.isNumber(data.id) ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TaskInfoDialog;
