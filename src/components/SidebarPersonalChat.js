import React, {useState,useEffect} from 'react';
import { Avatar } from '@material-ui/core';
import './sidebarChat.css';
import { Link } from 'react-router-dom';
import axios from './axios.js';

function SidebarPersonalChat(props) {

    return (
        <Link className="chat-link" to={"/personal/" + props.id}>
            <div className="sidebar-chat">
                <Avatar src={props.member1.displayName === props.user.user.displayName ? 
                            props.member2.photoURL : props.member1.photoURL}/>
                <div className="sidebar-chat-info">
                    <h2>{
                        props.member1.displayName === props.user.user.displayName ? 
                            props.member2.displayName : props.member1.displayName
                    }</h2>

                    <p>{props.lastMessage.substring(0,30)}</p>
                </div>
            </div>
        </Link>
    )
}

export default SidebarPersonalChat