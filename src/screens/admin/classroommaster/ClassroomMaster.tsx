import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, TextField, Box, IconButton, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './ClassroomMaster.css';
import '../admin.css';
import { apiGet, apiPost } from '../../../common/api';
import MuiAlert, { AlertColor } from '@mui/material/Alert';

interface Section {
  id: number;
  name: string;
}

interface Classroom {
  id: number;
  name: string;
  sections: Section[];
}



const SimpleTreeView: React.FC<{
  classrooms: Classroom[];
  addSectionFor: number | null;
  setAddSectionFor: (id: number | null) => void;
  sectionInputs: { [key: number]: string };
  setSectionInputs: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>;
  handleAddSection: (classId: number) => void;
}> = ({ classrooms, addSectionFor, setAddSectionFor, sectionInputs, setSectionInputs, handleAddSection }) => (
  <ul className="classroom-tree-list">
    {classrooms.length === 0 && (
      <Typography color="text.secondary" className="classroom-master-empty">
        No classrooms added yet.
      </Typography>
    )}
    {classrooms.map((cls) => (
      <li key={cls.id} className="classroom-tree-item">
        <Box className="classroom-tree-header">
          <Typography className="classroom-tree-title">{cls.name}</Typography>
          <IconButton
            size="small"
            onClick={() => setAddSectionFor(cls.id)}
            title="Add Section"
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
        {addSectionFor === cls.id && (
          <Box className="classroom-section-form">
            <TextField
              label="Section Name"
              value={sectionInputs[cls.id] || ''}
              onChange={(e) =>
                setSectionInputs((prev) => ({ ...prev, [cls.id]: e.target.value }))
              }
              size="small"
            />
            <Button
              variant="contained"
              size="small"
              onClick={() => handleAddSection(cls.id)}
            >
              Add
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={() => setAddSectionFor(null)}
            >
              Cancel
            </Button>
          </Box>
        )}
        <ul className="classroom-sections-list">
          {cls.sections.length === 0 && (
            <li>
              <Typography color="text.secondary" className="classroom-sections-empty">No sections</Typography>
            </li>
          )}
          {cls.sections.map((sec) => (
            <li key={sec.id}>
              <Typography>{sec.name}</Typography>
            </li>
          ))}
        </ul>
      </li>
    ))}
  </ul>
);

// Add form schema for classroom name
const classroomSchema = yup.object({
  className: yup.string().required('Class Room Name is required'),
});

type ClassroomFormValues = {
  className: string;
};

const ClassRoomMaster: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [showAddClass, setShowAddClass] = useState(false);
  const [sectionInputs, setSectionInputs] = useState<{ [key: number]: string }>({});
  const [addSectionFor, setAddSectionFor] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: AlertColor }>({
    open: false,
    message: '',
    severity: 'success',
  });
  // react-hook-form for classroom
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ClassroomFormValues>({
    resolver: yupResolver(classroomSchema),
    defaultValues: { className: '' },
  });

  useEffect(() => {
    async function fetchClassOptions() {
      try {
        const res: any = await apiGet('student/classeswithsections');
        if (Array.isArray(res)) {
          
          setClassrooms(res);
          debugger
        } else {
         
        }
      } catch (e) {
       
      }
    }
    fetchClassOptions();
  }, []);

  const handleAddClassroom: SubmitHandler<ClassroomFormValues> = async (data) => {
    setClassrooms([
      ...classrooms,
      { id: Date.now(), name: data.className, sections: [] },
    ]);
    try {
      const response: any = await apiPost('student/saveClassroom',data);
      if (response && (response.status === 'success')) {
        setSnackbar({ open: true, message: 'Class added successfully!', severity: 'success' });
      
      } else {
        setSnackbar({ open: true, message: 'Failed to add class.', severity: 'error' });
      }
    } catch (e) {
     
    }
    reset();
    setShowAddClass(false);
  };

  const handleAddSection = async (classId: number) => {
    const sectionName = sectionInputs[classId];
    if (sectionName && sectionName.trim()) {
      setClassrooms((prev) =>
        prev.map((cls) =>
          cls.id === classId
            ? {
                ...cls,
                sections: [
                  ...cls.sections,
                  { id: Date.now(), name: sectionName },
                ],
              }
            : cls
        )
      );
      setSectionInputs((prev) => ({ ...prev, [classId]: '' }));
      setAddSectionFor(null);
          try {
      const response: any = await apiPost('student/saveSection',{sectionName:sectionName,classId:classId});
      if (response && (response.status === 'success')) {
        setSnackbar({ open: true, message: 'Section added successfully!', severity: 'success' });
      
      } else {
        setSnackbar({ open: true, message: 'Failed to add section.', severity: 'error' });
      }
    } catch (e) {
     
    }
    }
  };

  return (
    <Box className="classroom-master-container">
      <Card elevation={3} className="classroom-master-card">
        <CardContent>
          <Box className="classroom-master-header">
            <Typography variant="h5" className="classroom-master-title">
              Class Room Master
            </Typography>
            {/* Replace button with icon button */}
            {showAddClass ? (
              <IconButton onClick={() => setShowAddClass(false)} color="primary">
                <CloseIcon />
              </IconButton>
            ) : (
              <IconButton onClick={() => setShowAddClass(true)} color="primary">
                <AddIcon />
              </IconButton>
            )}
          </Box>
          {showAddClass && (
            <Box component="form" onSubmit={handleSubmit(handleAddClassroom)} className="classroom-master-form">
              <TextField
                label="Class Room Name"
                size="small"
                fullWidth
                error={!!errors.className}
                helperText={errors.className?.message}
                {...register('className')}
              />
              <Button variant="contained" type="submit">
                Save
              </Button>
            </Box>
          )}
          <Divider className="classroom-master-divider" />
          <SimpleTreeView
            classrooms={classrooms}
            addSectionFor={addSectionFor}
            setAddSectionFor={setAddSectionFor}
            sectionInputs={sectionInputs}
            setSectionInputs={setSectionInputs}
            handleAddSection={handleAddSection}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default ClassRoomMaster;
