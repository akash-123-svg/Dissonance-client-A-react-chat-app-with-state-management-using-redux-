import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  AccessTime,
  Check,
  DoneAll,
  VisibilityOff,
  ScheduleSendTwoTone,
  ScheduleTwoTone,
} from '@mui/icons-material';

const MessageBox = ({ message, sender, align, timestamp, status, element }) => {
  const alignStyle = {
    justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
  };

  const messageBoxStyle = {
    background: element
      ? 'transparent'
      : align === 'right'
      ? '#2979ff'
      : '#f5f5f5',
    color: align === 'right' ? '#fff' : '#000',
    borderRadius: '8px',
    padding: '8px',
    marginBottom: '8px',
    maxWidth: '80%',
    alignSelf: align === 'right' ? 'flex-end' : 'flex-start',
    position: 'relative',
    minWidth: '100px',
    display: 'inline-block',
    wordBreak: 'break-word',
  };

  const senderStyle = {
    color: align === 'right' ? '#fff' : '#888',
    fontSize: '12px',
    marginBottom: '4px',
    fontWeight: 'bold',
  };

  const timestampStyle = {
    color: align === 'right' ? '#fff' : '#888',
    fontSize: '10px',
    marginLeft: '8px',
    alignSelf: 'flex-end',
    wordBreak: 'break-all', // Allow wrapping of long single-line timestamps
  };

  const statusIconStyle = {
    fontSize: '16px',
    marginLeft: '4px',
    verticalAlign: 'middle',
  };

  const getStatusIcon = () => {
    if (status === 'delivered') {
      return <Check style={statusIconStyle} />;
    } else if (status === 'seen') {
      return <DoneAll style={statusIconStyle} />;
    } else if (status === 'not_delivered') {
      return <ScheduleTwoTone style={statusIconStyle} />;
    }
    return null;
  };

  return (
    <Box display='flex' flexDirection='column' style={alignStyle}>
      <Typography variant='caption' style={senderStyle}>
        {sender}
      </Typography>
      <Box style={messageBoxStyle}>
        {element}
        <Typography variant='body1' component='p' sx={{ marginBottom: '10px' }}>
          {message}
        </Typography>
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: '3px',
            right: '3px',
          }}>
          <Typography variant='caption' style={timestampStyle}>
            {timestamp}
            {align === 'right' && status && getStatusIcon()}
          </Typography>
        </div>
      </Box>
    </Box>
  );
};

export default MessageBox;
