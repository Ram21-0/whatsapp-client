import React, {useState,useEffect} from 'react';
import { Avatar } from '@material-ui/core';
import './sidebarChat.css';
import { Link } from 'react-router-dom';
import axios from './axios.js';

function SidebarChat(props) {

    const [newRoomName,setNewRoomName] = useState("")
    // const [lastMessage, setLastMessage] = useState("...")

    // useEffect(() => {
    //     if(props.id) {
    //         db.collection('rooms').doc(props.id)
    //             .onSnapshot(snapshot => setLastMessage(snapshot.data().lastMessage))
    //     }
    // }, [])
    
    const createRoom = async (e) => {
        
        e.preventDefault();
        if(newRoomName.length !== 0) {
            await axios.post("/" + props.user.user._id + "/addRoom", {
                roomName: newRoomName,
                lastMessage: "",
                lastTime: new Date().getTime(),
                messages: [],
                members: [props.user.user.displayName]
            })
        }
        setNewRoomName("");
    };
    
    return !props.addNewChat ? (
        <Link className="chat-link" to={"/rooms/" + props.id}>
            <div className="sidebar-chat">
                <Avatar src=""/>
                <div className="sidebar-chat-info">
                    <h2>{props.roomName}</h2>
                    <p>{props.lastMessage.substring(0,30)}</p>
                </div>
            </div>
        </Link>
    ) : (
            <div className="sidebar-chat">
                <form>
                    <input placeholder="Add new chat" type="text" value={newRoomName} onChange = {e => setNewRoomName(e.target.value)}/>
                    <button type="submit" onClick={createRoom}>Send message</button>
                </form>
            </div>
        )
}

export default SidebarChat;