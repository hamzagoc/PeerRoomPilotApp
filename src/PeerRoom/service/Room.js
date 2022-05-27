
import Peer from 'peerjs';
import BroadcastMessage from '../model/BroadcastMessage';

function Room({
    roomId,
    debug,
    onClientConnectedToRoom = (connection) => { },
    onConnectionOpenedToClient = (connection) => { },
    onDataReceived = (connection, data) => { },
    onRoomReady = () => { },
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
        onClientConnectedToRoom(connection);
        connectedClients.push(connection);
        connection.on("data", (data) => {
            log("Message from client:" + connection.peer + "\tData: " + JSON.stringify(data))
            const { username } = connection.metadata || {};
            onDataReceived(connection, data);
            broadcast(BroadcastMessage({ username, data }), connection.peer);
        });
        connection.on("open", () => {
            onConnectionOpenedToClient(connection);
            log("Room connected to peer for messaging")
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

    function log(message) {
        if (debug)
            console.log(message)
    }
    return { connectedClients, init, broadcast };
}


export default Room;