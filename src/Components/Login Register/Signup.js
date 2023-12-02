import "./Register.css"
import React, { useContext, useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@chakra-ui/button'
import { ChatContext } from "../../Context/ChatContext";
import { BiSolidShow, BiSolidHide } from "react-icons/bi";

const Signup = () => {

    const { setUser } = useContext(ChatContext)

    const [showHide, setShowHide] = useState(true)

    const [value, setValue] = useState({
        name: '',
        email: '',
        password: ''
    })

    const [profile, setProfile] = useState()
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const clickHandle = (event) => {
        setValue({ ...value, [event.target.name]: event.target.value })
    }

    const imgDetails = (pics) => {
        console.log(pics)
        setLoading(true)
        if (pics === undefined) {
            toast("Please Select an image!", { type: 'warning', theme: "colored" })
            return;
        }
        if (pics.type === "image/jpeg" || pics.type === "image/jpg" || pics.type === "image/png") {
            const data = new FormData()
            data.append("file", pics)
            data.append("upload_preset", "mern-chat")
            data.append("cloud_name", "duzstta2v")
            fetch("https://api.cloudinary.com/v1_1/duzstta2v/image/upload", {
                method: "POST",
                body: data
            }).then(res => res.json())
                .then((data) => {
                    setProfile(data.url.toString())
                    // console.log(data.url.toString())
                    setLoading(false)
                }).catch(err => {
                    console.log(err)
                    setLoading(false)
                })
        }
        else {
            toast("Please Select an formatted image!", { type: 'warning', theme: "colored" })
            setLoading(false)
            return;
        }
    }

    const submitForm = async (event) => {
        event.preventDefault()
        if (!value.name || !value.email || !value.password) {
            toast("All fields are required", { type: "warning", theme: "colored" })
            setLoading(false)
            return
        }
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }
            await axios.post("https://prince-chat.onrender.com/api/register",
                { ...value, profile },
                config
            ).then(res => {
                if (!res.data.msg2) {
                    toast(res.data.msg, { type: 'error', theme: "colored" });
                    setLoading(false)
                }
                else {
                    toast(res.data.msg, { type: 'success', theme: 'colored' })
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
        <div className='register'>
            <form method='POST'>

                <div className="registStyle">
                    <h2 data-text="Register Here">Register Here</h2>
                </div>

                <label htmlFor="">Name</label>
                <input type="text" name='name' value={value.name} onChange={clickHandle} required className="input" /><br />

                <label htmlFor="">Email</label>
                <input type="email" name='email' value={value.email} onChange={clickHandle} required className="input" /><br />

                <label htmlFor="">Password</label>
                <input type={showHide ? "password" : "text"} name='password' value={value.password} onChange={clickHandle} required className="input" /><br />
                {
                    showHide ? <BiSolidHide className="pass-show-hide" onClick={() => setShowHide(!showHide)} /> :
                               <BiSolidShow className="pass-show-hide" onClick={() => setShowHide(!showHide)} />
                }

                <label htmlFor="">Upload Profile</label>
                <input type="file" accept="image/*" onChange={(e) => imgDetails(e.target.files[0])} className="profileInput" /><br />

                {/* <label className="forgot">Forgot Password</label> */}
                {/* <button type='submit' className="registerBtn">Register</button> */}

                <Button
                    colorScheme='blue'
                    color="white"
                    width="100%"
                    style={{ marginTop: 15 }}
                    onClick={submitForm}
                    isLoading={loading}
                >Register</Button>
                {/* <p>ALready registered? <Link to="/login">Click Here</Link></p> */}

            </form>
        </div>
    )
}

export default Signup