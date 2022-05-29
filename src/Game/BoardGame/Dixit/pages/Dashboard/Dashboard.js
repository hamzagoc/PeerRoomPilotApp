import React, { useEffect, useState } from 'react';
import { Tabs, Input, Button, Space, Avatar } from 'antd';
import { AppstoreOutlined, TeamOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { ArrowLeftOutlined, ArrowRightOutlined, BgColorsOutlined } from '@ant-design/icons';
import AvatarIcon from '../../../../constants/AvatarIcon';
const colors = [
    //red
    "#ffa39e",
    "#ff7875",
    "#ff4d4f",
    "#f5222d",
    //volcano
    "#ffbb96",
    "#ff9c6e",
    "#ff7a45",
    "#fa541c",
    //orange
    "#ffd591",
    "#ffc069",
    "#ffa940",
    "#fa8c16",
    //gold
    "#ffd666",
    "#ffc53d",
    "#faad14",
    //yellow
    "#fff566",
    "#ffec3d",
    "#fadb14",
    //lime
    "#d3f261",
    "#bae637",
    "#a0d911",
    //green
    "#b7eb8f",
    "#95de64",
    "#73d13d",
    "#52c41a",
    //cyan
    "#87e8de",
    "#5cdbd3",
    "#36cfc9",
    "#13c2c2",
    //blue
    "#91d5ff",
    "#69c0ff",
    "#40a9ff",
    "#1890ff",
    //magenta
    "#ffadd2",
    "#ff85c0",
    "#f759ab",
    "#eb2f96",
    //purple
    "#d3adf7",
    "#b37feb",
    "#9254de",
    "#722ed1",
];

function DashBoard() {
    const [activeTabKey, setActiveTabKey] = useState(TABS.CREATE_ROOM);
    const [username, setUsername] = useState("")

    useEffect(() => {
        console.log("Created");
    }, []);

    const handleOnChange = (activeTab) => {
        setActiveTabKey(activeTab);
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    }

    return (
        <Container>
            <Tabs defaultActiveKey={activeTabKey} onChange={handleOnChange}>
                <Tabs.TabPane key={TABS.CREATE_ROOM} tab={<CreateRoomTab />} />
                <Tabs.TabPane key={TABS.JOIN_ROOM} tab={<JoinRoomTab />} />
            </Tabs>

            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <UserDetail>
                    <AvatarSelector name={username} />
                    <ActionGroup>
                        <Input placeholder="Username" value={username} onChange={handleUsernameChange} />
                        <div>
                            <Button type="primary" style={{ float: 'right' }}>
                                {activeTabKey === TABS.CREATE_ROOM ? "Create Room" : "Join Room"}
                            </Button>
                        </div>
                    </ActionGroup>
                </UserDetail>
            </Space>
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

const AvatarSelector = ({ name }) => {
    const iconKeys = Object.keys(AvatarIcon);
    const [selectedAvatar, setSelectedAvatar] = useState(getRandomAvatar());
    const [avatarIndex, setAvatarIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState(getRandomColor());

    useEffect(() => {
        setSelectedAvatar(AvatarIcon[iconKeys[avatarIndex]]);
    }, [avatarIndex]);

    function getRandomAvatar() {
        const avatarIndex = randomNumber(colors.length - 1);
        return AvatarIcon[iconKeys[avatarIndex]];
    }

    function getRandomColor() {
        const colorIndex = randomNumber(colors.length - 1);
        return colors[colorIndex];
    }

    function randomNumber(max) {
        return Math.floor(Math.random() * max);
    }

    function handlePreviousAvatar() {
        const index = avatarIndex - 1;
        if (index < 0) {
            setAvatarIndex(iconKeys.length - 1);

        } else {
            setAvatarIndex(index);
        }
    }

    function handleNextAvatar() {
        const index = avatarIndex + 1;
        if (index > iconKeys.length - 1) {
            setAvatarIndex(0);
        } else {
            setAvatarIndex(index);
        }
    }

    function handleRandomColor() {
        setSelectedColor(getRandomColor());
    }

    return (
        <AvatarSelectorContainer>
            <Avatar style={{ backgroundColor: selectedColor }} icon={selectedAvatar} size={50} />
            <span>{name || (<span style={{ color: 'gray' }}>Username</span>)}</span>
            <SelectorButtons>
                <Button type="primary" shape="circle" size="small" icon={<ArrowLeftOutlined />} onClick={handlePreviousAvatar} />
                <Button type="primary" shape="circle" size="small" icon={<ArrowRightOutlined />} onClick={handleNextAvatar} />
                <Button type="primary" shape="circle" size="small" icon={<BgColorsOutlined />} onClick={handleRandomColor} />
            </SelectorButtons>
        </AvatarSelectorContainer>
    )
};

const Container = styled.div`
    margin: auto;
    max-width: 500px;
    padding: 100px 20px;
`;
const ActionGroup = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const AvatarSelectorContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
`;

const SelectorButtons = styled.div`
    display: flex;
    gap: 5px;
`;

const UserDetail = styled.div`
    display: flex;
    gap: 36px;
`;


export default DashBoard;