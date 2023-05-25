import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

function EmojiPicker({ message, setMessage }) {
  const handleClick = (emojiObject) => {
    const newMessage = message + emojiObject.native;
    setMessage(newMessage);
  };
  return <Picker data={data} onEmojiSelect={handleClick} />;
}

export default EmojiPicker;
