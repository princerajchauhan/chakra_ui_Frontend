import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({user, handleFun}) =>{
    return(
        <Box
            px={3}
            py={1}
            borderRadius="lg"
            fontSize={12}
            color="white"
            backgroundColor="green"
            cursor="pointer"
        >
            {user.name}
            <CloseIcon pl={1} onClick={handleFun}/>
        </Box>
    )
}

export default UserBadgeItem