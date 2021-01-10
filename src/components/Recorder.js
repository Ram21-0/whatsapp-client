import React, { useState } from 'react'
import { ReactMic } from 'react-mic';
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
import { firebaseApp } from "../firebase.js"

function Recorder(props) {

  const [record, setRecord] = useState(false)

  const startRecording = () => {
    setRecord(true)
  }

  function onData(recordedBlob) {
    console.log('chunk of real-time data is: ', recordedBlob);
  }

  function onStop(recordedBlob) {

    let storage = firebaseApp.storage().ref('Audio_New/' + props.user.user._id + String(new Date().getTime()) + '.wav');
    let task = storage.put(recordedBlob.blob);
    task.then(function (snapshot) {
      console.log('Uploaded the file')
      storage.getDownloadURL().then(async function (url) {
        await axios.post("/" + props.user.user._id + "/" + props.roomId + "/sendAudio", {
          message: "Audio",
          timeStamp: new Date().getTime(),
          type: "audio",
          sender: props.user.user.displayName,
          media: url
        })
      })
    })

    console.log(window.URL.createObjectURL(recordedBlob.blob));
  }

  return (
    <div>
      <div className="recorder">
        <ReactMic
          record={record}
          className="sound-wave"
          onStop={onStop}
          onData={onData} />
      </div>

      <IconButton className={!record ? "" : "hidden"}>
        <MicIcon id="mic"
          onClick={() => {
            setRecord(true)
            startRecording()
          }
          } />
      </IconButton>

      <IconButton className={record ? "" : "hidden"}>
        <Send id="sendAudio"
          onClick={() => {
            setRecord(false)
          }} />
      </IconButton>
    </div>

  );

}

export default Recorder
