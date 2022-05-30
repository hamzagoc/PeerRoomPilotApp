import React, { useState } from 'react';
import { Avatar, Button } from "antd";
import { AvatarColors, AvatarIcon } from "../../constants";
import { ArrowLeftOutlined, ArrowRightOutlined, BgColorsOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const AvatarSelector = ({ name }) => {
    const iconKeys = Object.keys(AvatarIcon);
    const [selectedAvatar] = useState(getRandomAvatar());
    const [avatarIndex, setAvatarIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState(getRandomColor());

    function getRandomAvatar() {
        const avatarIndex = randomNumber(iconKeys.length - 1);
        return AvatarIcon[iconKeys[avatarIndex]];
    }

    function getRandomColor() {
        const colorIndex = randomNumber(AvatarColors.length - 1);
        return AvatarColors[colorIndex];
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