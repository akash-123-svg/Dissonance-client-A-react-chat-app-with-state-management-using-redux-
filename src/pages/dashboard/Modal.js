import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { AddBox } from '@mui/icons-material';
import SnackBar from '../../components/SnackBar';
import { validateFormData } from '../../utils/utility';

export default function Modal({
  addUser,
  element,
  open,
  setOpen,
  showIconButton = true,
  isGroup = false,
}) {
  // const [open, setOpen] = React.useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [value, setValue] = React.useState('');
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = () => {
    if (
      !(
        value &&
        validateFormData({ mobile: value }) &&
        value !== localStorage.getItem('mobile')
      )
    ) {
      setSeverity('error');
      setSnackBarMessage('Please enter valid mobile number!');
      setOpenSnackBar(true);
      return;
    }
    addUser(value, isGroup);
    setValue('');
    handleClose();
  };

  return (
    <div>
      {showIconButton && (
        <IconButton
          color='inherit'
          sx={{ color: 'orange' }}
          onClick={handleClickOpen}>
          {element}
        </IconButton>
      )}

      <SnackBar
        message={snackBarMessage}
        open={openSnackBar}
        setOpen={setOpenSnackBar}
        severity={severity}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='Mobile number'
            type='email'
            fullWidth
            variant='standard'
            onChange={(event) => {
              setValue(event.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
