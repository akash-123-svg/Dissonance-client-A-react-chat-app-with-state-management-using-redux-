import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ChatBar from './chatbar';
import ChatMessageBar from './ChatBottom';
import MessageBox from './MessageBox';
import ChatHeader from './ChatHeader';
import { Check, DoneAll, Logout, ArrowBack, AddBox } from '@mui/icons-material';
import MenuListComposition from './MoreOptions';
import AvatarWithLastSeen from './AvatarWithLastSeen';
import { baseLocalApi, baseApi } from '../../utils/utility';
import moment from 'moment-timezone';
import io from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../../state/index';

const drawerWidth = 340;

let socket, selectedMessagesComp;

const updateLastMessage = (currRooms, room, message) => {
  const updatedRooms = [...currRooms];
  for (let i = 0; i < updatedRooms.length; i += 1) {
    if (updatedRooms[i]._id === room._id) {
      const newMessage = { ...message };
      newMessage.message =
        newMessage.message.length > 30
          ? newMessage.message.substr(0, 35) + '...'
          : newMessage.message;
      updatedRooms[i].lastMessage = newMessage;
      break;
    }
  }
  return updatedRooms;
};

const updateMessage = (messages, message, setMessage) => {
  console.log('Amir');
  for (let i = 0; i < messages.length; i += 1) {
    if (messages[i]._id == message._id) {
      messages[i].status = 'seen';
      setMessage([...messages]);
      break;
    }
  }
};

function ResponsiveDrawer(props) {
  const dispatch = useDispatch();
  const { setCurrentRoom, setChatList } = bindActionCreators(
    actionCreators,
    dispatch
  );
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [receiver, setReceiver] = useState({});
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(window.innerWidth <= 600);
  const navigate = useNavigate();
  const room = useSelector((state) => {
    return state.roomReducer;
  });
  const currRoom = useRef(
    useSelector((state) => {
      return state.roomReducer;
    })
  );
  const rooms = [
    ...useSelector((state) => {
      return state.chatListReducer.rooms;
    }),
  ];
  useEffect(() => {
    if (!localStorage.getItem('Token')) {
      navigate('/signin');
      // return;
    }

    socket = io(baseApi);
    socket.emit('setup', { _id: localStorage.getItem('_id') });
    socket.on('connection', () => setSocketConnected(true));
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);
      if (window.innerWidth >= 600) {
        setMobileOpen(false);
      } else if (!room._id) {
        setMobileOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    if (room._id) {
      setMobileOpen(false);
      socket.emit('join chat', room._id);
      if (!room.isGroup) {
        const receiverId =
          room.users[0] === localStorage.getItem('_id')
            ? room.users[1]
            : room.users[0];
        axios
          .get(`${baseLocalApi}/users/${receiverId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('Token')}`,
            },
          })
          .then((userRes) => {
            setReceiver(userRes.data.user);
            // console.log(userRes);
          })
          .catch((err) => {
            console.error(err);
          });
      }

      axios
        .get(`${baseLocalApi}/messages/${room._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('Token')}`,
          },
        })
        .then((response) => {
          selectedMessagesComp = messages;
          setMessages(response.data.messages);
        })
        .catch((error) => {
          console.error('Error:', error.message);
        });
    }

    scrollToBottom();

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [room]); // Empty dependency array ensures the effect runs only once

  useEffect(() => {
    socket.on('message received', (newMessageReceived) => {
      console.log(newMessageReceived);
      if (
        newMessageReceived &&
        currRoom.current &&
        currRoom.current._id &&
        newMessageReceived._id === currRoom.current._id
      ) {
        setMessages([...messages, newMessageReceived.message]);
        !currRoom.current.isGroup &&
          socket.emit('message delivered ack', {
            userId: localStorage.getItem('_id'),
            newMessageReceived,
          });
        // const updatedRooms = updateLastMessage(
        //   rooms,
        //   currRoom.current,
        //   newMessageReceived.message
        // );
        // setChatList({ rooms: updatedRooms });
      }
    });
    socket.on('message received ack', (newMessageReceived) => {
      if (
        newMessageReceived &&
        currRoom.current &&
        newMessageReceived._id === currRoom.current._id &&
        !currRoom.current.isGroup
      ) {
        const patchData = {
          roomId: currRoom.current._id,
          receiverId: localStorage.getItem('_id'),
        };
        axios
          .patch(`${baseLocalApi}/messages/`, patchData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('Token')}`,
            },
          })
          .then((response) => {
            updateMessage(messages, newMessageReceived.message, setMessages);
          })
          .catch((error) => {
            console.error('Error:', error.message);
          });
      }
    });

    scrollToBottom();
  });

  let scrollableRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollableRef && scrollableRef.current) {
      scrollableRef.current.scrollIntoView({
        block: 'end',
      });
    }
  };

  const windowProp = props.window;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const sendMessage = (message) => {
    const { _id, name } = localStorage;
    const postData = {
      message,
      senderName: name,
      senderId: _id,
      roomId: room._id,
      createdOn: new Date(),
      status: 'not_delivered',
    };
    setMessages([...messages, postData]);
    axios
      .post(`${baseLocalApi}/messages/`, postData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('Token')}`,
        },
      })
      .then((response) => {
        socket.emit('new message', { ...room, message: response.data.message });
        console.log('Before :', messages);
        setMessages([...messages, response.data.message]);
        console.log('After : ', messages);
        // const updatedRooms = updateLastMessage(
        //   rooms,
        //   room,
        //   response.data.message
        // );
        // setChatList({ rooms: updatedRooms });
      })
      .catch((error) => {
        console.error('Error:', error.message);
      });
  };

  const changeRoom = (room) => {
    if (windowWidth <= 600) {
      setMobileOpen(false);
    }
    setCurrentRoom(room);
    currRoom.current = room;
  };

  const addUserInGroup = (value, roomId) => {
    const postData = { userIdToAdd: value };
    axios
      .post(`${baseLocalApi}/rooms/${roomId}/add-user`, postData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('Token')}`,
        },
      })
      .then((response) => {
        // console.log('Response:', response.data);
      })
      .catch((error) => {
        console.error('Error:', error.message);
      });
  };

  const drawer = (
    <div>
      <AppBar
        position='fixed'
        sx={{
          width: { sm: `${drawerWidth}px`, xs: `100%` },
          mr: {
            sm: `calc(100% - ${drawerWidth}px)`,
          },
        }}>
        <ChatHeader />
      </AppBar>
      <Toolbar />

      <Toolbar />
      <ChatBar setRoom={changeRoom} />
    </div>
  );

  const container =
    windowProp !== undefined ? () => windowProp().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {room._id && (
        <AppBar
          position='fixed'
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex' }}>
              <IconButton
                color='inherit'
                aria-label='open drawer'
                edge='start'
                onClick={handleDrawerToggle}
                sx={{ mr: 2, visibility: { sm: 'hidden' } }}>
                <ArrowBack />
              </IconButton>
              <AvatarWithLastSeen
                name={(receiver && receiver.name) || room.name}
                receiver={receiver}
                photoUrl={(receiver && receiver.photoUrl) || room.photoUrl}
              />
              <div
                style={{ color: 'red' }}
                onClick={() => {
                  console.log('Room id : ', room._id);
                  console.log('Curr Room : ', currRoom.current);
                }}>
                Amir
              </div>
            </div>
            <Typography
              variant='h6'
              noWrap
              component='div'
              display='flex'
              alignItems='right'>
              <MenuListComposition
                listOptions={false}
                isGroup={room.isGroup}
                addUser={addUserInGroup}
              />
            </Typography>
          </Toolbar>
        </AppBar>
      )}
      <Box
        component='nav'
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label='mailbox folders'>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant='temporary'
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: '100%',
            },
          }}>
          {drawer}
        </Drawer>
        <Drawer
          variant='permanent'
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open>
          {drawer}
        </Drawer>
      </Box>
      {room._id && (
        <>
          <Box
            component='main'
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: `calc(100% - ${drawerWidth}px)` },
            }}>
            <Toolbar />
            <div style={{ paddingBottom: '70px' }} ref={scrollableRef}>
              {messages.map((el) => (
                <MessageBox
                  key={el._id}
                  message={el.message}
                  sender={el.senderName}
                  align={
                    el.senderId !== localStorage.getItem('_id')
                      ? 'left'
                      : 'right'
                  }
                  timestamp={moment(el.createdOn).format('hh:mm a')}
                  status={el.status}
                />
              ))}
            </div>
          </Box>
          <ChatMessageBar onSend={sendMessage} drawerWidth={drawerWidth} />
        </>
      )}
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
