import React from 'react';
import Avatar from '@mui/material/Avatar';
import moment from 'moment-timezone';
const getLastSeen = (date) => {
  if (moment(date).startOf('day').isSame(moment().startOf('day'))) {
    return moment(date).format('hh:mm a');
  }
  return moment(date).format('DD/MM/YYYY hh:mm a');
};

export default function LongMenu({ name, photoUrl, receiver, isOnline }) {
  return (
    <div className='flex items-center space-x-4'>
      <Avatar alt={name} src={photoUrl || '/static/images/avatar/2.jpg'} />
      <div className='font-medium dark:text-white'>
        <div>{name}</div>
        <div className='text-sm text-gray-500 dark:text-white'>
          {isOnline
            ? 'Online'
            : `Last seen ${
                (receiver &&
                  receiver.lastSeen &&
                  getLastSeen(receiver.lastSeen)) ||
                ' '
              }`}
        </div>
      </div>
    </div>
  );
}
