import React from 'react';
import Avatar from '@mui/material/Avatar';

export default function LongMenu({ name, photoUrl, receiver }) {
  return (
    <div className='flex items-center space-x-4'>
      <Avatar alt={name} src={photoUrl || '/static/images/avatar/2.jpg'} />
      <div className='font-medium dark:text-white'>
        <div>{name}</div>
        <div className='text-sm text-gray-500 dark:text-white'>
          {(receiver && receiver.lastSeen) || ' '}
        </div>
      </div>
    </div>
  );
}
