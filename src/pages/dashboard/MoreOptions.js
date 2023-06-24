import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddUserModal from './Modal';

const constOptions = [
  'Add People',
  'Atria',
  'Callisto',
  'Dione',
  'Ganymede',
  'Hangouts Call',
  'Luna',
  'Oberon',
  'Phobos',
  'Pyxis',
  'Sedna',
  'Titania',
  'Triton',
  'Umbriel',
];

const ITEM_HEIGHT = 48;

export default function LongMenu({
  listOptions,
  addUser,
  isGroup,
  showGroupNameInputBox = true,
}) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  console.log('Is group : ', isGroup);
  let dontShowIndex = -1;
  let options = constOptions;
  if (listOptions) {
    options = listOptions;
  } else if (!isGroup) {
    dontShowIndex = 0;
  }
  const handleClose = (option) => {
    setAnchorEl(null);
  };

  const handleOptionClick = (option, index) => {
    setAnchorEl(null);
    if (index === 0) {
      setModalOpen(true);
    }
  };

  return (
    <div>
      <IconButton
        aria-label='more'
        id='long-button'
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup='true'
        onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id='long-menu'
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}>
        {options.map(
          (option, index) =>
            dontShowIndex !== index && (
              <MenuItem
                key={option}
                selected={index === 0}
                onClick={() => {
                  handleOptionClick(option, index);
                }}>
                {option}
              </MenuItem>
            )
        )}
      </Menu>
      <AddUserModal
        open={modalOpen}
        setOpen={setModalOpen}
        showIconButton={false}
        isGroup={true}
        showGroupNameInputBox={showGroupNameInputBox}
        addUser={addUser}
      />
    </div>
  );
}
