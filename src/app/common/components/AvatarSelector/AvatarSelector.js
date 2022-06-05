import React, { useEffect, useState } from 'react';
import { Avatar, Button, Input } from "antd";
import { AvatarColors, AvatarIcon } from "../../constants";
import { ArrowLeftOutlined, ArrowRightOutlined, BgColorsOutlined, EditOutlined, CheckCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useLocalStorage } from '../../hooks';

const iconKeys = Object.keys(AvatarIcon);
const { Group: InputGroup } = Input;

const AvatarSelector = ({ user, viewMode }) => {
    const [userCredentials, setUserCredentials] = useLocalStorage("userCredentials", {});
    const { username: storedUserName, avatar: storedAvatar } = viewMode ? user : userCredentials;
    const [avatarIndex, setAvatarIndex] = useState(getInitialAvatarIndex());
    const [selectedColor, setSelectedColor] = useState(getInitialColor());
    const [username, setUsername] = useState(storedUserName);
    const [isEditModeUsername, setIsEditModeUsername] = useState(false);

    useEffect(() => {
        const avatarKey = iconKeys[avatarIndex];
        setUserCredentials({ username, avatar: { key: avatarKey, color: selectedColor } })
    }, [avatarIndex, selectedColor]);

    function getInitialAvatarIndex() {
        const { key } = storedAvatar || {};
        const index = iconKeys.indexOf(key);
        return index < 0 ? randomNumber(iconKeys.length - 1) : index;
    }

    function getInitialColor() {
        const { color } = storedAvatar || {};
        const index = AvatarColors.indexOf(color);
        return index < 0 ? getRandomColor() : AvatarColors[index];
    }

    function getRandomColor() {
        const colorIndex = randomNumber(AvatarColors.length - 1);
        return AvatarColors[colorIndex];
    }

    function randomNumber(max) {
        return Math.floor(Math.random() * max);
    }

    function handlePreviousAvatar() {
        const index = avatarIndex <= 0 ? iconKeys.length - 1 : avatarIndex - 1;
        setAvatarIndex(index);
    }

    function handleNextAvatar() {
        const index = avatarIndex >= iconKeys.length - 1 ? 0 : avatarIndex + 1;
        setAvatarIndex(index);
    }

    function handleRandomColor() {
        setSelectedColor(getRandomColor());
    }

    function handleUsernameChange(e) {
        setUsername(e.target.value)
    }

    function handleEditUserName() {
        setIsEditModeUsername(mode => !mode);
        if (username) {
            setUserCredentials({ ...userCredentials, username });
        }
    }

    return (
        <AvatarSelectorContainer>
            <Avatar style={{ backgroundColor: selectedColor }} icon={AvatarIcon[iconKeys[avatarIndex]]} size={50} />
            {
                !isEditModeUsername
                    ? (<span>
                        {
                            username || <span style={{ color: 'gray' }}> Username </span>
                        }
                        {!viewMode && <Button icon={<EditOutlined onClick={handleEditUserName} />} size="small" type='link' />}
                    </span>)
                    : (
                        <UsernameInputContainer compact>
                            <Input
                                placeholder="Username"
                                value={username}
                                size="small"
                                onChange={handleUsernameChange}
                            />
                            <Button icon={<CheckCircleOutlined onClick={handleEditUserName} />} size="small" />
                        </UsernameInputContainer>)
            }
            {!viewMode && <SelectorButtons>
                <Button type="primary" shape="circle" size="small" icon={<ArrowLeftOutlined />} onClick={handlePreviousAvatar} />
                <Button type="primary" shape="circle" size="small" icon={<ArrowRightOutlined />} onClick={handleNextAvatar} />
                <Button type="primary" shape="circle" size="small" icon={<BgColorsOutlined />} onClick={handleRandomColor} />
            </SelectorButtons>}
        </AvatarSelectorContainer >
    )
};


const UsernameInputContainer = styled(InputGroup)`
    display:flex !important;
    max-width:150px;
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

export default AvatarSelector;