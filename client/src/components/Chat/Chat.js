import React, {useState, useEffect} from 'react';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';
import Emoji from '../Emoji/Emoji';
import './Chat.css';

let socket;

const Chat = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [currentEmoji, setCurrentEmoji] = useState('');
    const location = useLocation();
    const ENDPOINT = 'https://portfolio-chat-app-e0769a711a7c.herokuapp.com/';

    useEffect(() => {
        console.log('Location', location);
        const {name, room} = queryString.parse(location.search);

        socket = io(ENDPOINT, {transports: ['websocket','polling', 'flashsocket']});

        setName(name);
        setRoom(room);

        socket.emit('join', {name, room}, (error) => {
            if(error) {
                alert(error);
            }
        });

        return () => {
            socket.emit('disconnect');
            socket.off();
        }

    }, [ENDPOINT, location]);

    useEffect(() => {
        const messageHandler = (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        socket.on('message', messageHandler);

        const roomDataHandler = ({ users }) => {
            console.log('Users in room:', users); 
            setUsers(users);
        };
    
        socket.on('roomData', roomDataHandler);
        return () => {
            socket.off('message', messageHandler); 
            socket.off('roomData', roomDataHandler);
        };
    }, []);

    const sendMessage = (event) => {
        event.preventDefault();

        if(message){
            socket.emit('sendMessage', message,  () => {
                setMessage('');
                setCurrentEmoji('');
            });
        }
    };

    const handleEmojiSelect = (emoji) => {
        setCurrentEmoji(emoji.native); 
        setPickerVisible(false); 
        setMessage((prevMessage) => prevMessage + emoji.native);
    };

    return (
        <div className='outerContainer'>
            <div className='container'>
                <InfoBar room={room}/>
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
                <Emoji 
                    setPickerVisible={setPickerVisible} 
                    isPickerVisible={isPickerVisible} 
                    setCurrentEmoji={setCurrentEmoji}  
                    setMessage={setMessage}
                    handleEmojiSelect={handleEmojiSelect}
                />
            </div>
            <TextContainer users={users} />
        </div>
    )
}

export default Chat;
