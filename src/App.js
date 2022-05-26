import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Room from './service/Room';
import Client from './service/Client';
import { makeid } from './util/Util';

function App() {
  const [message, setMessage] = useState("");
  const [clientName, setClientName] = useState("N/A");
  const [history, _setHistory] = useState([]);
  const historyRef = useRef([]);

  const room = useRef();
  const client = useRef();

  useEffect(() => {
    setClientName(makeid(5));
  }, [])

  function setHistory(data) {
    historyRef.current = data;
    _setHistory(data);
  }

  function addMessageToHistory(message) {
    console.log(message);
    setHistory([...historyRef.current, message]);
  }

  function createRoom() {
    room.current = Room({
      roomId: "room-id",
      debug: true,
      onMessage: (connection, data) => {
        const { username } = connection.metadata || {};
        addMessageToHistory(username + ": " + JSON.stringify(data));
      },
      onClientConnectedToRoom: (connection) => {
        const { username } = connection.metadata || {};
        addMessageToHistory(username + " joined the room.");
        room.current.broadcast({ data: username + " joined the room." })
      }
    });
    room.current.init();
  }

  function createClientAndConnect() {
    client.current = Client({
      username: clientName,
      debug: true,
      onClientReady: (id) => {
        client.current.connectToRoom("room-id");
      },
      onMessage: (connection, d) => {
        const { username, data } = d;
        const msg = username ? username + ": " + JSON.stringify(data) : JSON.stringify(data);
        addMessageToHistory(msg);
      }
    });
    client.current.init();
  }

  function handleMessageChange(event) {
    setMessage(event.target.value);
  }

  function sendMessage() {
    client.current.sendMessage(message);
    addMessageToHistory("You: " + message);
    setMessage("");
  }

  return (
    <div className="App">
      <h1>hello {clientName}</h1>
      <button onClick={createRoom}>Create Room</button>
      <button onClick={createClientAndConnect}>Join Room</button>
      <br></br>
      <div>
        <ul>
          {history.map((item, index) => {
            return (<li key={index}>
              {item}
            </li>)
          })}
        </ul>

      </div>

      <input onChange={handleMessageChange} value={message} />
      <button onClick={sendMessage}>Send Message</button>

    </div>
  );
}

export default App;
