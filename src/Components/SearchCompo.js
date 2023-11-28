import {
    Avatar,
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Text,
    Tooltip,
    useDisclosure,
    Input,
    Spinner
} from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import React, { useContext, useState } from 'react'
import { ChatContext } from '../Context/ChatContext'
import ProfileModal from './Modal/ProfileModal'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import ChatLoading from './ChatLoading'
import UserListItem from './User Avatar/UserListItem'
import { getSender } from './ChatLogics'
// import NotificationBadge from 'react-notification-badge';

const SearchCompo = () => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()

    const navigate = useNavigate()

    const { user, setSelectedChat, chats, setChats, notification, setNotification } = useContext(ChatContext)
    // console.log(user.user)

    const searchHandler = async () => {
        if (!search) {
            toast("Please write something in search", { type: "warning", theme: 'colored' })
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
            toast("Failed to load the search results", { type: "error", theme: 'colored' })
        }

    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true)
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post(`https://prince-chat.onrender.com/chat/access`, { userId }, config)
            if (!chats.find(e => e._id === data._id)) setChats([data, ...chats])
            console.log(data)
            setSelectedChat(data)
            setLoadingChat(false)
            onClose()

        } catch (error) {
            toast("Chat does not load", { type: "error", theme: "colored" })
        }
    }

    return <>
        <Box
            display="flex"
            w="100%"
            bg="lightgray"
            p='5px 10px'
            justifyContent='space-between'
            alignItems='center'
            borderWidth='5px'
            backgroundColor="#202724"
            color="lightgray"
        >
            <Tooltip label="search for users" hasArrow placement='bottom'>
                <Button onClick={onOpen}>
                    <i className="fa-solid fa-magnifying-glass" style={{color:'black'}}></i>
                    <Text display={{ base: 'none', md: 'flex' }} px='4' style={{color:'black'}}>Search user</Text>
                </Button>
            </Tooltip>
            <Text fontSize='2xl' className='chat-live'>Chat Live</Text>
            <div>
                <Menu>
                    <MenuButton p={1}  className='bell-icon'>
                        {/* <NotificationBadge
                            count={notification.length}
                        /> */}
                        <BellIcon fontSize="2xl" m={1} color="#f9ff0c"/>
                        <span className='bell-notify'>{notification.length>0?notification.length:''}</span>
                    </MenuButton>
                    <MenuList pl={2}>
                        {!notification.length && <span style={{color:'black'}}>No New Messages</span>}
                        {notification.map(notif => (
                            <MenuItem
                                key={notif._id}
                                onClick={() => {
                                    setSelectedChat(notif.chat);
                                    setNotification(notification.filter(n => n !== notif))
                                }}
                            >
                                {
                                    notif.chat.isGroupChat ?
                                        <div style={{ color: 'red' }}>
                                            {notif.chat.chatName}
                                            <p style={{ color: 'black', fontSize: '14px', maxWidth: "160px" }}>{notif.message}</p>
                                        </div> :
                                        <div style={{ color: 'red', display: 'flex', columnGap: '5px' }}>
                                            {getSender(user.user, notif.chat.users)}:
                                            <p style={{ color: 'black', fontSize: '14px', maxWidth: "160px" }}>{notif.message}</p>
                                        </div>
                                }
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />} >
                        <Avatar size="sm" cursor="pointer" name={user.user.name} src={user.user.profile} />
                    </MenuButton>
                    <MenuList style={{color:'black'}}>
                        <ProfileModal user={user.user}>
                            <MenuItem>My Profile</MenuItem>
                        </ProfileModal>
                        <MenuDivider />
                        <MenuItem onClick={() => { localStorage.removeItem("mernChatInfo"); navigate("/") }}>Logout</MenuItem>
                    </MenuList>
                </Menu>
            </div>
        </Box>
        <Drawer placement='left' onClose={onClose} isOpen={isOpen} >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader borderBottomWidth='1px' >Search user</DrawerHeader>
                <DrawerBody>
                    <Box display="flex" pd={2}>
                        <Input
                            placeholder='search by name or email'
                            mr={2}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button onClick={searchHandler}>Go</Button>
                    </Box>
                    {
                        loading ? <ChatLoading /> :
                            (
                                searchResult?.map(user => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFun={() => accessChat(user._id)}
                                    />
                                ))
                            )
                    }
                    {loadingChat && <Spinner ml='auto' display='flex' />}
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    </>
}

export default SearchCompo