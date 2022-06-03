import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CardHeader from '@mui/material/CardHeader';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SubTaskInfoDialog from './components/SubTaskInfoDialog';
import { getTasksData, createSubtask, updateTask, updateSubtask, deleteTask, deleteSubtask } from './store/tasksSlice';
import _ from 'lodash';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Avatar from '@mui/material/Avatar';
import TaskInfoDialog from './components/TaskInfoDialog';
import { blueGrey, green, blue } from '@mui/material/colors';
import CircularProgressWithLabel from 'app/widgets/CircularProgressWithLabel';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Tooltip from '@mui/material/Tooltip';
import { useAlert } from 'app/widgets/Alert';
import { showSuccess } from 'app/store/messageSlice';

const colorSelect = {
  tPendingButton: blueGrey[300],
  tPending: blueGrey[200],
  jPending: blueGrey[100],
  tProcessButton: green[300],
  tProcess: green[200],
  tDoneButton: blue[300],
  tDone: blue[200],
  jDone: blue[100],
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const ExpandMore = styled(props => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

function TeakMoreMenu(props) {
  const { taskId, tasksData, setSubTaskData, setTaskData } = props;

  const alert = useAlert();
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = React.useState();

  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div>
      <IconButton onClick={handleMenuOpen}>
        <MoreVertIcon fontSize='small' />
      </IconButton>
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => setSubTaskData({ taskId: parseInt(taskId) })}>Add Subtask</MenuItem>
        <MenuItem onClick={() => setTaskData({ ...tasksData[taskId] })}>Edit</MenuItem>
        <MenuItem
          onClick={async () => {
            const ok = await alert('Are you sure you want to delete?', 'Confirmation');

            if (ok) {
              dispatch(deleteTask({ id: taskId }));
              dispatch(showSuccess());
            }
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
}

function SubTeakMoreMenu(props) {
  const { jobId, onClickEdie } = props;

  const alert = useAlert();
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = React.useState();

  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div>
      <IconButton onClick={handleMenuOpen}>
        <MoreVertIcon fontSize='small' />
      </IconButton>
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={onClickEdie}>Edit</MenuItem>
        <MenuItem
          onClick={async () => {
            const ok = await alert('Are you sure you want to delete?', 'Confirmation');

            if (ok) {
              dispatch(deleteSubtask({ id: jobId }));
              dispatch(showSuccess());
            }
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
}

export default function Tasks() {
  const dispatch = useDispatch();
  const alert = useAlert();

  const [expanded, setExpanded] = React.useState({});

  const tasksData = useSelector(({ home }) => home.tasks.tasks);
  const jobsData = useSelector(({ home }) => home.tasks.jobs);

  const [subTaskData, setSubTaskData] = React.useState({});
  const [taskData, setTaskData] = React.useState({});

  React.useEffect(() => {
    dispatch(getTasksData());
  }, []);

  const handleExpandClick = taskId => {
    if (taskId in expanded) {
      expanded[taskId] = !expanded[taskId];
    } else {
      expanded[taskId] = true;
    }

    setExpanded({ ...expanded });
  };

  const handleOnCreateOrUpdate = React.useCallback(
    async data => {
      console.log(data);
      if (_.isNumber(data.id)) {
        dispatch(updateSubtask(data));
      } else {
        dispatch(createSubtask(data));
      }

      setSubTaskData({});
    },
    [dispatch],
  );

  const handleOnUpdateTask = React.useCallback(
    async data => {
      dispatch(updateTask(data));
      setTaskData({});
      setExpanded({});
    },
    [dispatch],
  );

  return (
    <Box sx={{ paddingTop: 1 }}>
      <Grid sx={{ flexGrow: 1 }} container spacing={2}>
        <Grid item xs={12}>
          <Grid container justifyContent='center' spacing={2}>
            {Object.keys(tasksData)
              .sort()
              .map(taskId => (
                <Grid item key={taskId}>
                  <Card
                    sx={{
                      width: 300,
                      backgroundColor:
                        tasksData[taskId].status === 'pending'
                          ? colorSelect.tPending
                          : tasksData[taskId].status === 'done'
                          ? colorSelect.tDone
                          : colorSelect.tProcess,
                    }}
                  >
                    <CardHeader
                      action={<TeakMoreMenu taskId={taskId} tasksData={tasksData} setSubTaskData={setSubTaskData} setTaskData={setTaskData} />}
                      title={`Task-${taskId}: ${tasksData[taskId].name}`}
                      sx={{ paddingBottom: 0, paddingLeft: 1, paddingRight: 1 }}
                      subheader={`${tasksData[taskId].account} (${capitalizeFirstLetter(tasksData[taskId].scope)})`}
                    />
                    <CardContent>
                      <Typography variant='subtitle2' color='text.secondary'>
                        This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen
                        peas along with the mussels, if you like.
                      </Typography>
                    </CardContent>
                    {taskId in jobsData && (
                      <>
                        <CardActions
                          sx={{
                            cursor: 'pointer',
                            backgroundColor:
                              tasksData[taskId].status === 'pending'
                                ? colorSelect.tPendingButton
                                : tasksData[taskId].status === 'done'
                                ? colorSelect.tDoneButton
                                : colorSelect.tProcessButton,
                          }}
                          onClick={() => handleExpandClick(taskId)}
                          disableSpacing
                        >
                          <CircularProgressWithLabel value={tasksData[taskId].progress} />
                          <Typography variant='subtitle2' sx={{ paddingLeft: 1 }}>
                            {capitalizeFirstLetter(tasksData[taskId].status)}
                          </Typography>
                          <Grid container direction='row' alignItems='center' spacing={0}>
                            <Grid item>
                              <Tooltip title='Completed Cost'>
                                <IconButton>
                                  <AttachMoneyIcon disabled fontSize='small' />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                            <Grid item>
                              <Typography variant='subtitle2'>{tasksData[taskId].doneCost}</Typography>
                            </Grid>
                          </Grid>
                          <ExpandMore expand={expanded[taskId]} disabled aria-expanded={expanded[taskId]}>
                            <ExpandMoreIcon fontSize='small' />
                          </ExpandMore>
                        </CardActions>
                        {expanded[taskId] && (
                          <CardActions>
                            <Collapse in={expanded[taskId]} timeout='auto' unmountOnExit>
                              <List
                                dense
                                disablePadding
                                sx={{
                                  width: '100%',
                                  maxHeight: 300,
                                  position: 'relative',
                                  overflow: 'auto',
                                  '& ul': { padding: 0 },
                                  padding: 0,
                                  '&::-webkit-scrollbar': {
                                    width: '0.4em',
                                  },
                                  '&::-webkit-scrollbar-track': {
                                    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                                    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                                  },
                                  '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: 'rgba(0,0,0,.1)',
                                    outline: '1px solid slategrey',
                                  },
                                }}
                              >
                                {jobsData[taskId].map(d => (
                                  <ListItem dense disableGutters key={d.id}>
                                    <Card
                                      sx={{
                                        width: 280,
                                        padding: 0,
                                        backgroundColor: d.status === 'pending' ? colorSelect.jPending : colorSelect.jDone,
                                      }}
                                    >
                                      <CardHeader
                                        avatar={
                                          <Avatar sx={{ bgcolor: 'red', width: 24, height: 24 }} aria-label='recipe'>
                                            {d.status.charAt(0).toUpperCase()}
                                          </Avatar>
                                        }
                                        action={
                                          <SubTeakMoreMenu
                                            jobId={d.id}
                                            onClickEdie={() => {
                                              setSubTaskData({ ...d });
                                            }}
                                            setSubTaskData={setSubTaskData}
                                          />
                                        }
                                        title={`${d.name}`}
                                        sx={{ paddingBottom: 0, paddingLeft: 1, paddingRight: 1 }}
                                        subheader={d.descriptions}
                                      />
                                      <CardContent sx={{ paddingBottom: 0 }}>
                                        <Typography variant='caption' display='block' gutterBottom>
                                          Creator: {d.account}
                                        </Typography>
                                        <Typography variant='caption' display='block' gutterBottom>
                                          Price: {d.price}
                                        </Typography>
                                        <Typography variant='caption' display='block' gutterBottom>
                                          Cost: {d.cost}
                                        </Typography>
                                      </CardContent>
                                      <CardActions>
                                        <Button
                                          size='small'
                                          variant='contained'
                                          disabled={d.status === 'pending'}
                                          onClick={() => {
                                            dispatch(updateSubtask({ ...d, status: 'pending' }));
                                          }}
                                        >
                                          To Pandding
                                        </Button>
                                        <Button
                                          size='small'
                                          variant='contained'
                                          disabled={d.status === 'done'}
                                          onClick={() => {
                                            dispatch(updateSubtask({ ...d, status: 'done' }));
                                          }}
                                        >
                                          To Done
                                        </Button>
                                      </CardActions>
                                    </Card>
                                  </ListItem>
                                ))}
                              </List>
                            </Collapse>
                          </CardActions>
                        )}
                      </>
                    )}
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Grid>
      <SubTaskInfoDialog
        open={!_.isEmpty(subTaskData)}
        onClose={() => {
          setSubTaskData({});
        }}
        data={subTaskData}
        onSubmitted={handleOnCreateOrUpdate}
      />
      <TaskInfoDialog
        open={!_.isEmpty(taskData)}
        onClose={() => {
          setTaskData({});
        }}
        data={taskData}
        onSubmitted={handleOnUpdateTask}
      />
    </Box>
  );
}
