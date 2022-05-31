import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTasksData, createTask } from './store/tasksSlice';
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
  const { taskId } = props;

  const [anchorEl, setAnchorEl] = React.useState();

  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div>
      <IconButton onClick={handleMenuOpen}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem>Add Subtask</MenuItem>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Delete</MenuItem>
      </Menu>
    </div>
  );
}

export default function Tasks() {
  const dispatch = useDispatch();

  const [expanded, setExpanded] = React.useState({});

  const tasksData = useSelector(({ home }) => home.tasks.tasks);
  const jobsData = useSelector(({ home }) => home.tasks.jobs);

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

  return (
    <Box sx={{ paddingTop: 1 }}>
      <Grid sx={{ flexGrow: 1 }} container spacing={2}>
        <Grid item xs={12}>
          <Grid container justifyContent='center' spacing={2}>
            {Object.keys(tasksData)
              .sort()
              .map(taskId => (
                <Grid item key={taskId}>
                  <Card sx={{ minWidth: 275 }}>
                    <CardHeader
                      action={<TeakMoreMenu taskId={taskId} />}
                      title={`Task-${taskId}: ${tasksData[taskId].name}`}
                      subheader={
                        <div>
                          <div>{`Creator: ${tasksData[taskId].account}`}</div>
                          <div>{`Scope: ${tasksData[taskId].scope}`}</div>
                        </div>
                      }
                    />
                    <CardActions disableSpacing>
                      <ExpandMore
                        expand={expanded[taskId]}
                        onClick={() => handleExpandClick(taskId)}
                        aria-expanded={expanded[taskId]}
                        aria-label='show more'
                      >
                        <ExpandMoreIcon />
                      </ExpandMore>
                    </CardActions>
                    <CardActions>
                      <Collapse in={expanded[taskId]} timeout='auto' unmountOnExit>
                        123456
                      </Collapse>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
