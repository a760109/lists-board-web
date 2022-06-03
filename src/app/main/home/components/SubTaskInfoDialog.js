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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import * as yup from 'yup';
import _ from 'lodash';

const schema = yup.object({
  name: yup.string().max(320).required(),
  descriptions: yup.string().nullable(true),
  price: yup.number().required(),
  cost: yup.number().required(),
  status: yup.string().required(),
  taskId: yup.number().required(),
});

function getDefaultValues(data = {}) {
  return {
    taskId: data.taskId,
    name: data.name ?? 'Subtask Name',
    descriptions: data.descriptions ?? '',
    price: data.price ?? 0,
    cost: data.cost ?? 0,
    status: data.status ?? 'pending',
  };
}

function SubTaskInfoDialog({ open, data, onClose, onSubmitted }) {
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
      <DialogTitle>New Subtask</DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <FormProvider {...form}>
            <Grid item xs={12} sx={{ mt: 1 }}>
              <FormTextField label='Name' name='name' />
            </Grid>
            <Grid item xs={12} sx={{ mt: 1 }}>
              <FormTextField label='Descriptions' name='descriptions' />
            </Grid>
            <Grid item xs={12} sx={{ mt: 1 }}>
              <FormTextField label='Price' name='price' />
            </Grid>
            <Grid item xs={12} sx={{ mt: 1 }}>
              <FormTextField label='Cost' name='cost' />
            </Grid>
            <Grid item xs={12} sx={{ mt: 1 }}>
              <FormSelectField label='Status' name='status'>
                <MenuItem value={'pending'}>Pending</MenuItem>
                <MenuItem value={'done'}>Done</MenuItem>
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

export default SubTaskInfoDialog;
