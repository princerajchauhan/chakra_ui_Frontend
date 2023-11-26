import { createContext, useEffect, useState } from "react";

export const ChatContext = createContext()

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState()
    const [selectedChat, setSelectedChat] = useState()
    const [chats, setChats] = useState([])
    const [notification, setNotification] = useState([])


    useEffect(() => {
        const mernChatInfo = JSON.parse(localStorage.getItem("mernChatInfo"))
        // console.log(mernChatInfo)
        setUser(mernChatInfo)
    }, [])

    return <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification }}>
        {children}
    </ChatContext.Provider>
}

export default ChatProvider