import React, { useState, useEffect } from 'react'
import { Avatar, IconButton } from '@material-ui/core';
import { Add, AttachFile, Clear, SearchOutlined } from '@material-ui/icons';
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
import Recorder from "./Recorder"
import SeedColor from "seed-color"
import Message from "./Message.js"

function Chat(props) {

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [roomName, setRoomName] = useState("")
    const [newMember, setNewMember] = useState("")
    const [showButton, setShowButton] = useState(true)
    const [members, setMembers] = useState([])
    const [open, setOpen] = useState(false)
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
        else {
            await axios.post("/" + props.user.user._id + "/" + roomId.roomId + "/newMessage", {
                message: input,
                sender: props.user.user.displayName,
                timeStamp: new Date().getTime(),
            })
        }
        setInput("");
        new Audio("../assets/sound.mp3").play()
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

                    <span className="chat-name" style={{ color: SeedColor(replyMessage.sender).toHex() }}> 
                        {replyMessage.sender} 
                    </span>

                    {replyMessage.message}
                </p>

                <IconButton onClick={ () => {setReplyMessage(null)} }>
                    <Clear/>
                </IconButton>

            </div>
        )
        else return <div></div>
    }

    useEffect(async () => {
        console.log(roomId.roomId)
        await axios.get("/rooms/" + roomId.roomId)
            .then(response => {
                // console.log("axios");
                setMessages(response.data.messages.reverse())
                setRoomName(response.data.roomName)
                setMembers(response.data.members)
                setInput("")
                setShowButton(true)
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

    async function addMember(e) {
        e.preventDefault()
        if (newMember.length > 0) {
            await axios.post("/" + roomId.roomId + "/addNewMember", {
                email: newMember,
                displayName: props.user.user.displayName
            }).then(response => {
                // alert(Object.values(response)[0])
                if (String(Object.values(response)[0]) === "0") alert(newMember + " does not exist!")
                setNewMember("")
            }).then(async () => {
                await axios.get("/rooms/" + roomId.roomId)
                    .then(response => {
                        setMembers(response.data.members)
                    })
            })
        }
        setShowButton(true)
    }

    function getTextField() {
        setShowButton(false)
    }

    function getMembersString() {
        let ans = ""
        for (let i = 0; i < members.length; i++) ans += members[i] + ", "
        ans = ans.substring(0, ans.length - 2)
        if (ans.length < 75) return ans
        else return ans.substring(0, 75) + "..."
    }

    async function leaveRoom() {
        await axios.post("/" + roomId.roomId + "/leaveRoom", {
            email: props.user.user.email,
            displayName: props.user.user.displayName
        })
    }

    return (
        <div className="chat">
            <div className="chat-header">
                <Avatar />
                <div className="chat-header-info">
                    <h3>{roomName}</h3>
                    <p>{getMembersString()}</p>
                </div>

                <div className="chat-header-right">
                    <IconButton>
                        <Link to="/">
                            <DeleteIcon onClick={leaveRoom} />
                        </Link>
                    </IconButton>

                    <IconButton onClick={getTextField} className={showButton ? "" : "hidden"} >
                        <Add />
                    </IconButton>

                    <form className={!showButton ? "" : "hidden"}>
                        <input type="email" value={newMember} placeholder="Enter email"
                            onChange={(e) => setNewMember(e.target.value)} />
                        <button className="hidden" type="submit" onClick={addMember}>Submit</button>
                    </form>

                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton onBlur={() => open && setOpen(false)} onFocus={() => setOpen(true)}>
                        <PeopleIcon />
                    </IconButton>
                    {open && (
                        <div className="dropDown">
                            <p className="groupMembers">Group Members</p>
                            {members.map((member) => (
                                <p className="memberElement">{member}</p>
                            )
                            )}

                        </div>
                    )
                    }
                </div>
            </div>
            <div className="chat-body">
                
                { messages.map(message => <Message message={message} user={props.user} 
                            setReplyMessage={setReplyMessage} />)}
                            
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

export default Chat