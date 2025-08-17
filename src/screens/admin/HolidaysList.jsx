import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Grid, Paper, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import './HolidaysList.css';

const HolidaysList = () => {
  const [holidays, setHolidays] = useState([]);
  const [holidayName, setHolidayName] = useState('');
  const [holidayDate, setHolidayDate] = useState('');

  const handleAddHoliday = () => {
    if (!holidayName || !holidayDate) return;
    setHolidays([...holidays, { name: holidayName, date: holidayDate }]);
    setHolidayName('');
    setHolidayDate('');
  };

  const handleDeleteHoliday = (index) => {
    setHolidays(holidays.filter((_, i) => i !== index));
  };

  return (
    <div className="holidays-list-container">
      <Typography variant="h5" gutterBottom className="holidays-list-title">Holiday Master</Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5}>
            <TextField
              label="Holiday Name"
              value={holidayName}
              onChange={e => setHolidayName(e.target.value)}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              label="Date"
              type="date"
              value={holidayDate}
              onChange={e => setHolidayDate(e.target.value)}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button variant="contained" color="primary" onClick={handleAddHoliday} fullWidth>Add</Button>
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Holidays List</Typography>
        {holidays.length === 0 ? (
          <Typography color="text.secondary">No holidays added yet.</Typography>
        ) : (
          <List>
            {holidays.map((holiday, idx) => (
              <ListItem key={idx} divider>
                <ListItemText primary={holiday.name} secondary={holiday.date} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" color="error" onClick={() => handleDeleteHoliday(idx)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </div>
  );
};

export default HolidaysList; 