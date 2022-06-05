import { UserCredentials } from ".";

export default interface GameState {
    hostId: string;
    coHostId: string;
    userList: Map<string, UserCredentials>;

}




