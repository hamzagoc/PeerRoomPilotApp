import React, { useEffect, useState } from 'react';
import { Avatar, Button } from "antd";
import { AvatarColors, AvatarIcon } from "../../constants";
import { ArrowLeftOutlined, ArrowRightOutlined, BgColorsOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const iconKeys = Object.keys(AvatarIcon);

const AvatarSelector = ({ name, onAvatarChange }) => {
    const [avatarIndex, setAvatarIndex] = useState(getRandomAvatarIndex());
    const [selectedColor, setSelectedColor] = useState(getRandomColor());

    useEffect(() => {
        const avatarKey = iconKeys[avatarIndex];
        onAvatarChange({ avatar: avatarKey, color: selectedColor })
    }, [avatarIndex, selectedColor]);

    function getRandomAvatarIndex() {
        return randomNumber(iconKeys.length - 1)
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

    return (
        <AvatarSelectorContainer>
            <Avatar style={{ backgroundColor: selectedColor }} icon={AvatarIcon[iconKeys[avatarIndex]]} size={50} />
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