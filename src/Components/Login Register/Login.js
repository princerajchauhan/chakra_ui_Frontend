import "./Login.css"
import axios from 'axios'
import React, { useContext, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@chakra-ui/button'
import { ChatContext } from "../../Context/ChatContext";
import { BiSolidShow, BiSolidHide } from "react-icons/bi";

const Login = () => {

    const { setUser } = useContext(ChatContext)

    const [showHide, setShowHide] = useState(true)

    const [value, setValue] = useState({
        email: '',
        password: ''
    })

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const clickHandle = (event) => {
        setValue({ ...value, [event.target.name]: event.target.value })
    }

    const submitForm = async (e) => {
        e.preventDefault()
        setLoading(true)
        if (!value.email || !value.password) {
            toast("All fields are required", { type: "warning", theme: "colored" })
            setLoading(false)
            return
        }
        try {
            await axios.post("https://prince-chat.onrender.com/api/login", value, {
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => {
                if (!res.data.msg2) {
                    toast(res.data.msg, { type: 'error', theme: "colored" });
                    setLoading(false)
                }
                else {
                    toast(res.data.msg, { type: 'success', theme: "colored" });
                    localStorage.setItem("mernChatInfo", JSON.stringify(res.data))
                    setUser(res.data)
                    setLoading(false)
                    navigate("/chats")
                }
            })
        } catch (error) {
            setLoading(false)
            toast("Error occured", { type: 'error', theme: "colored" });
        }
    }

    return (
        <div className='login'>

            <form onSubmit={submitForm}>
                <div className="logstyle">
                    <h2 data-text="Login...">Login...</h2>
                </div>
                <label htmlFor="">Email</label>
                <input type="email" name='email' value={value.email} onChange={clickHandle} /><br />

                <label htmlFor="">Password</label>
                <input type={showHide ? "password" : "text"} name='password' autoComplete="off" value={value.password} onChange={clickHandle} /><br />
                {
                    showHide ? <BiSolidHide className="log-show-hide" onClick={() => setShowHide(!showHide)} /> :
                        <BiSolidShow className="log-show-hide" onClick={() => setShowHide(!showHide)} />
                }

                <label className="forgot">Forgot Password</label>

                <Button
                    colorScheme='green'
                    color="white"
                    width="100%"
                    style={{ marginTop: 15 }}
                    onClick={submitForm}
                    isLoading={loading}
                >Sign in</Button>

                {/* <p>Not registered yet? <Link to="/register">Click Here</Link></p> */}

            </form>
        </div>
    )
}

export default Login