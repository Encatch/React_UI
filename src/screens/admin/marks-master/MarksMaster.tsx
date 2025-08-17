import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Divider,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import SchoolIcon from "@mui/icons-material/School";
import NotesIcon from "@mui/icons-material/Notes";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import { apiPost, apiGet, apiPut } from "../../../common/api";

interface MarkEntry {
  id: number;
  classId: number;
  sectionId: number;
  studentId: number;
  class: {
    id: number;
    name: string;
  };
  section: {
    id: number;
    name: string;
  }; 
  subjects: {
    subjectId: number;
    subject: {
      id: number;
      name: string;
      code: string;
    };
    subjectName: string;
    maxMarks: number;
    passMarks: number;
    remark: string;
  }[];
  updatedAt: string;
}

interface MarkRow {
  subjectId: number | "";
  maxMarks: string;
  passMarks: string;
  remark: string;
}
interface Subject {
  id: number;
  name: string;
  code: string;
}
interface Section {
  id: number;
  name: string;
}
const defaultMarkRow: MarkRow = {
  subjectId: "",
  maxMarks: "",
  passMarks: "",
  remark: "",
};

const MarksMaster: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState<number | "">("");
  const [selectedSection, setSelectedSection] = useState<number | "">("");
  const [selectedStudent, setSelectedStudent] = useState<number | "">("");
  const [markRows, setMarkRows] = useState<MarkRow[]>([defaultMarkRow]);
  const [entries, setEntries] = useState<MarkEntry[]>([]);
  const [viewEntry, setViewEntry] = useState<MarkEntry | null>(null);
  const [editEntry, setEditEntry] = useState<MarkEntry | null>(null);
  const [classOptions, setClassOptions] = useState<Subject[]>([]);
  const [sectionsOptions, setSectionsOptions] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  React.useEffect(() => {
    async function fetchClassOptions() {
      try {
        const res: any = await apiGet("student/classes");
        if (Array.isArray(res)) {
          setClassOptions(res);
        } else {
          setClassOptions([]);
        }
      } catch (e) {
        setClassOptions([]);
      }
    }
    fetchClassOptions();
    getMarksMasterEntries();
  }, []);

  React.useEffect(() => {
    if (selectedClass) {
      getSections(selectedClass);
      getSubjects();
    }
  }, [selectedClass, selectedSection]);

  const getSections = async (classId: number) => {
    try {
      const res: any = await apiGet(`student/sections?classId=${classId}`);
      if (Array.isArray(res)) {
        setSectionsOptions(res);
      } else {
        return [];
      }
    } catch (e) {
      return []; // Return empty array on error
    }
  };

  const getSubjects = async () => {
    try {
      const res: any = await apiGet(`student/subjects/${selectedClass}`);
      if (res) {
        setSubjects(res.subjects || []);
      } else {
        setSubjects([]);
      }
    } catch (e) {
      setSubjects([]);
    }
  };
  const getMarksMasterEntries = async () => {
    try {
      const res: any = await apiGet("master/marksheets");
      if (Array.isArray(res)) {
        setEntries(res);
      } else {
        setEntries([]);
      }
    } catch (e) {
      setEntries([]);
    }
  };
  const handleOpenDialog = () => {
    setShowDialog(true);
    setSelectedClass("");
    setSelectedSection("");
    setSelectedStudent("");
    setMarkRows([]);
  };
  const handleCloseDialog = () => setShowDialog(false);

  const handleAddRow = () => {
    setMarkRows((prev) => [...prev, { subjectId: "", maxMarks: "",passMarks:'', remark: "" }]);
  };
  const handleRemoveRow = (idx: number) => {
    setMarkRows((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRowChange = (idx: number, field: keyof MarkRow, value: any) => {
    setMarkRows((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );
  };

  // Edit logic
  const handleEdit = (entry: MarkEntry) => {
    debugger
    setEditEntry(entry);
    setSelectedClass(entry.classId);
    setSelectedSection(entry.sectionId);
    setMarkRows(
      entry.subjects.map((sub) => ({
        subjectId: sub.subjectId,
        maxMarks: sub.maxMarks.toString(),
        passMarks: sub.passMarks.toString(),
        remark: sub.remark,
      }))
    );
    setShowDialog(true);
  };
  // Save edit
  const handleSave = async () => {
    debugger;
    if (!selectedClass || !selectedSection) return;
    const classObj = classOptions.find((c) => c.id === Number(selectedClass));
    if (!classObj) return;
    const marksArr = markRows
      .filter((row) => row.subjectId && row.maxMarks !== "")
      .map((row) => {
        const sub = subjects.find((s) => s.id === Number(row.subjectId));
        return {
          subjectId: Number(row.subjectId),
          subjectName: sub?.name || "",
          maxMarks: Number(row.maxMarks) || 0,
          passMarks: Number(row.passMarks) || 0,
          remark: row.remark || "",
        };
      });
    if (editEntry) {
      const newEntry = {
        id: editEntry.id,
        classId: Number(selectedClass),
        sectionId: Number(selectedSection),
        subjects: marksArr,
      };

      try {
        const response = await apiPut("master/marksheets", newEntry);

        if (response?.status === "success") {
          showSnackbar("Fee update successfully!", "success");
        } else {
          console.error("Failed to save staff");
        }
      } catch (e) {
        console.error("Error saving staff", e);
      }
    } else {
      const newEntry = {
        classId: Number(selectedClass),
        sectionId: Number(selectedSection),
        subjects: marksArr,
      };

      try {
        const response = await apiPost("master/marksheets", newEntry);

        if (response?.status === "success") {
          showSnackbar("Fee created successfully!", "success");
        } else {
          console.error("Failed to save staff");
        }
      } catch (e) {
        console.error("Error saving staff", e);
      }
      // setEntries(prev => [
      //   ...prev,
      //   {
      //     id: Date.now(),
      //     classId: Number(selectedClass),
      //     sectionId: Number(selectedSection),
      //     studentId: Number(selectedStudent),
      //     marks: marksArr,
      //     date: new Date().toLocaleDateString(),
      //   },
      // ]);
    }
    setShowDialog(false);
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const usedSubjectIds = markRows.map((row) => row.subjectId).filter(Boolean);

  return (
    <Box>
      <Card elevation={3}>
        <CardContent>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <NotesIcon color="primary" />
              <Typography variant="h5" fontWeight={600}>
                Marks Master
              </Typography>
            </Box>
            <Tooltip title="Add Marks">
              <IconButton
                color="primary"
                onClick={handleOpenDialog}
                size="large"
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Marks</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      py={4}
                    >
                      <InfoOutlinedIcon
                        color="disabled"
                        sx={{ fontSize: 40, mb: 1 }}
                      />
                      <Typography color="text.secondary" variant="subtitle1">
                        No marks entries added yet
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry) => {
                  // const cls = classOptions.find((c) => c.id === entry.classId);
                  // const section = cls?.sections.find(
                  //   (s) => s.id === entry.sectionId
                  // );
                  
                  return (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.updatedAt.split("T")[0]}</TableCell>
                      <TableCell>{entry?.class?.name}</TableCell>
                      <TableCell>{entry?.section?.name}</TableCell>
                      <TableCell>
                        {entry.subjects
                          .map(
                            (m) =>
                              `${m.subject.name}: ${m.maxMarks}
                              `
                          )
                          .join(", ")}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => setViewEntry(entry)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(entry)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Add/Edit Marks Dialog */}
      <Dialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
          setEditEntry(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editEntry ? "Edit Marks" : "Add Marks"}</DialogTitle>
        <DialogContent>
          <Box mt={1}>
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>Select Class</InputLabel>
              <Select
                value={selectedClass}
                onChange={(e) => {
                //  getSections(e.target.value as number);
                  setSelectedClass(e.target.value as number);
                  setSelectedSection("");
                  setSelectedStudent("");
                  setMarkRows([]);
                }}
                label="Select Class"
              >
                <MenuItem value="">
                  <em>Select a class</em>
                </MenuItem>
                {classOptions.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              fullWidth
              margin="normal"
              size="small"
              disabled={!selectedClass}
            >
              <InputLabel>Select Section</InputLabel>
              <Select
                value={selectedSection}
                onChange={(e) => {
                  getSubjects();
                  setSelectedSection(e.target.value as number);
                  setSelectedStudent("");
                  setMarkRows([]);
                }}
                label="Select Section"
              >
                <MenuItem value="">
                  <em>Select a section</em>
                </MenuItem>
                {sectionsOptions.map((section) => (
                  <MenuItem key={section.id} value={section.id}>
                    {section.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Subject-wise marks input as dynamic rows */}
            {subjects.length > 0 && (
              <Box mt={2}>
                <Typography variant="subtitle1" fontWeight={500} mb={1}>
                  Enter Marks
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  {markRows.map((row, idx) => (
                    <React.Fragment key={idx}>
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Subject</InputLabel>
                          <Select
                            value={row.subjectId}
                            label="Subject"
                            onChange={(e) =>
                              handleRowChange(idx, "subjectId", e.target.value)
                            }
                          >
                            <MenuItem value="">
                              <em>Select subject</em>
                            </MenuItem>
                            {subjects
                              .filter(
                                (sub) =>
                                  !usedSubjectIds.includes(sub.id) ||
                                  sub.id === row.subjectId
                              )
                              .map((sub) => (
                                <MenuItem key={sub.id} value={sub.id}>
                                  {sub.name}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 2 }}>
                        <TextField
                          label="Marks"
                          type="number"
                          value={row.maxMarks}
                          onChange={(e) =>
                            handleRowChange(idx, "maxMarks", e.target.value)
                          }
                          fullWidth
                          size="small"
                          inputProps={{ min: 0, max: 100 }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 2 }}>
                        <TextField
                          label="Marks"
                          type="number"
                          value={row.passMarks}
                          onChange={(e) =>
                            handleRowChange(idx, "passMarks", e.target.value)
                          }
                          fullWidth
                          size="small"
                          inputProps={{ min: 0, max: 100 }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm:4 }}>
                        <TextField
                          label="Remark"
                          value={row.remark}
                          onChange={(e) =>
                            handleRowChange(idx, "remark", e.target.value)
                          }
                          fullWidth
                          size="small"
                        />
                      </Grid>
                      <Grid
                        size={{ xs: 12, sm: 1 }}
                        display="flex"
                        alignItems="center"
                      >
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveRow(idx)}
                          disabled={markRows.length === 1}
                        >
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                      </Grid>
                    </React.Fragment>
                  ))}
                  <Grid size={{ xs: 12 }}>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={handleAddRow}
                      disabled={subjects.length === markRows.length}
                    >
                      Add Subject
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowDialog(false);
              setEditEntry(null);
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            {editEntry ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* View Marks Dialog */}
      <Dialog
        open={!!viewEntry}
        onClose={() => setViewEntry(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>View Marks</DialogTitle>
        <DialogContent>
          {viewEntry && (
            <Box>
              {/* <Typography variant="subtitle1" mb={1}>
                {(() => {
                  const cls = classOptions.find(
                    (c) => c.id === viewEntry.classId
                  );
                  const section = cls?.sections.find(
                    (s) => s.id === viewEntry.sectionId
                  );
                  const student = mockStudents.find(
                    (s) => s.id === viewEntry.studentId
                  );
                  return `${cls?.name || ""} - ${section?.name || ""} - ${
                    student?.name || ""
                  }`;
                })()}
              </Typography> */}
              {/* <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Subject</TableCell>
                    <TableCell>Marks</TableCell>
                    <TableCell>Remark</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {viewEntry.marks.map((m, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{m.subjectName}</TableCell>
                      <TableCell>{m.mark}</TableCell>
                      <TableCell>{m.remark}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table> */}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MarksMaster;
