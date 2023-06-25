import React, { useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { baseLocalApi } from '../../utils/utility';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../../state/index';
import CircleNumber from '../../components/CircleNumber';

export default function AlignItemsList({ setRoom }) {
  // const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const { setChatList } = bindActionCreators(actionCreators, dispatch);
  const data = [
    ...useSelector((state) => {
      return state.chatListReducer.rooms;
    }),
  ];
  useEffect(() => {
    axios
      .get(`${baseLocalApi}/rooms/${localStorage.getItem('_id')}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('Token'),
        },
      })
      .then((res) => {
        setChatList({ rooms: res.data.rooms });
      })
      .catch((err) => console.error(err));
  }, [setChatList]);
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {data.map(
        (el, index) =>
          el && (
            <div key={index}>
              <ListItem
                alignItems='flex-start'
                className='hover:bg-sky-100 cursor-pointer transition duration-300'>
                <ListItemAvatar>
                  <Avatar
                    alt={el.isGroup ? el.name : el.receiverName}
                    src={el.photoUrl || '/static/images/avatar/1.jpg'}
                    sx={{ backgroundColor: 'orange' }}
                  />
                </ListItemAvatar>
                <ListItemText
                  onClick={() => {
                    setRoom({ ...data[index] });
                  }}
                  primary={!el.isGroup ? el.receiverName : el.name}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component='span'
                        variant='body2'
                        color={el.notSeenCount > 0 ? 'green' : 'text.primary'}>
                        {(el.lastMessage && el.lastMessage.senderName) || ''}
                      </Typography>
                      {` — ${(el.lastMessage && el.lastMessage.message) || ''}`}
                    </React.Fragment>
                  }
                />
                {el.notSeenCount > 0 && (
                  <CircleNumber number={el.notSeenCount} />
                )}
              </ListItem>
              <Divider variant='inset' component='li' />
            </div>
          )
      )}
    </List>
  );
}
