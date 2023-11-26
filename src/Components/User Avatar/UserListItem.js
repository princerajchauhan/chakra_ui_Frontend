import React from 'react'
import { Avatar, Box, Text } from '@chakra-ui/react'

const UserListItem = ({user, handleFun}) =>{
    return(
        <Box
            onClick={handleFun}
            cursor='pointer'
            bg="#E8E8E8"
            _hover={{
                background: "#38B2AC",
                color:'white'
            }}
            w='100%'
            display='flex'
            alignItems='center'
            color='black'
            borderRadius='lg'
            px={3}
            py={2}
            mt={2}
        >
            <Avatar
            mr={2}
            size='sm'
            cursor='pointer'
            name={user.name}
            src={user.profile}
            />
            <Box>
                <Text>{user.name}</Text>
                <Text fontSize='xs'>
                    <b>Email: </b>{user.email}
                </Text>
            </Box>
        </Box>
    )
}

export default UserListItem