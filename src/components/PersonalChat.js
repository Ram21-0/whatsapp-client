import React, { useState, useEffect } from 'react'
import { Avatar, IconButton } from '@material-ui/core';
import { Add, Clear, AttachFile, Block, Pause, PlayArrow, SearchOutlined, Send } from '@material-ui/icons';
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
import SeedColor from "seed-color"
import Message from "./Message.js"

function PersonalChat(props) {

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [roomName, setRoomName] = useState("")
    const [member1, setMember1] = useState({})
    const [member2, setMember2] = useState({})
    const [replyMessage, setReplyMessage] = useState(null)

    let roomId = useParams();

    const sendMessage = async (e) => {
        e.preventDefault();
        if(replyMessage) {
            await axios.post("/" + props.user.user._id + "/" + roomId.roomId + "/newMessage", {
                message: input,
                sender: props.user.user.displayName,
                timeStamp: new Date().getTime(),
                reply: true,
                parentMessageBody: replyMessage.message,
                parentMessageSender: replyMessage.sender
            }).then((response) => {
                setReplyMessage(null)
            })
        }
        else await axios.post("/" + props.user.user._id + "/" + roomId.roomId + "/newMessage", {
            message: input,
            sender: props.user.user.displayName,
            timeStamp: new Date().getTime(),
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

    function replyToMessage() {
        if(replyMessage) return (
            <div className="reply">
                <p style={
                    {   borderRadius:"1%", 
                        padding:"10px", 
                        borderLeft: "3px solid " + SeedColor(replyMessage.sender).toHex(), 
                        backgroundColor: 'lightgray', 
                        opacitiy: "0.5", 
                        marginLeft: "96px",  
                        marginTop: "5px",
                        paddingLeft: "2px",
                        flex: "1",
                        fontSize:"12px" }}>
                    <span className="chat-name" style={{ color: SeedColor(replyMessage.sender).toHex() }}> {replyMessage.sender} </span>
                    {replyMessage.message}
                </p>

                <IconButton onClick={ () => {setReplyMessage(null)} }>
                    <Clear/>
                </IconButton>
            </div>
        )
        else return <div></div>
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


                {messages.map(message => <Message message={message} user={props.user} 
                            setReplyMessage={setReplyMessage} 
                            personal member1={member1} member2={member2}/>)}

            </div>

            <div className="chat-footer-reply">

                {replyToMessage()}

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
        </div>
    )
}

export default PersonalChat