import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, IconButton, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CreateGroup from './CreateGroup';
import GroupTable from './GroupTable';


export interface Group {
  id: number;
  name: string;
  members: GroupMember[];
}

export type GroupMember =
  | { type: 'student'; id: number; name: string; className: string; sectionName: string }
  | { type: 'teacher'; id: number; name: string };

const GroupMaster: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  // New state for view/edit dialogs
  const [detailsGroup, setDetailsGroup] = useState<Group | null>(null);
  const [editMode, setEditMode] = useState(false);

  const handleAddGroup = (group: Omit<Group, 'id'>) => {
    setGroups(prev => [
      ...prev,
      { ...group, id: Date.now() }
    ]);
    setShowCreate(false);
  };

  // Handlers for view/edit
  const handleViewGroup = (group: Group) => {
    setDetailsGroup(group);
    setEditMode(false);
  };
  const handleEditGroup = (group: Group) => {
    setDetailsGroup(group);
    setEditMode(true);
  };
  const handleCloseDetails = () => {
    setDetailsGroup(null);
    setEditMode(false);
  };

  // Save edited group
  const handleSaveEdit = (updated: { name: string; members: GroupMember[] }) => {
    setGroups(prev => prev.map(g => g.id === detailsGroup?.id ? { ...g, ...updated } : g));
    setDetailsGroup(null);
    setEditMode(false);
  };

  return (
    <Box>
      <Card elevation={3}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h5" fontWeight={600}>Group Master</Typography>
            {/* Remove old button here */}
          </Box>
          <GroupTable groups={groups} onEdit={handleEditGroup} onView={handleViewGroup} />
        </CardContent>
      </Card>
      {/* Floating Action Button for Add Group */}
      <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1300 }} onClick={() => setShowCreate(true)}>
        <AddIcon />
      </Fab>
      <Dialog open={showCreate} onClose={() => setShowCreate(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 4 }}>
          Create Group
          <IconButton onClick={() => setShowCreate(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <CreateGroup onSave={handleAddGroup} onCancel={() => setShowCreate(false)} />
        </DialogContent>
      </Dialog>
      {/* Unified Group Details Dialog for both view and edit */}
      <Dialog open={!!detailsGroup} onClose={handleCloseDetails} maxWidth="sm" fullWidth>
        <DialogTitle>Group Details</DialogTitle>
        <DialogContent>
          {detailsGroup && (
            <Box>
              {editMode ? (
                <CreateGroup
                  onSave={handleSaveEdit}
                  onCancel={handleCloseDetails}
                  initialValues={{
                    name: detailsGroup.name,
                    members: detailsGroup.members,
                  }}
                />
              ) : (
                <>
                  <Typography variant="h6">{detailsGroup.name}</Typography>
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>Members:</Typography>
                  <ul>
                    {detailsGroup.members.map((m, idx) => (
                      <li key={m.type + m.id}>
                        {m.name} {m.type === 'student' ? `(${m.className}-${m.sectionName})` : '(Teacher)'}
                      </li>
                    ))}
                  </ul>
                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button variant="contained" onClick={() => setEditMode(true)}>Edit</Button>
                  </Box>
                </>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default GroupMaster; 