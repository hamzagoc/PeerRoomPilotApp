import React, { useEffect, useState } from 'react';
import { Tabs, Input, Button, Space } from 'antd';
import { AppstoreOutlined, TeamOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import AvatarSelector from '../../../../components/AvatarSelector';

function DashBoard() {
    const [activeTabKey, setActiveTabKey] = useState(TABS.CREATE_ROOM);
    const [username, setUsername] = useState("")
    const [avatar, setAvatar] = useState({})

    useEffect(() => {
        console.log("Created");
    }, []);

    const handleOnChange = (activeTab) => {
        setActiveTabKey(activeTab);
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    }

    const handleAvatarChange = (data) => {
        console.log(data);
        setAvatar(data);
    }

    return (
        <Container>
            <Tabs defaultActiveKey={activeTabKey} onChange={handleOnChange} size='large' centered>
                <Tabs.TabPane key={TABS.CREATE_ROOM} tab={<CreateRoomTab />} />
                <Tabs.TabPane key={TABS.JOIN_ROOM} tab={<JoinRoomTab />} />
            </Tabs>

            <UserDetail>
                <AvatarSelector name={username} onAvatarChange={handleAvatarChange} />
                <ActionGroup>
                    <Input placeholder="Username" value={username} onChange={handleUsernameChange} />
                    <div>
                        <Button type="primary" style={{ float: 'right' }}>
                            {activeTabKey === TABS.CREATE_ROOM ? "Create Room" : "Join Room"}
                        </Button>
                    </div>
                </ActionGroup>
            </UserDetail>
        </Container>
    );
}


const TABS = {
    CREATE_ROOM: "CREATE_ROOM",
    JOIN_ROOM: "JOIN_ROOM",
}

const CreateRoomTab = () => {
    return <>
        <span>
            <AppstoreOutlined />
            Create Room
        </span>
    </>
}

const JoinRoomTab = () => {
    return <>
        <span>
            <TeamOutlined />
            Join Room
        </span>
    </>
}

const Container = styled.div`
    margin: auto;
    max-width: 400px;
    padding: 100px 20px;
`;
const ActionGroup = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
`;

const UserDetail = styled.div`
    display: flex;
    gap: 36px;
    justify-content: center;
`;


export default DashBoard;