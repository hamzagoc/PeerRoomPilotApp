
import Peer from 'peerjs';
import BroadcastMessage from '../model/BroadcastMessage';
import SIGNAL from '../model/Signal';

function Room({
    roomId,
    debug,
    onClientConnectedToRoom = (connection) => { },
    onClientConnectionClosed = (connection) => { },
    onDataReceived = (connection, data) => { },
    onRoomReady = (id) => { },
    onBroadcast
}) {
    var connectedClients = [];

    function init() {
        const room = new Peer(roomId, { debug: 2 });
        room.on('open', handleOpen);
        room.on('connection', handleConnection);
        room.on('disconnected', handleDisconnected);
        room.on('close', handleClose);
        room.on('error', handleError);
        return room;
    }

    function handleOpen(id) {
        onRoomReady(id);
        log("Room created " + id);
    }

    function handleDisconnected() {
        log('Room connection lost');
    }

    function handleClose() {
        log('Connection destroyed');
    }

    function handleError(err) {
        log(err);
    }

    function handleConnection(connection) {
        log("Someone joined the room " + connection.peer);
        const { metadata } = connection || {};
        connection.on("data", (data) => {
            log("Message from client:" + connection.peer + "\tData: " + JSON.stringify(data))
            broadcast(BroadcastMessage({ metadata, signal: SIGNAL.DATA, data }), connection.peer);
            onDataReceived(connection, data);
        });
        connection.on("open", () => {
            connectedClients = [...connectedClients, connection];
            log("Room connected to client for messaging")
            broadcast(BroadcastMessage({ metadata, signal: SIGNAL.JOIN }), connection.peer);
            onClientConnectedToRoom(connection);
        });
        connection.on("close", () => {
            log("Client connection closed")
            connectedClients = connectedClients.filter(client => client.peer != connection.peer)
            broadcast(BroadcastMessage({ metadata, signal: SIGNAL.LEAVE }), connection.peer);
            onClientConnectionClosed(connection);
        });
        connection.on('error', function (err) {
            log(err);
        });
    }

    /**
     * 
     * @param {any} message Can be any serializable type.
     * @param {string} ownerPeer 
     */
    function broadcast(message, ownerPeer) {
        if (onBroadcast) {
            onBroadcast(message, ownerPeer);
            return;
        }
        connectedClients.forEach(conn => {
            if (conn.peer !== ownerPeer) {
                conn.send(message);
            }
        })
    }

    function broadcastState(metadata, signal, data) {
        const message = BroadcastMessage({ metadata, signal, data });
        connectedClients.forEach(conn => {
            conn.send(message);
        })
    };

    function log(message) {
        if (debug)
            console.log(message)
    }

    function getConnectedClients() {
        return connectedClients;
    }

    return { connectedClients, init, broadcast, broadcastState, getConnectedClients };
}


export default Room;