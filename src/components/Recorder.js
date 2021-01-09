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

function Recorder(props) {

  const [record, setRecord] = useState(false)

  const startRecording = () => {
    setRecord(true)
  }

  const stopRecording = () => {
    setRecord(true)
  }

  async function sendRecording(recordedBlob) {
      await axios.post("/" + props.user.user._id + "/" + props.roomId + "/sendAudio", {
        message: "Audio",
        timeStamp: new Date().getTime(),
        type: "audio",
        sender: props.user.user.displayName,
        media: recordedBlob.blob
      })
  }

  function onData(recordedBlob) {
    console.log('chunk of real-time data is: ', recordedBlob);
  }

  async function onStop(recordedBlob) {

    const data = recordedBlob.blob
    await axios.post("/" + props.user.user._id + "/" + props.roomId + "/sendAudio", {
      message: "Audio",
      timeStamp: new Date().getTime(),
      type: "audio",
      sender: props.user.user.displayName,
      media: URL.createObjectURL(recordedBlob.blob)
    })

    console.log('recordedBlob is: ', recordedBlob, data);
    console.log(URL.createObjectURL(recordedBlob.blob));

    // sendRecording(recordedBlob)
    
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

      {/* <IconButton className={record ? "" : "hidden"}>
        <Pause id="pauseAudio"
          onClick={() => {
            stopRecording()
          }}
        />
      </IconButton> */}
      {/* <IconButton className={record ? "" : "hidden"}>
        <DeleteIcon id="deleteAudio"
          onClick={() => {
            setRecord(false)
            // deleteRecording()
          }
          } />
      </IconButton> */}

      <IconButton className={record ? "" : "hidden"}>
        <Send id="sendAudio"
          onClick={() => {
            setRecord(false)
            // sendRecording()
          }} />
      </IconButton>
      {/* <button onClick={this.startRecording} type="button">Start</button>
      <button onClick={this.stopRecording} type="button">Stop</button> */}
    </div>

  );

}

export default Recorder
