import { Avatar, IconButton } from '@material-ui/core';
import React, {useState, useEffect} from 'react';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { PowerSettingsNew, SearchOutlined } from '@material-ui/icons';
import SidebarChat from './SidebarChat.js';
import SidebarPersonalChat from './SidebarPersonalChat.js';
import Pusher from 'pusher-js';
import axios from './axios.js';
import './sidebar.css';
import { Link } from 'react-router-dom';

function Sidebar(props){

    const [rooms,setRooms] = useState([])

    function axiosGet() {
        axios.get("/" + props.user.user._id + "/rooms")
            .then(response => {
                // console.log("sidebar",response.data)
                setRooms(response.data)
            }
        )
    }

    useEffect(() => {
        axiosGet()
    },[])

    useEffect(() => {
        var pusher = new Pusher('3e5c8fa39822b5985c24', {
            cluster: 'ap2'
        });
    
        var channel = pusher.subscribe('rooms');
        channel.bind('inserted', async function(newRoom) {
            // alert(JSON.stringify(newRoom));
            // setRooms([...rooms, newRoom ])
            await axiosGet()
        })

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        }
    }, [])

    useEffect(() => {
        var pusher = new Pusher('3e5c8fa39822b5985c24', {
            cluster: 'ap2'
        });
        
        var channel = pusher.subscribe('chatMessage');
        channel.bind('updated', async function(newMessage) {
            await axiosGet()
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        }
    }, [])

    useEffect(() => {
        var pusher = new Pusher('3e5c8fa39822b5985c24', {
            cluster: 'ap2'
        });
    
        var channel = pusher.subscribe('userAdded');
        channel.bind('updated', async function(newRooms) {
            await axiosGet()
        })

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        }
    }, [])


    async function createPersonalChat() {
        const newContact = prompt("Enter email")
        await axios.post("/" + props.user.user._id + "/addPersonalChat", {
            newContact: newContact
        }).then((response) => {
            console.log(response);
            if(response.data === "does not exist") alert("User does not exist!")
        })
    }


    

    return (
        <div class="sidebar">
            <div className="sidebar-header">
                <Avatar src={props.user.photoURL}/>
                <div className="sidebar-header-right">
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>
                    <IconButton onClick={createPersonalChat}>
                        <ChatIcon />
                    </IconButton>
                    
                        <IconButton>
                        <Link to="/" className="power-button">
                            <PowerSettingsNew onClick={()=>{props.setUser(null)}}/>
                        </Link>
                        </IconButton>
                    
                    
                </div>
            </div>
            
            <div className="sidebar-search">
                <div className="sidebar-search-container">
                    <SearchOutlined />
                    <input placeholder="Search or start new chat" type="text" />
                </div>
            </div>
            <div className="sidebar-chats">
                <SidebarChat addNewChat={true}
                    user={props.user}/>

                {
                    rooms.map(room => (
                        room.type ?
                        
                            <SidebarPersonalChat 
                                key={room._id} 
                                id={room._id}
                                member1={room.member1}
                                member2={room.member2}
                                lastMessage={room.lastMessage}
                                user={props.user}
                            /> 
                            
                            :

                            <SidebarChat 
                                addNewChat={false} 
                                key= {room._id} 
                                id = {room._id} 
                                roomName= {room.roomName} 
                                lastMessage={room.lastMessage} 
                                user={props.user}
                            />

                    ))
                }
                {/* <SidebarChat /> */}
                
              
            </div>
        </div>
    );
}

export default Sidebar;