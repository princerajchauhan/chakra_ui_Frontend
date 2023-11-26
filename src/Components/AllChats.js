import React, { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../Context/ChatContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Avatar, Box, Button, Stack, Text } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender, getSenderDetail } from './ChatLogics';
import GroupChatModal from './Modal/GroupChatModal';

const AllChats = ({ fetchAgain }) => {
    const [loginUser, setLoginUser] = useState()
    const { user, selectedChat, setSelectedChat, chats, setChats } = useContext(ChatContext)
    const fetchAllChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.get(`http://localhost:3009/chat/fetch`, config)
            setChats(data)
        } catch (error) {
            toast("Not found the chats of user", { type: "error", theme: "colored" })
        }
    }

    useEffect(() => {
        if (JSON.parse(localStorage.getItem("mernChatInfo"))) {
            setLoginUser(JSON.parse(localStorage.getItem("mernChatInfo")))
        }
        fetchAllChats()
        // eslint-disable-next-line
    }, [fetchAgain])

    return <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        p={3}
        m={5}
        bg='white'
        w={{ base: "100%", md: '31%' }}
        borderRadius="lg"
        borderWidth="1px"
    >
        <Box
            pb={3}
            px={3}
            fontSize={{ base: '28px', md: "22px" }}
            display="flex"
            w="100%"
            justifyContent="space-between"
            alignItems="center"
        >
            Chats
            <GroupChatModal>
                <Button
                    display="flex"
                    fontSize={{ base: "17px", md: '15px', lg: '17px' }}
                    rightIcon={<AddIcon />}
                >
                    Create Group
                </Button>
            </GroupChatModal>
        </Box>
        <Box
            display="flex"
            flexDir="column"
            p={3}
            bg="lightgray"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
            backgroundColor="#202724"
        >
            {
                chats ? (
                    <Stack overflowY="scroll">
                        {
                            chats.map(chat => (
                                <Box onClick={() => setSelectedChat(chat)}
                                    cursor="pointer"
                                    bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                                    color={selectedChat === chat ? "white" : "black"}
                                    key={chat._id}
                                    borderRadius="lg"
                                    px={3}
                                    display="flex"
                                    alignItems="center"
                                    py={2}
                                >
                                    {
                                        loginUser && <>
                                            <Avatar
                                                mr={2}
                                                size='sm'
                                                cursor='pointer'
                                                name={getSenderDetail(loginUser.user, chat.users).name}
                                                src={getSenderDetail(loginUser.user, chat.users).profile}
                                            />
                                            <Text>
                                                {!chat.isGroupChat ?
                                                    <>{getSender(loginUser.user, chat.users)}
                                                        <Text fontSize='xs'>
                                                            <b>Email: </b>{getSenderDetail(loginUser.user, chat.users).email}
                                                        </Text> </> : chat.chatName}
                                            </Text>
                                        </>
                                    }
                                </Box>
                            ))
                        }
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
        </Box>
    </Box>
}

export default AllChats