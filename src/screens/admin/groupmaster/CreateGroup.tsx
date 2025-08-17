import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Grid, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip } from '@mui/material';
import { GroupMember } from './GroupMaster';

// Mock data for students and teachers
const mockClasses = [
  { id: 1, name: 'LKG', sections: [{ id: 1, name: 'A' }, { id: 2, name: 'B' }] },
  { id: 2, name: 'UKG', sections: [{ id: 3, name: 'A' }] },
  { id: 3, name: 'Class 1', sections: [{ id: 4, name: 'A' }] },
];
// Fix: Add type: 'student' to each student
const mockStudents: { type: 'student'; id: number; name: string; className: string; sectionName: string }[] = [
  { id: 1, name: 'Alice', className: 'LKG', sectionName: 'A', type: 'student' },
  { id: 2, name: 'Bob', className: 'LKG', sectionName: 'B', type: 'student' },
  { id: 3, name: 'Charlie', className: 'UKG', sectionName: 'A', type: 'student' },
];
// Fix: Add type: 'teacher' to each teacher
const mockTeachers: { type: 'teacher'; id: number; name: string }[] = [
  { id: 1, name: 'Mr. Smith', type: 'teacher' },
  { id: 2, name: 'Ms. Johnson', type: 'teacher' },
];

interface CreateGroupProps {
  onSave: (group: { name: string; members: GroupMember[] }) => void;
  onCancel: () => void;
  initialValues?: { name: string; members: GroupMember[] };
}

const CreateGroup: React.FC<CreateGroupProps> = ({ onSave, onCancel, initialValues }) => {
  const [name, setName] = React.useState(initialValues?.name || '');
  // Store selected member keys (string[])
  const [selectedMemberKeys, setSelectedMemberKeys] = React.useState<string[]>(
    initialValues?.members
      ? initialValues.members.map(m => `${m.type}-${m.id}`)
      : []
  );

  // For demo: combine all students and teachers for selection
  const allMembers: GroupMember[] = [
    ...mockStudents,
    ...mockTeachers,
  ];
  // Map: key -> member
  const memberKeyMap: Record<string, GroupMember> = {};
  allMembers.forEach(m => {
    const key = `${m.type}-${m.id}`;
    memberKeyMap[key] = m;
  });

  // Convert selected keys to member objects
  const selectedMembers: GroupMember[] = selectedMemberKeys.map(k => memberKeyMap[k]).filter(Boolean);

  const handleSave = () => {
    if (name && selectedMembers.length > 0) {
      onSave({ name, members: selectedMembers });
    }
  };

  return (
    <Box p={2}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <TextField
            label="Group Name"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid size={12}>
          <FormControl fullWidth size="small">
            <InputLabel>Assign Members</InputLabel>
            <Select
              multiple
              value={selectedMemberKeys}
              onChange={e => setSelectedMemberKeys(e.target.value as string[])}
              input={<OutlinedInput label="Assign Members" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((key) => (
                    <Chip key={key} label={memberKeyMap[key]?.name || key} />
                  ))}
                </Box>
              )}
            >
              <MenuItem disabled>Students</MenuItem>
              {mockStudents.map(s => (
                <MenuItem key={`student-${s.id}`} value={`student-${s.id}`}>
                  {s.name} ({s.className}-{s.sectionName})
                </MenuItem>
              ))}
              <MenuItem disabled>Teachers</MenuItem>
              {mockTeachers.map(t => (
                <MenuItem key={`teacher-${t.id}`} value={`teacher-${t.id}`}>
                  {t.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={12} display="flex" justifyContent="flex-end" gap={1}>
          <Button variant="contained" onClick={handleSave} disabled={!name || selectedMembers.length === 0}>
            Save
          </Button>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateGroup; 