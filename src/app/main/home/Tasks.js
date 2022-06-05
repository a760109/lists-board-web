import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
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
import { ListWebSocket } from 'app/services/webSocket';
import { useDrag, useDrop } from 'react-dnd';

const JobType = Symbol();

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

function Job(props) {
  const { data, setSubTaskData } = props;
  const dispatch = useDispatch();

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: JobType,
      item: () => ({ data }),
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult();
        if (item && dropResult) {
          dispatch(updateSubtask({ ...item.data, taskId: dropResult.taskId }));
        }
      },
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [data],
  );

  return (
    <Card
      ref={drag}
      sx={{
        width: 280,
        padding: 0,
        backgroundColor: data.status === 'pending' ? colorSelect.jPending : colorSelect.jDone,
        ...(isDragging
          ? {
              background: 'rgb(235,235,235)',
              opacity: 0,
            }
          : {}),
      }}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'red', width: 24, height: 24 }} aria-label='recipe'>
            {data.status.charAt(0).toUpperCase()}
          </Avatar>
        }
        action={
          <SubTeakMoreMenu
            jobId={data.id}
            onClickEdie={() => {
              setSubTaskData({ ...data });
            }}
            setSubTaskData={setSubTaskData}
          />
        }
        title={`${data.name}`}
        sx={{ paddingBottom: 0, paddingLeft: 1, paddingRight: 1 }}
        subheader={data.descriptions}
      />
      <CardContent sx={{ paddingBottom: 0 }}>
        <Typography variant='caption' display='block' gutterBottom>
          Creator: {data.account}
        </Typography>
        <Typography variant='caption' display='block' gutterBottom>
          Price: {data.price}
        </Typography>
        <Typography variant='caption' display='block' gutterBottom>
          Cost: {data.cost}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size='small'
          variant='contained'
          disabled={data.status === 'pending'}
          onClick={() => {
            dispatch(updateSubtask({ ...data, status: 'pending' }));
          }}
        >
          To Pandding
        </Button>
        <Button
          size='small'
          variant='contained'
          disabled={data.status === 'done'}
          onClick={() => {
            dispatch(updateSubtask({ ...data, status: 'done' }));
          }}
        >
          To Done
        </Button>
      </CardActions>
    </Card>
  );
}

function Task(props) {
  const { tasksData, jobsData, taskId, setSubTaskData, setTaskData, expanded, handleExpandClick } = props;

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: JobType,
    drop: () => ({ taskId }),
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    canDrop: (item, monitor) => {
      return item.data.taskId !== taskId;
    },
  }));

  const isActive = canDrop && isOver;
  let backgroundColor = null;
  if (isActive) {
    backgroundColor = 'darkgreen';
  } else if (canDrop) {
    backgroundColor = 'darkkhaki';
  }

  return (
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
        ref={drop}
        action={!canDrop && <TeakMoreMenu taskId={taskId} tasksData={tasksData} setSubTaskData={setSubTaskData} setTaskData={setTaskData} />}
        title={`Task-${taskId}: ${tasksData[taskId].name}`}
        sx={{ paddingBottom: 0, paddingLeft: 1, paddingRight: 1, backgroundColor }}
        subheader={`${tasksData[taskId].account} (${capitalizeFirstLetter(tasksData[taskId].scope)})`}
      />
      {!canDrop && (
        <CardContent>
          <Typography variant='subtitle2' color='text.secondary'>
            {tasksData[taskId].descriptions}
          </Typography>
        </CardContent>
      )}
      {taskId in jobsData && !canDrop && (
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
                      <Job data={d} setSubTaskData={setSubTaskData} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </CardActions>
          )}
        </>
      )}
    </Card>
  );
}
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
        <MenuItem
          onClick={() => {
            setSubTaskData({ taskId: parseInt(taskId) });
            setAnchorEl(null);
          }}
        >
          Add Subtask
        </MenuItem>
        <MenuItem
          onClick={() => {
            setTaskData({ ...tasksData[taskId] });
            setAnchorEl(null);
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={async () => {
            const ok = await alert('Are you sure you want to delete?', 'Confirmation');
            if (ok) {
              dispatch(deleteTask({ id: taskId }));
              dispatch(showSuccess());
            }
            setAnchorEl(null);
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
        <MenuItem
          onClick={() => {
            onClickEdie();
            setAnchorEl(null);
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={async () => {
            const ok = await alert('Are you sure you want to delete?', 'Confirmation');
            if (ok) {
              dispatch(deleteSubtask({ id: jobId }));
              dispatch(showSuccess());
            }
            setAnchorEl(null);
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

  const [expanded, setExpanded] = React.useState({});

  const tasksData = useSelector(({ home }) => home.tasks.tasks);
  const jobsData = useSelector(({ home }) => home.tasks.jobs);

  const accountsData = useSelector(({ home }) => home.users.accounts);

  const [subTaskData, setSubTaskData] = React.useState({});
  const [taskData, setTaskData] = React.useState({});

  React.useEffect(() => {
    dispatch(getTasksData());
  }, []);

  React.useEffect(() => {
    ListWebSocket.on('updateTask', updateData);
  }, [tasksData]);

  const updateData = taskId => {
    if (taskId === 0 || (_.isNumber(taskId) && taskId in tasksData)) {
      dispatch(getTasksData());
      dispatch(showSuccess('Updated'));
    }
  };

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
                  <Task
                    tasksData={tasksData}
                    jobsData={jobsData}
                    taskId={_.toNumber(taskId)}
                    setSubTaskData={setSubTaskData}
                    setTaskData={setTaskData}
                    expanded={expanded}
                    handleExpandClick={handleExpandClick}
                  />
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
      {accountsData && (
        <TaskInfoDialog
          open={!_.isEmpty(taskData)}
          onClose={() => {
            setTaskData({});
          }}
          accounts={accountsData}
          data={taskData}
          onSubmitted={handleOnUpdateTask}
        />
      )}
    </Box>
  );
}
