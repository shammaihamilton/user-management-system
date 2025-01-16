import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Grid,
  IconButton,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

function TodoList() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Buy groceries' },
    { id: 2, title: 'Read a book' },
  ]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, { id: Date.now(), title: newTask }]);
      setNewTask('');
    }
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        To-Do List
      </Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="New Task"
          variant="outlined"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={addTask}
        >
          Add
        </Button>
      </Box>

      <Grid container spacing={2}>
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{task.title}</Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  color="error"
                  onClick={() => deleteTask(task.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default TodoList;
