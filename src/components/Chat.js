import React, { useState, useEffect } from 'react'
import { Avatar, IconButton } from '@material-ui/core';
import { Add, AttachFile, SearchOutlined } from '@material-ui/icons';
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

function Chat(props) {

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [roomName, setRoomName] = useState("")
    const [newMember, setNewMember] = useState("")
    const [showButton, setShowButton] = useState(true)
    const [members, setMembers] = useState([])
    const [open, setOpen] = useState(false)
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
        await axios.post("/" + roomId.roomId + "/addNewMember", {
            email: newMember,
            displayName: props.user.user.displayName
        }).then(response => {
            // alert(Object.values(response)[0])
            if (String(Object.values(response)[0]) === "0") alert(newMember + " does not exist!")
            setNewMember("")
            setShowButton(true)
        }).then(async () => {
            await axios.get("/rooms/" + roomId.roomId)
                .then(response => {
                    setMembers(response.data.members)
                })
        })
    }

    function getTextField() {
        setShowButton(false)
    }

    function getMembersString() {
        let ans = ""
        for (let i = 0; i < members.length; i++) ans += members[i] + ", "
        return ans.substring(0, ans.length - 2).substring(0, 100)
    }

    async function leaveRoom() {
        await axios.post("/" + roomId.roomId + "/leaveRoom", {
            email: props.user.user.email,
            displayName: props.user.user.displayName
        })
    }

    // const hashCode = (s) => s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)

    // function getRandomColor(string) {
    //     var letters = '0123456789ABCDEF';
    //     var xx = hashCode(string)
    //     var color = '#';
    //     for (var i = 0; i < 6; i++) {
    //       color += letters[Math.floor(Math.random() * 16)];
    //     }
    //     return color;
    //   }


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
                {/* {messages.map((message) =>
                    message.type ? (
                        <div className="notif">
                            <p>{message.sender} {message.message}</p>
                        </div>
                    ) :
                        (
                            <p className={"chat-message" + (message.sender === props.user.user.displayName ? " chat-receiver" : "")} >
                                <span className="chat-name"> {message.sender} </span>
                                {message.message}
                                <span className="chat-time">{new Date(message.timeStamp).toLocaleTimeString()}</span>
                            </p>
                        ))} */}

                        {messages.map((message) =>
                                message.type && message.type === "audio" ? (
                                    <p className={"chat-message" + (props.user.user.displayName === message.sender ? " chat-receiver" : "")}>
                                        <span className="chat-name" style={{color:SeedColor(message.sender).toHex()}}> {message.sender} </span>
                                        <div className="audio">
                                            <audio
                                                controls
                                                src={message.media}>
                                                Your browser does not support the
                                    <code>audio</code> element.
                                </audio>
                                            <span className="chat-time">{new Date(message.timeStamp).toLocaleTimeString()}</span>
                                        </div>
                                    </p>
                                ) : message.type && message.type === "notif" ? (
                                    <div className="notif">
                                        <p>{message.sender} {message.message}</p>
                                    </div>
                                ) : (
                                    (
                                        <p className={"chat-message" + (message.sender === props.user.user.displayName ? " chat-receiver" : "")} >
                                            <span className="chat-name" style={{color:SeedColor(message.sender).toHex()}}> {message.sender} </span>
                                            {message.message}
                                            <span className="chat-time">{new Date(message.timeStamp).toLocaleTimeString()}</span>
                                        </p>
                                    )))
                            }

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

export default Chat