import Peer, { DataConnection } from 'peerjs';

interface PeerError extends Error {
    type: string,
}

interface ClientListeners {
    onClientReady(id: string): void;
    onJoinTheRoom(): void;
    onDataReceived(connection: any, data: any): void;
    onRoomClose(): void;
    onError(err: PeerError): void;
}

export class Client {
    metadata: any;
    debug: boolean;
    private listeners: ClientListeners;
    //
    peer: Peer;
    clientToRoomCon: DataConnection;

    constructor(metadata: any, debug: boolean, listeners: ClientListeners) {
        this.metadata = metadata;
        this.debug = debug;
        this.listeners = listeners;
        this.bindFunctions();

    }

    private bindFunctions(): void {
        // function binds
        this.init = this.init.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleDisconnected = this.handleDisconnected.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleConnection = this.handleConnection.bind(this);
        this.connectToRoom = this.connectToRoom.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.log = this.log.bind(this);
    }

    init(): Peer {
        console.log(this);
        const peer = new Peer(null, { debug: 2 });
        peer.on('open', this.handleOpen);
        peer.on('connection', this.handleConnection);
        peer.on('disconnected', this.handleDisconnected);
        peer.on('close', this.handleClose);
        peer.on('error', this.handleError);
        this.peer = peer;
        return this.peer;
    }
    /** Handlers */
    handleOpen(id: string): void {
        console.log(this);

        this.log("Client created " + id);
        this.listeners.onClientReady(id);
    }

    private handleDisconnected(): void {
        this.log('Client connection lost');
    }

    private handleClose(): void {
        this.log('Connection destroyed');
    }

    private handleError(err: PeerError): void {
        this.log(err);
        this.listeners.onError(err);
    }

    private handleConnection(connection: DataConnection): void {
        connection.on('open', function () {
            console.error("Someone trying to connect client");
            connection.send("Client does not accept direct incoming connections");
            setTimeout(function () { connection.close(); }, 500);
        });
    }

    /** Functions */
    connectToRoom(roomId: string): void {
        const { metadata, log } = this;
        const { onJoinTheRoom, onDataReceived, onRoomClose } = this.listeners;
        const connection = this.peer.connect(roomId, { metadata });
        connection.on('open', function () {
            log("ClientToRoom connection is opened");
            onJoinTheRoom();
            connection.on("data", (data) => {
                log("Message from room: " + JSON.stringify(data));
                onDataReceived(connection, data);
            });
        });

        connection.on('close', function () {
            log('ClientToRoom connection destroyed');
            onRoomClose();
        });
        connection.on('error', function (err) {
            log(err);
        });

        this.clientToRoomCon = connection;
    }

    sendMessage(message: string): void {
        this.clientToRoomCon.send(message);
    }

    log(message: Error | string): void {
        if (this.debug)
            console.log(message)
    }
}

export default Client;