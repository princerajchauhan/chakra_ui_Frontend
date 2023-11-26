import React, { useContext, useEffect, useState } from "react"
import { ChatContext } from "../Context/ChatContext"
import { Box, FormControl, IconButton, Input, Spinner, Text } from "@chakra-ui/react"
import { ArrowBackIcon } from "@chakra-ui/icons"
import { getSender, getSenderDetail } from "./ChatLogics"
import ProfileModal from "./Modal/ProfileModal"
import UpdateGroupModal from "./Modal/UpdateGroupModal"
import axios from "axios"
import { toast } from "react-toastify"
import "./Styles.css"
import SendReceiveMsg from "./SendReceiveMsg"
import io from 'socket.io-client'

const socket = io("http://localhost:3009")
var selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const { user, selectedChat, setSelectedChat, notification, setNotification } = useContext(ChatContext)
    const [message, setMessage] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState()
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [istyping, setIsTyping] = useState(false)

    useEffect(() => {
        // console.log("connect")
        socket.emit('setup', user.user)
        socket.on("connected", () => setSocketConnected(true))
        socket.on("typing", () => setIsTyping(true))
        socket.on("stop typing", () => setIsTyping(false))
         // eslint-disable-next-line
    }, [])

    const fetchMessages = async () => {
        if (!selectedChat) return
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            // console.log(selectedChat)
            const { data } = await axios.get(`http://localhost:3009/message/allmsg/${selectedChat._id}`, config)
            // console.log(message)
            setMessage(data)
            setLoading(false)
            socket.emit("joinRoom", selectedChat._id)
        } catch (error) {
            toast("Failed to load message.", { theme: "colored", type: "error" })
        }
    }

    useEffect(() => {
        fetchMessages()
        selectedChatCompare = selectedChat
        // eslint-disable-next-line
    }, [selectedChat])

    // console.log(notification, "----------------------")

    useEffect(() => {
        socket.on("message received", newMessageReceived => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                if (!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification])
                    setFetchAgain(!fetchAgain)
                }
            }
            else {
                setMessage([...message, newMessageReceived])
            }
        })
    })

    const sendMsg = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id)
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }
                setNewMessage("")
                const { data } = await axios.post("http://localhost:3009/message/send", {
                    message: newMessage,
                    chatId: selectedChat._id
                }, config)

                console.log(data)
                socket.emit("newMessage", data)
                setMessage([...message, data])

            } catch (error) {
                toast("Failed to send message", { theme: 'colored', type: 'error' })
            }
        }
    }
    const typeHandler = (event) => {
        setNewMessage(event.target.value)

        if (!socketConnected) return

        if (!typing) {
            setTyping(true)
            socket.emit("typing", selectedChat._id)
        }

        let lastTypingTime = new Date().getTime()
        let timerLength = 3000
        setTimeout(() => {
            var timeNow = new Date().getTime()
            var timeDiff = timeNow - lastTypingTime
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id)
                setTyping(false)
            }
        }, timerLength);

    }

    return (
        <>
            {
                selectedChat ? <>
                    <Text
                        fontSize={{ base: "25px", md: '30px' }}
                        pb={3}
                        px={2}
                        w="100%"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton display={{ base: "flex", md: "none" }} icon={<ArrowBackIcon />} onClick={() => setSelectedChat("")} />
                        {
                            selectedChat.isGroupChat ? (<>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
                            </>) : (
                                <>
                                    {getSender(user.user, selectedChat.users).toUpperCase()}
                                    <ProfileModal user={(getSenderDetail(user.user, selectedChat.users))} />
                                </>)
                        }
                    </Text>
                    <Box
                        display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#3d403f"
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="hidden"
                    >
                        {
                            loading ?
                                <Spinner
                                    size="xl"
                                    w={20}
                                    h={20}
                                    alignSelf="center"
                                    margin="auto"
                                /> :
                                <div className="send-receive-msg">
                                    <SendReceiveMsg message={message} />
                                </div>
                        }

                        <FormControl onKeyDown={sendMsg} isRequired mt={3}>
                            {istyping ? <div style={{marginLeft: '10px', marginBottom:'5px'}}>typing...</div> : (<></>)}
                            <Input
                                variant="filled"
                                bg="#E0E0E0"
                                placeholder="write message here...."
                                onChange={typeHandler}
                                value={newMessage}
                            />
                        </FormControl>

                    </Box>
                </> :
                    <Box display="flex" height="100%" alignItems="center" justifyContent="center" backgroundColor="#202724" width="100%">
                        <Text fontSize="3xl" pb={3} color="white">
                            Select user for chatting
                        </Text>
                    </Box>
            }
        </>
    )
}

export default SingleChat