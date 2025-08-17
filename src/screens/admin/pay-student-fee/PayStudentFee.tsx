import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Box, Button, Divider, Grid, TextField, Table, TableHead, TableRow, TableCell, TableBody, Chip, Autocomplete
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MenuItem from '@mui/material/MenuItem';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

// Mock students and fee structures
const mockStudents = [
  { id: 1, name: 'Alice', classId: 1, section: 'A', parent: 'Mr. Smith', mobile: '9876543210' },
  { id: 2, name: 'Bob', classId: 1, section: 'B', parent: 'Mrs. Brown', mobile: '9876543211' },
  { id: 3, name: 'Charlie', classId: 2, section: 'A', parent: 'Mr. White', mobile: '9876543212' },
];
const mockClasses = [
  { id: 1, name: 'LKG' },
  { id: 2, name: 'UKG' },
];
const mockFeeStructures = [
  {
    classId: 1,
    numberOfTerms: 3,
    feeItems: [
      { id: 1, name: 'School Fee', amount: 9000 },
      { id: 2, name: 'Transport Fee', amount: 3000 },
    ],
  },
  {
    classId: 2,
    numberOfTerms: 2,
    feeItems: [
      { id: 3, name: 'School Fee', amount: 8000 },
      { id: 4, name: 'Uniform Fee', amount: 2000 },
    ],
  },
];

function getFeeStructureForClass(classId: number) {
  return mockFeeStructures.find(f => f.classId === classId);
}

const PayStudentFee: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<typeof mockStudents[0] | null>(null);
  const [paidStatus, setPaidStatus] = useState<{ [term: number]: boolean }>({});
  const [payDialog, setPayDialog] = useState<{ open: boolean; term: number | null; amount: number; mode: string }>({ open: false, term: null, amount: 0, mode: '' });
  const [paymentDetails, setPaymentDetails] = useState<{ [term: number]: { amount: number; mode: string } }>({});

  // When student changes, reset paid status
  React.useEffect(() => {
    if (!selectedStudent) return;
    const feeStruct = getFeeStructureForClass(selectedStudent.classId);
    if (feeStruct) {
      const status: { [term: number]: boolean } = {};
      for (let t = 1; t <= feeStruct.numberOfTerms; t++) status[t] = false;
      setPaidStatus(status);
    }
  }, [selectedStudent]);

  const handlePay = (term: number) => {
    setPayDialog({ open: true, term, amount: perTermTotal, mode: '' });
  };
  const handlePaySubmit = () => {
    if (!payDialog.term || !payDialog.amount || !payDialog.mode) return;
    setPaidStatus(prev => ({ ...prev, [payDialog.term!]: true }));
    setPaymentDetails(prev => ({ ...prev, [payDialog.term!]: { amount: payDialog.amount, mode: payDialog.mode } }));
    setPayDialog({ open: false, term: null, amount: 0, mode: '' });
  };

  const feeStruct = selectedStudent ? getFeeStructureForClass(selectedStudent.classId) : null;
  const perTermTotal = feeStruct ? feeStruct.feeItems.reduce((sum, item) => sum + item.amount, 0) / (feeStruct.numberOfTerms || 1) : 0;

  return (
    <Box >
      <Card elevation={3}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <PaymentIcon color="primary" />
            <Typography variant="h5" fontWeight={600}>Pay Student Fee</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Autocomplete
            options={mockStudents}
            getOptionLabel={s => s.name}
            value={selectedStudent}
            onChange={(_, v) => setSelectedStudent(v)}
            renderInput={params => <TextField {...params} label="Search Student" size="small" />}
            sx={{ maxWidth: 400, mb: 3 }}
          />
          {selectedStudent && feeStruct && (
            <Box>
              <Typography variant="subtitle1" fontWeight={500} mb={1}>Student Details</Typography>
              <Grid container spacing={2} mb={2}>
                <Grid size={{ xs: 12, sm: 6 }}><b>Name:</b> {selectedStudent.name}</Grid>
                <Grid size={{ xs: 12, sm: 6 }}><b>Class:</b> {mockClasses.find(c => c.id === selectedStudent.classId)?.name}</Grid>
                <Grid size={{ xs: 12, sm: 6 }}><b>Section:</b> {selectedStudent.section}</Grid>
                <Grid size={{ xs: 12, sm: 6 }}><b>Parent:</b> {selectedStudent.parent}</Grid>
                <Grid size={{ xs: 12, sm: 6 }}><b>Mobile:</b> {selectedStudent.mobile}</Grid>
              </Grid>
              <Typography variant="subtitle1" fontWeight={500} mb={1}>Fee Details (Term-wise)</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Term</TableCell>
                    <TableCell>Fee Items</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Payment Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.from({ length: feeStruct.numberOfTerms }, (_, i) => i + 1).map(term => {
                    const paid = paidStatus[term];
                    const payment = paymentDetails[term];
                    const paidAmount = payment ? payment.amount : 0;
                    let statusChip = (
                      <Chip icon={<CancelIcon color="error" />} label="Unpaid" color="error" size="small" />
                    );
                    if (paid && payment) {
                      if (paidAmount >= perTermTotal) {
                        statusChip = <Chip icon={<CheckCircleIcon color="success" />} label="Paid" color="success" size="small" />;
                      } else if (paidAmount > 0) {
                        statusChip = <Chip icon={<WarningAmberIcon color="warning" />} label="Partially Paid" color="warning" size="small" />;
                      }
                    }
                    const showPay = paidAmount < perTermTotal;
                    return (
                      <TableRow key={term}>
                        <TableCell>Term {term}</TableCell>
                        <TableCell>
                          {feeStruct.feeItems.map(item => (
                            <div key={item.id}>{item.name}: ₹{(item.amount / feeStruct.numberOfTerms).toFixed(2)}</div>
                          ))}
                        </TableCell>
                        <TableCell>₹{perTermTotal.toFixed(2)}</TableCell>
                        <TableCell>{statusChip}</TableCell>
                        <TableCell>
                          {showPay && (
                            <Button variant="contained" size="small" onClick={() => handlePay(term)}>Pay</Button>
                          )}
                        </TableCell>
                        <TableCell>
                          {paid && payment && (
                            <>
                              <div>Amount: ₹{payment.amount.toFixed(2)}</div>
                              <div>Mode: {payment.mode}</div>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          )}
        </CardContent>
      </Card>
      {/* Pay Dialog */}
      <Dialog open={payDialog.open} onClose={() => setPayDialog({ open: false, term: null, amount: 0, mode: '' })} maxWidth="xs" fullWidth>
        <DialogTitle>Pay Fee</DialogTitle>
        <DialogContent>
          <TextField
            label="Amount Paid"
            type="number"
            value={payDialog.amount}
            onChange={e => setPayDialog(d => ({ ...d, amount: Number(e.target.value) }))}
            fullWidth
            margin="normal"
            inputProps={{ min: 0, max: perTermTotal }}
          />
          <TextField
            label="Mode of Payment"
            select
            value={payDialog.mode}
            onChange={e => setPayDialog(d => ({ ...d, mode: e.target.value }))}
            fullWidth
            margin="normal"
          >
            <MenuItem value=""><em>Select mode</em></MenuItem>
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Card">Card</MenuItem>
            <MenuItem value="UPI">UPI</MenuItem>
            <MenuItem value="Cheque">Cheque</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPayDialog({ open: false, term: null, amount: 0, mode: '' })}>Cancel</Button>
          <Button variant="contained" onClick={handlePaySubmit} disabled={!payDialog.amount || !payDialog.mode}>Pay</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PayStudentFee; 