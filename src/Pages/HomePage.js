import React, { useEffect, useState } from 'react'
import Login from '../Components/Login Register/Login'
import Signup from '../Components/Login Register/Signup'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
    const [show, setShow] = useState(true)
    const navigate = useNavigate()
    useEffect(() => {
        if (JSON.parse(localStorage.getItem("mernChatInfo"))) {
            navigate("/chats")
        }
    }, [navigate])

    return (
        <div className='homepage'>
            <h1>Welcome to ChatLive</h1>
            <div className="btnStyles">
                <button onClick={() => setShow(!show)} style={show ? { backgroundColor: 'orange' } : { backgroundColor: 'white' }}>Login</button>
                <button onClick={() => setShow(!show)} style={show ? { backgroundColor: 'white' } : { backgroundColor: 'orange' }}>Register</button>
            </div>
            {
                show ? <Login /> : <Signup />
            }
        </div>
    )
}

export default HomePage