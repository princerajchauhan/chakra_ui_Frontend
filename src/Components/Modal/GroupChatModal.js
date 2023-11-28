import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { ChatContext } from "../../Context/ChatContext";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserListItem from "../User Avatar/UserListItem";
import UserBadgeItem from "../User Avatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupName, setGroupName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)

    const { user, chats, setChats } = useContext(ChatContext)

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
            const { data } = await axios.get(`https://prince-chat.onrender.com/api/users?search=${search}`, config)
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast("Failed to load users", { theme: "colored", type: "error" })
        }
    }

    const handleSubmit = async () => {
        if (!groupName) {
            toast("Group name is required", { theme: 'colored', type: 'warning' })
            return
        }
        if (selectedUsers.length < 2) {
            toast("More than 1 users are required", { theme: 'colored', type: 'warning' })
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.post("https://prince-chat.onrender.com/chat/group", {
                name: groupName,
                users: JSON.stringify(selectedUsers.map(u => u._id))
            }, config)

            toast("Group created", { theme: 'colored', type: "success" })
            setChats([data, ...chats])
            onClose()
        } catch (error) {
            toast("Failed to create group", { theme: 'colored', type: "error" })
        }
    }

    const handleDelete = (userToDelete) => {
        setSelectedUsers(selectedUsers.filter(u => u._id !== userToDelete._id))
    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast("user already added", { type: "warning", theme: 'colored' })
            return
        }

        setSelectedUsers([...selectedUsers, userToAdd])
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        display="flex"
                        justifyContent="center"
                    >Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDir="column"
                        alignItems="center"
                    >
                        <FormControl>
                            <Input placeholder="Group name" mb={3} onChange={(e) => setGroupName(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <Input placeholder="Add users" mb={1} onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>
                        <Box w="100%" display="flex" alignItems="flex-start" gap={1}>
                            {selectedUsers.map(u => <UserBadgeItem key={u._id} user={u} handleFun={() => handleDelete(u)} />)}
                        </Box>
                        {
                            loading ? <Spinner /> :
                                search !== "" ? searchResult?.slice(0, 4).map((user) =>
                                    <UserListItem key={user._id} user={user} handleFun={() => handleGroup(user)} />) : ''
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                            Create Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal