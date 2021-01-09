import React, { useState, useEffect } from 'react'
import { Avatar, IconButton } from '@material-ui/core';
import { Add, AttachFile, Block, Pause, PlayArrow, SearchOutlined, Send } from '@material-ui/icons';
import AddIcon from '@material-ui/icons/Add';
import MoreVert from '@material-ui/icons/MoreVert';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon'
import MicIcon from '@material-ui/icons/Mic';
import DeleteIcon from '@material-ui/icons/Delete';
import PeopleIcon from '@material-ui/icons/People';
import './chat.css';
import axios from './axios.js'
import { Link, useParams } from 'react-router-dom'
import Pusher from 'pusher-js';
import Recorder from './Recorder.js'

function PersonalChat(props) {

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [roomName, setRoomName] = useState("")
    const [member1, setMember1] = useState({})
    const [member2, setMember2] = useState({})


    let roomId = useParams();

    const sendMessage = async (e) => {
        e.preventDefault();
        await axios.post("/" + props.user.user._id + "/" + roomId.roomId + "/newMessage", {
            message: input,
            name: props.user.user.displayName,
            timestamp: new Date().getTime(),
        })
        setInput("");
    }

    useEffect(async () => {
        console.log(roomId.roomId)
        await axios.get("/rooms/" + roomId.roomId)
            .then(response => {
                // console.log("axios");
                setMessages(response.data.messages.reverse())
                setRoomName(response.data.member1.displayName === props.user.user.displayName ?
                    response.data.member2.displayName : response.data.member1.displayName)
                setMember1(response.data.member1)
                setMember2(response.data.member2)
                setInput("")
            })
    }, [roomId])

    useEffect(() => {
        var pusher = new Pusher('c71cecedf5e8f36f2a2f', {
            cluster: 'ap2'
        });

        var channel = pusher.subscribe('chatMessage');
        channel.bind('updated', async function (newMessage) {
            await axios.get("/rooms/" + roomId.roomId)
                .then(response => {
                    setMessages(response.data.messages.reverse())
                })
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        }

    }, [roomId])

    async function leaveRoom() {
        await axios.post("/" + roomId.roomId + "/leaveRoom", {
            email: props.user.user.email,
            displayName: props.user.user.displayName
        })
    }



    return (
        <div className="chat">
            <div className="chat-header">
                <Avatar src={member1.displayName === props.user.user.displayName ?
                    member2.photoURL : member1.photoURL} />
                <div className="chat-header-info">
                    <h3>{roomName}</h3>
                    <p>online</p>
                </div>
                <div className="chat-header-right">
                    <IconButton>
                        <Link to="/">
                            <Block onClick={leaveRoom} />
                        </Link>
                    </IconButton>

                    <IconButton>
                        <SearchOutlined />
                    </IconButton>

                </div>
            </div>
            <div className="chat-body">



                {messages.map((message) =>
                    message.type && message.type === "audio" ? (
                        <p className={"chat-message" + (props.user.user.displayName === message.sender ? " chat-receiver" : "")}>
                            <div className="audio">
                                {props.user.user.displayName === message.sender && <Avatar src={member1.displayName === message.sender ?
                                    member1.photoURL : member2.photoURL} />}
                                <audio
                                    controls
                                    src={message.media}>
                                    Your browser does not support the
                                    <code>audio</code> element.
                                </audio>
                                {props.user.user.displayName !== message.sender && <Avatar src={member1.displayName === message.sender ?
                                    member1.photoURL : member2.photoURL} />}
                                <span className="chat-time">{new Date(message.timeStamp).toLocaleTimeString()}</span>
                            </div>
                        </p>
                    ) :
                        (
                            <p className={"chat-message" + (message.sender === props.user.user.displayName ? " chat-receiver" : "")} >
                                {message.message}
                                <span className="chat-time">{new Date(message.timeStamp).toLocaleTimeString()}</span>
                            </p>
                        ))}

            </div>
            <div className="chat-footer">
                <IconButton>
                    <InsertEmoticonIcon />
                </IconButton>
                <IconButton>
                    <AttachFile className="rotate-icon" />
                </IconButton>

                <form>
                    <input placeholder="Type a message" type="text" value={input} onChange={e => setInput(e.target.value)} />
                    <button type="submit" onClick={sendMessage}>Send message</button>
                </form>


                <Recorder user={props.user} roomId={roomId.roomId} />

            </div>
        </div>
    )
}

export default PersonalChat