import './app.css';
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar.js';
import Chat from './Chat.js';
import PersonalChat from './PersonalChat.js';
import Pusher from 'pusher-js';
import axios from './axios.js';
import { Route } from 'react-router-dom';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import Login from './Login.js'
import { auth, provider } from '../firebase.js';
import firebase from 'firebase';

function App() {
    const [user, setUser] = useState(null);

    return (
        <div className="app">
            {
                !user ? (
                    <div className="login">
                        <Login setUser={setUser} />
                    </div>
                ) :
                (
                    <div className="app-body">

                        <Router>
                            <Sidebar user={user} setUser={setUser}/>
                            <Switch>
                                <Route path="/rooms/:roomId">
                                    <Chat user={user} />
                                </Route>
                                <Route path="/personal/:roomId">
                                    <PersonalChat user={user} />
                                </Route>
                                <Route path="/">

                                </Route>
                            </Switch>
                        </Router>

                    </div>
                )}
        </div>

    );
}

export default App;