import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { Check, DoneAll, Logout, ArrowBack, AddBox } from '@mui/icons-material';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { baseLocalApi } from '../../utils/utility';
import MoreOptions from './MoreOptions';
import SnackBar from '../../components/SnackBar';
import AddUserModal from './Modal';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../../state/index';
const ChatHeader = () => {
  const dispatch = useDispatch();
  const { setChatList, setCurrentRoom } = bindActionCreators(
    actionCreators,
    dispatch
  );
  const rooms = useSelector((state) => {
    return state.chatListReducer.rooms;
  });
  const options = ['Group chat'];
  const [open, setOpen] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const navigate = useNavigate();
  const addUser = (value, isGroup) => {
    const postData = { name: '', isGroup: !!isGroup, user: value };
    axios
      .post(`${baseLocalApi}/rooms`, postData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('Token')}`,
        },
      })
      .then((response) => {
        console.log('Response:', response.data.room);
        setChatList({ rooms: [response.data.room, ...rooms] });
        setCurrentRoom(response.data.room);
      })
      .catch((error) => {
        setSeverity('error');
        setSnackBarMessage(error.message);
        setOpenSnackBar(true);
        console.error('Error:', error.message);
      });
  };

  return (
    <Box display='flex'>
      <List
        sx={{
          width: '100%',
          maxWidth: 360,
          bgcolor: 'background.paper',
          //   ml: {
          //     sm: `calc(100% - 200px)`,
          //     xs: `calc(100% - 200px)`,
          //   },
        }}>
        <ListItem>
          <IconButton
            color='inherit'
            sx={{
              color: 'black',
              marginLeft: '5px',
            }}
            onClick={() => {}}>
            <Avatar />
          </IconButton>
        </ListItem>
      </List>
      <List
        sx={{
          width: '100%',
          maxWidth: 360,
          bgcolor: 'background.paper',
          //   ml: {
          //     sm: `calc(100% - 200px)`,
          //     xs: `calc(100% - 200px)`,
          //   },
        }}>
        <ListItem>
          <AddUserModal
            addUser={addUser}
            open={open}
            setOpen={setOpen}
            element={
              <Avatar>
                <AddBox />
              </Avatar>
            }
          />
          <MoreOptions listOptions={options} addUser={addUser} />
          <SnackBar
            message={snackBarMessage}
            open={openSnackBar}
            setOpen={setOpenSnackBar}
            severity={severity}
          />
          <IconButton
            color='inherit'
            sx={{ color: 'black', marginLeft: '40px' }}
            onClick={() => {
              localStorage.clear();
              navigate('/signin');
            }}>
            <Logout />
          </IconButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default ChatHeader;
