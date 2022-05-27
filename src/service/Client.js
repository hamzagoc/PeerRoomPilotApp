import Peer from 'peerjs';

function Client({
    username,
    debug,
    onClientReady = (id) => { },
    onJoinTheRoom = () => { },
    onMessage = (connection, data) => { }
}) {
    var client;
    var clientToRoomCon;

    function init() {
        client = new Peer(null, { debug: 2 });
        client.on('open', handleOpen);
        client.on('connection', handleConnection);
        client.on('disconnected', handleDisconnected);
        client.on('close', handleClose);
        client.on('error', handleError);
        return client;
    }

    function handleOpen(id) {
        log("Client created " + id);
        onClientReady(id);
    }

    function handleDisconnected() {
        log('Client connection lost');
    }

    function handleClose() {
        log('Connection destroyed');
    }

    function handleError(err) {
        log(err);
    }

    function handleConnection(connection) {
        connection.on('open', function () {
            console.err("Someone trying to connect client");
            connection.send("Client does not accept direct incoming connections");
            setTimeout(function () { connection.close(); }, 500);
        });
    }

    function connectToRoom(roomId) {
        clientToRoomCon = client.connect(roomId, { metadata: { username } });
        clientToRoomCon.on('open', function () {
            log("ClientToRoom connection is opened");
            onJoinTheRoom();
            clientToRoomCon.on("data", (data) => {
                log("Message from room: " + JSON.stringify(data));
                onMessage(clientToRoomCon, data);
            });
        });

        clientToRoomCon.on('connection', function (connection) {
            console.error("This case is unexpected.");
        });
        clientToRoomCon.on('disconnected', function () {
            log('ClientToRoom connection lost.');
        });
        clientToRoomCon.on('close', function () {
            log('ClientToRoom connection destroyed');
        });
        clientToRoomCon.on('error', function (err) {
            log(err);
        });
    }

    function sendMessage(message) {
        clientToRoomCon.send(message);
    }

    function log(message) {
        if (debug)
            console.log(message)
    }

    return { username, init, connectToRoom, sendMessage }
}

export default Client;