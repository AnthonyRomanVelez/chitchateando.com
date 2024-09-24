import React from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import './Emoji.css';

const Emoji = ({ setPickerVisible, isPickerVisible, setCurrentEmoji, setMessage }) => {
    return (
        <div className='btnContainer'>
            <button className='btn emojiBtn' onClick={() => setPickerVisible(!isPickerVisible)}>😊</button>
            {isPickerVisible && (
                <Picker
                    data={data}
                    previousPosition='none'
                    onEmojiSelect={(emoji) => {
                        setCurrentEmoji(emoji.native); // Set the selected emoji
                        setMessage((prevMessage) => prevMessage + emoji.native); // Add emoji to the message
                        setPickerVisible(false); // Hide emoji picker after selection
                    }}
                />
            )}
        </div>
    );
};

export default Emoji;
