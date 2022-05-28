import React from 'react';
import { Tabs, Input, Button, Space } from 'antd';
import { AppstoreOutlined, TeamOutlined } from '@ant-design/icons';
import styled from 'styled-components';

function DashBoard() {

    const handleOnChange = (activeTab) => {
        console.log(activeTab);
    }

    const handleUsernameChange = (e) => {
        console.log(e.target.value);

    }

    const TabPaneContent = ({ actionButtonText }) => {
        return (
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Input placeholder="Username" onChange={handleUsernameChange} />
                <Button type="primary" style={{ float: 'right' }}>
                    {actionButtonText}
                </Button>
            </Space>
        );
    }
    return (
        <Container>
            <Tabs defaultActiveKey={TABS.CREATE_ROOM} onChange={handleOnChange}>
                <Tabs.TabPane key={TABS.CREATE_ROOM} tab={<CreateRoomTab />}>
                    <TabPaneContent actionButtonText="Create Room" />
                </Tabs.TabPane>
                <Tabs.TabPane key={TABS.JOIN_ROOM} tab={<JoinRoomTab />}>
                    <TabPaneContent actionButtonText="Join Room" />
                </Tabs.TabPane>
            </Tabs>
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
  max-width: 500px;
  padding: 100px 20px;
`;

export default DashBoard;