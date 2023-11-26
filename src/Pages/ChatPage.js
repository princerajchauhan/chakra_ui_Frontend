import React, { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../Context/ChatContext'
import { Box } from '@chakra-ui/layout'
import SearchCompo from '../Components/SearchCompo'
import { useNavigate } from 'react-router-dom'
import ChatBox from '../Components/ChatBox'
import AllChats from '../Components/AllChats'

const ChatPage = () => {
    const { user } = useContext(ChatContext)
    const [fetchAgain, setFetchAgain] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        if (!JSON.parse(localStorage.getItem("mernChatInfo"))) {
            navigate("/")
        }
    })
    return (
        <div style={{ width: "100%", backgroundColor: "gray", height: '100vh' }}>
            {user && <SearchCompo />}
            <Box display="flex" justifyContent="space-between" w="100%" h="90vh">
                {user && <AllChats fetchAgain={fetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>
    )
}

export default ChatPage