import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { makeid } from "../../../../util/Util";
import Room from '../../../../PeerRoom/service/Room';
import Client from '../../../../PeerRoom/service/Client';
import SIGNAL from '../../../../PeerRoom/model/Signal';
import { Spin } from "antd";
import styled from 'styled-components';

function DixitGame() {
    const { roomname: roomNameParam } = useParams();
    const [roomName, setRoomName] = useState();
    const [roomLoading, setRoomLoading] = useState(true);

    const client = useRef({});



    useEffect(() => {
        initRoom();
    }, []);


    function initRoom() {
        const isRoomCreator = !roomNameParam || roomNameParam.length === 0 || roomNameParam === "roomcreate";
        if (isRoomCreator) {
            const roomId = makeid(5);
            window.history.replaceState(null, "New Page Title", "/dixit/" + roomId);
            createRoom(roomId);
        }else{
            // joining room
            
        }
    }

    function createRoom(roomId) {
        const room = Room({
            roomId,
            debug: true,
            onRoomReady: (id) => {
                setRoomLoading(false);
                setRoomName(id);
            },
            onDataReceived: (connection, data) => {
                const { username } = connection.metadata || {};
                console.log(username + ": " + JSON.stringify(data));
            },
            onClientConnectedToRoom: (connection) => {
                const { username } = connection.metadata || {};
                console.log(username + " joined the room.");
            }
        });
        room.init();
    }

    function createClientAndConnect() {
        client.current = Client({
            username: "Hamza",
            debug: true,
            onClientReady: (id) => {
                client.current.connectToRoom("room-id");
                //setIsClient(true);
            },
            onJoinTheRoom: () => {
                console.log("You joined the room");
            },
            onDataReceived: (connection, d) => {
                const { metadata, data, signal } = d;
                const { username } = metadata;
                switch (signal) {
                    case SIGNAL.DATA:
                        const msg = username + ": " + JSON.stringify(data);
                        console.log(msg);
                        break;
                    case SIGNAL.JOIN:
                        console.log(username + " joined the room");
                        break;
                    case SIGNAL.LEAVE:
                        console.log(username + " left the room");
                        break;
                    default:
                        console.log("Unhandled signal: " + signal);
                }
            }
        });
        client.current.init();
        //setIsClient(true);
    }

    return (

        roomLoading
            ? <Loader><Spin tip="Loading" size="large" /></Loader>
            : (
                <>
                    <h1>Dixit Game - {roomName}</h1>
                </>
            )

    )
}

const Loader = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
`;
export default DixitGame;