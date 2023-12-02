import { Box } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { ChatContext } from '../Context/ChatContext'
import SingleChat from './SingleChat'

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat } = useContext(ChatContext)
    return (
        <Box
            display={{ base: selectedChat ? "flex" : "none", md: 'flex' }}
            alignItems="center"
            flexDir="column"
            p={3}
            bg="white"
            borderRadius="lg"
            borderWidth="1px"
            w={{base:'100%', md:'68%'}}
            my={5}
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    )
}

export default ChatBox