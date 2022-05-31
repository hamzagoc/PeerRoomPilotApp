import React, { useEffect, useRef, useState } from 'react';
import Room from '../../../../PeerRoom/service/Room';
import Client from '../../../../PeerRoom/service/Client';
import { makeid } from '../../../../util/Util';
import SIGNAL from '../../../../PeerRoom/model/Signal';

function GameRoom() {
    const [isRoom, setIsRoom] = useState(false);
    const [isClient, setIsClient] = useState(false);
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
        setHistory([...historyRef.current, message]);
    }

    function createRoom() {
        room.current = Room({
            roomId: "room-id",
            debug: true,
            onRoomReady: (id) => {
                addMessageToHistory("Room created: " + id);
                setIsRoom(true);
            },
            onDataReceived: (connection, data) => {
                const { username } = connection.metadata || {};
                addMessageToHistory(username + ": " + JSON.stringify(data));
            },
            onClientConnectedToRoom: (connection) => {
                const { username } = connection.metadata || {};
                addMessageToHistory(username + " joined the room.");
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
                setIsClient(true);
            },
            onJoinTheRoom: () => {
                addMessageToHistory("You joined the room");
            },
            onDataReceived: (connection, d) => {
                const { metadata, data, signal } = d;
                const { username } = metadata;
                switch (signal) {
                    case SIGNAL.DATA:
                        const msg = username + ": " + JSON.stringify(data);
                        addMessageToHistory(msg);
                        break;
                    case SIGNAL.JOIN:
                        addMessageToHistory(username + " joined the room");
                        break;
                    case SIGNAL.LEAVE:
                        addMessageToHistory(username + " left the room");
                        break;
                    default:
                        console.log("Unhandled signal: " + signal);
                }
            }
        });
        client.current.init();
        setIsClient(true);
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
            {(!isRoom && !isClient) &&
                (<>
                    <button onClick={createRoom}>Create Room</button>
                    <button onClick={createClientAndConnect}>Join Room</button>
                    <br></br>
                </>)
            }

            <div>
                <ul>
                    {history.map((item, index) => {
                        return (<li key={index}>
                            {item}
                        </li>)
                    })}
                </ul>

            </div>

            {isClient && <>
                <input onChange={handleMessageChange} value={message} />
                <button onClick={sendMessage}>Send Message</button>
            </>}

        </div>
    );
}


export default GameRoom;