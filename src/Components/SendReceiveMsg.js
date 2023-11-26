import React, { useContext } from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMsg, isSameSender, isSameSenderMargin, isSameUser } from './ChatLogics'
import { ChatContext } from '../Context/ChatContext'
import { Tooltip, Avatar } from "@chakra-ui/react"

const SendReceiveMsg = ({ message }) => {

    const { user } = useContext(ChatContext)

    return (
        <ScrollableFeed>
            {
                message && message.map((m, i) => (
                    <div style={{ display: 'flex' }} key={m._id}>
                        {
                            (isSameSender(message, m, i, user.user._id) || isLastMsg(message, i, user.user._id)) && (
                                <Tooltip label={m.sender.name} placement='bottom-start' hasArrow>
                                    <Avatar
                                        mt="10px"
                                        mr={1}
                                        size="sm"
                                        cursor="pointer"
                                        name={m.sender.name}
                                        src={m.sender.profile}
                                    >
                                    </Avatar>
                                </Tooltip>
                            )
                        }
                        <span style={{
                            backgroundColor: `${m.sender._id === user.user._id ? "#227222" : "#233548"}`,
                            color: 'white',
                            borderRadius: "5px",
                            maxWidth: '75%',
                            padding: '5px 15px',
                            marginLeft: isSameSenderMargin(message, m, i, user.user._id),
                            marginTop: isSameUser(message, m, i) ? 3 : 10
                        }}>
                            {m.message}
                        </span>
                    </div>
                ))
            }
        </ScrollableFeed>
    )
}

export default SendReceiveMsg