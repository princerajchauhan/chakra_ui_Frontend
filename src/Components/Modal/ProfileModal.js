import { ViewIcon } from '@chakra-ui/icons'
import {
    Button,
    IconButton,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
    Box
} from '@chakra-ui/react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useContext, useState } from 'react'
import { FaCamera } from "react-icons/fa";
import axios from "axios"
import { ChatContext } from '../../Context/ChatContext';

const ProfileModal = ({ user, children }) => {

    const [newProfile, setNewProfile] = useState()
    const [loading, setLoading] = useState(false)

    const { setUser } = useContext(ChatContext)

    const { isOpen, onOpen, onClose } = useDisclosure()
    const capitalize = (word) => {
        return word[0].toUpperCase() + word.slice(1)
    }

    const imgDetails = (pics) => {
        // console.log(pics)
        if (pics === undefined) {
            toast("Please Select an image!", { type: 'warning', theme: "colored" })
            return;
        }
        if (pics.type === "image/jpeg" || pics.type === "image/jpg" || pics.type === "image/png") {
            setLoading(true)
            const data = new FormData()
            data.append("file", pics)
            data.append("upload_preset", "mern-chat")
            data.append("cloud_name", "duzstta2v")
            fetch("https://api.cloudinary.com/v1_1/duzstta2v/image/upload", {
                method: "POST",
                body: data
            }).then(res => res.json())
                .then((data) => {
                    setNewProfile(data.url.toString())
                    // console.log(data.url.toString())
                    setLoading(false)
                }).catch(err => {
                    console.log(err)
                    setLoading(false)
                })
        }
        else {
            toast("Only support JPEG/PNG/JPG", { type: 'warning', theme: "colored" })
            return;
        }

    }

    const changeProfile = async () => {
        // console.log(newProfile)
        if (!newProfile) {
            toast("Please select image to upload", { type: 'warning', theme: 'colored' })
            return
        }
        try {
            const token = JSON.parse(localStorage.getItem("mernChatInfo")).token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            await axios.put("https://prince-chat.onrender.com/api/updateprofile",
                { newProfile, token },
                config
            ).then(res => {
                if (!res.data.msg2) {
                    toast(res.data.msg, { type: 'error', theme: "colored" });
                }
                else {
                    toast(res.data.msg, { type: 'success', theme: "colored" });
                    localStorage.setItem("mernChatInfo", JSON.stringify(res.data))
                    setUser(res.data)
                    setNewProfile(undefined)
                }
            })
        } catch (error) {
            toast(error.message, { theme: 'colored', type: 'error' })
        }
    }


    return <>
        {
            children ? (<span onClick={onOpen}>{children}</span>) :
                (<IconButton display={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />)
        }
        <Modal size={{ base: 'sm', md: 'lg' }} isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader
                    fontSize='40px'
                    display="flex"
                    justifyContent="center"
                >{capitalize(user.name)}</ModalHeader>
                <ModalCloseButton />
                <ModalBody display='flex' flexDir="column" alignItems="center" justifyContent="space-between">
                    <Image
                        borderRadius="full"
                        boxSize='150px'
                        src={user.profile}
                        alt={user.name}
                        style={{border:'2px solid gray'}}
                    />
                    {
                        !children ? '':
                            <Box display='flex' alignItems='center' gap="1" >
                                <label htmlFor="pic-upload" className='update-image'>
                                    <div className='update-camera' >
                                        <FaCamera />
                                    </div>
                                    <input type="file" accept="image/*" id='pic-upload' onChange={(e) => imgDetails(e.target.files[0])} className="profileInput" /><br />
                                </label>
                                <Button colorScheme='green' isLoading={loading} onClick={changeProfile}>Update Profile</Button>
                            </Box>
                    }
                    <Text fontSize={{ base: '20px', md: '30px' }}>
                        Email : {user.email}
                    </Text>
                </ModalBody>

                <ModalFooter pt='0'>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </>
}

export default ProfileModal