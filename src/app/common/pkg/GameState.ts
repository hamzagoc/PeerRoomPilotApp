import { UserCredentials } from ".";

type GameState = {
    hostId: string;
    coHostId: string;
    userList: Map<string, UserCredentials>;
}

export default GameState;



