import Navbar from "../components/Navbar";
import React, {useEffect, useState, useContext} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import "./login.css"
import AuthContext from "../context/AuthContext";
export default function Login() {
    // const [feeds, setFeeds] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    // const [token, setToken] = useEffect('')
    const navigate = useNavigate()

    // const login = async (e) => {
    //     e.preventDefault()
    //     try {
    //         let response = await axios.post('http://127.0.0.1:8000/user/login/', {
    //             username: username,
    //             password: password
    //         })
    //         console.log(response.data)
    //         navigate('/')
    //     } catch(e) {
    //         console.log(e.message)
    //     }
    // }

   
    let {loginUser} = useContext(AuthContext)
    return (
        <>
            <Navbar/>
            <div className="Auth-form-container">
                <form onSubmit = { loginUser } className="Auth-form">
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title">Sign In</h3>
                        <div className="form-group mt-3">
                            <label>Username</label>
                            <input
                            type="text"
                            className="form-control mt-1"
                            placeholder="Enter username"
                            name="username"
                            value = {username}
                            onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Password</label>
                            <input
                            type="password"
                            className="form-control mt-1"
                            placeholder="Enter password"
                            name="password"
                            value = {password}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="d-grid gap-2 mt-3">
                            <button className="btn btn-primary">
                            Log in
                            </button>
                        </div>
                        <div className="registerButton">
                            <p className="forgot-password text-right mt-2">
                                <a href="/register">Register</a>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}