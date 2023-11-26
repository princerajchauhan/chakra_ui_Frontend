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
    useDisclosure
} from '@chakra-ui/react'
import React from 'react'

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const capitalize = (word) =>{
        return word[0].toUpperCase() + word.slice(1)
    }
    return <>
        {
            children ? (<span onClick={onOpen}>{children}</span>) : 
            (<IconButton display={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />)
        }
        <Modal size='lg' isOpen={isOpen} onClose={onClose} isCentered>
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
                    />
                    <Text fontSize={{ base: '20px', md: '30px' }}>
                        Email : {user.email}
                    </Text>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </>
}

export default ProfileModal