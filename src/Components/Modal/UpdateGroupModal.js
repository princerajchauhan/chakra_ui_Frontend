import { ViewIcon } from '@chakra-ui/icons'
import {
    Box,
    Button,
    FormControl,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    useDisclosure
} from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import { ChatContext } from '../../Context/ChatContext'
import UserBadgeItem from '../User Avatar/UserBadgeItem'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import UserListItem from '../User Avatar/UserListItem'

const UpdateGroupModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [groupName, setGroupName] = useState()
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)

    const { user, selectedChat, setSelectedChat } = useContext(ChatContext)

    const addUser = async (user1) => {
        if (selectedChat.users.find(u => u._id === user1._id)) {
            toast("user already added to the group", { theme: 'colored', type: 'warning' })
            return
        }
        if (selectedChat.groupAdmin._id !== user.user._id) {
            toast("only admins can add new user", { theme: 'colored', type: 'warning' })
            return
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put("https://prince-chat.onrender.com/chat/groupadd", {
                chatId: selectedChat._id,
                userId: user1._id
            }, config)
            toast("user added to the group", { theme: 'colored', type: 'success' })
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false)
        } catch (error) {
            toast("user not added to the group", { theme: 'colored', type: 'error' })
            setLoading(false)
        }
    }

    const removeUser = async (user1) => {
        if (selectedChat.groupAdmin._id !== user.user._id && user1._id !== user.user._id) {
            toast("only admins can remove user from group", { theme: 'colored', type: 'warning' })
            return
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put("https://prince-chat.onrender.com/chat/groupremove", {
                chatId: selectedChat._id,
                userId: user1._id
            }, config)
            toast("user removed from the group", { theme: 'colored', type: 'success' })
            user1._id === user.user._id ? setSelectedChat() : setSelectedChat(data)
            fetchMessages()
            setFetchAgain(!fetchAgain)
            setLoading(false)
        } catch (error) {
            toast("user not removed from the group", { theme: 'colored', type: 'error' })
            setLoading(false)
        }
    }


    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            setSearchResult([])
            return
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`http://localhost:3009/api/users?search=${search}`, config)
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast("Failed to load users", { theme: "colored", type: "error" })
        }
    }

    const handleRename = async () => {
        if (!groupName) return

        try {
            setRenameLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put("http://localhost:3009/chat/rename", {
                chatId: selectedChat._id,
                chatName: groupName
            }, config)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            toast("group name updated", { type: 'success', theme: 'colored' })
            setRenameLoading(false)
        } catch (error) {
            toast("group name not updated", { type: 'error', theme: 'colored' })
        }
    }

    return (
        <>
            <IconButton icon={<ViewIcon />} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="30px"
                        display="flex"
                        justifyContent="center"
                    >{selectedChat.chatName.toUpperCase()}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w="100%" display="flex" alignItems="flex-start" gap={1} mb={2}>
                            {selectedChat.users.map(u =>
                                <UserBadgeItem key={u._id} user={u} handleFun={() => removeUser(u)} />
                            )}
                        </Box>
                        <FormControl display="flex">
                            <Input placeholder="Group name" mb={3} onChange={(e) => setGroupName(e.target.value)} />
                            <Button
                                colorScheme="purple"
                                color="white"
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input placeholder="Add users" mb={1} onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>
                        {
                            loading ? <Spinner /> :
                                search !== "" ? searchResult?.slice(0, 4).map((user) =>
                                    <UserListItem key={user._id} user={user} handleFun={() => addUser(user)} />) : ''
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={() => removeUser(user)} bg="red">
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupModal