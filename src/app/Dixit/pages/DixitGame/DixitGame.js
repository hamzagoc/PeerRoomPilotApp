import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { makeid } from "../../../../util/Util";
import Room from '../../../../PeerRoom/service/Room';
import Client from '../../../../PeerRoom/service/Client';
import SIGNAL from '../../../../PeerRoom/model/Signal';
import { Spin, message, List } from "antd";
import styled from 'styled-components';
import { PeerJsError } from "../../../../PeerRoom/constants";
import { useLocalStorage, useStateWithRef } from "../../../common/hooks";
import AvatarSelector from "../../../common/components/AvatarSelector/AvatarSelector";

function DixitGame() {
    const { roomname: roomNameParam } = useParams();
    const [userCredentials, setUserCredentials] = useLocalStorage("userCredentials");
    const [roomName, setRoomName] = useState();
    const [roomLoading, setRoomLoading] = useState(true);
    const navigate = useNavigate();

    const tryCount = useRef(0);
    const client = useRef({});

    //gamestate
    const [gameState, getGameState, setGameState] = useStateWithRef({
        hostId: "",
        coHostId: "",
        userList: [],
    });
    const isHostRef = useRef(false);

    useEffect(() => {
        if (!userCredentials) {
            navigate("/");
            return;
        }
        initRoom();
    }, []);

    function initRoom() {
        const isRoomCreator = !roomNameParam || roomNameParam.length === 0 || roomNameParam === "roomcreate";
        if (isRoomCreator) {
            const roomId = makeid(5);
            window.history.replaceState(null, "New Page Title", "/dixit/" + roomId);
            createRoom(roomId, true);
        } else {
            // joining room
            createClientAndConnect(roomNameParam);
        }
    }

    function createRoom(roomId, isRoomCreator) {
        if (tryCount > 2) {
            console.log("Maximum attempts reached");
            return;
        }
        isHostRef.current = true;
        const room = Room({
            roomId,
            debug: true,
            onRoomReady: (id) => {
                setRoomName(id);
                if (isRoomCreator) {
                    createClientAndConnect(roomId);
                } else {
                    setRoomLoading(false);
                }
            },
            onDataReceived: (connection, data) => {
                const { userCredentials: user } = connection.metadata || {};
                console.log({ user, data });
            },
            onClientConnectedToRoom: (connection) => {
                const { userCredentials: user } = connection.metadata || {};
                setGameState(gs => {
                    const { userList } = gs;
                    const peerId = connection.peer;
                    return { ...gs, userList: [...userList, { peerId, ...user }], coHostId: peerId }
                });
                room.broadcastState(connection.metadata, "gamestate", getGameState());
            },
            onClientConnectionClosed: (connection) => {
                console.log(connection.peer + 'closed');
                const leavedPeer = connection.peer;
                setGameState(gs => {
                    const { userList, hostId } = gs;
                    const filteredList = userList.filter(u => u.peerId !== leavedPeer);
                    let coHostId = gs.coHostId;
                    if (!coHostId || coHostId === leavedPeer) {
                        const { peerId } = filteredList.find(u => u.peerId !== hostId, {});
                        coHostId = peerId;
                    }
                    return { ...gs, userList: [...filteredList], coHostId }
                });
                room.broadcastState(connection.metadata, "gamestate", getGameState());
            }
        });
        room.init();
        tryCount.current = tryCount.current + 1;
    }

    function createClientAndConnect(roomId) {
        client.current = Client({
            metadata: { userCredentials },
            debug: true,
            onClientReady: (id) => {
                client.current.connectToRoom(roomId);
                if (isHostRef.current) {
                    setGameState(gs => {
                        return { ...gs, hostId: id }
                    });
                }
            },
            onJoinTheRoom: () => {
                console.log("You joined the room");
                setRoomLoading(false);
            },
            onDataReceived: (connection, d) => {
                const { metadata, data, signal } = d;
                const { user } = metadata;
                if (isHostRef.current) {
                    console.log("Client data ignored because is host");
                    return;
                }
                switch (signal) {
                    case SIGNAL.DATA:
                        console.log({ user, data });
                        break;
                    case SIGNAL.JOIN:
                        console.log({ user, msg: " joined the room" });
                        break;
                    case SIGNAL.LEAVE:
                        console.log({ user, msg: " left the room" });
                        break;
                    case "gamestate":
                        setGameState(data);
                        break;
                    default:
                        console.log("Unhandled signal: " + signal);
                }
            },
            onRoomClose: () => {
                console.log("Host disconnected. Now you are host, room is creating.")
                const { coHostId } = getGameState();
                if (coHostId === client.current.getId()) {
                    setGameState(gs => {
                        const { userList, hostId } = gs;
                        // remove leaved host
                        const filteredList = userList.filter(u => u.peerId !== hostId);
                        return { ...gs, userList: [...filteredList], hostId: coHostId, coHostId: null }
                    });
                }
            },
            onError: (err) => {
                console.log({ type: err.type, err });
                if (PeerJsError.PEER_UNAVAILABLE === err.type) {
                    console.log("Cannot connect to room. There is no room.");
                    message.info('Cannot connect to room. Room not found.');
                    navigate("/");
                    return;
                }
            }
        });
        client.current.init();
    }

    function handleSendMessage() {
        client.current.sendMessage("Hi");
    }

    const { userList, hostId, coHostId } = gameState;

    return (

        roomLoading
            ? <Loader><Spin tip="Loading" size="large" /></Loader>
            : (
                <>
                    <h1>Dixit Game - {roomName}</h1>
                    <h3>User Count - {userList.length}</h3>
                    <List
                        grid={{ gutter: 24, justifyContent: 'center' }}
                        dataSource={userList}
                        renderItem={user => (<List.Item key={user.peerId}><AvatarSelector user={user} viewMode /></List.Item>)}
                    />
                    <hr />
                    {JSON.stringify(gameState)}
                    <button onClick={handleSendMessage} > Mesaj Gönder </button>
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