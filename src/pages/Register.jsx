import Navbar from "../components/Navbar";
import React from 'react';
import Form from 'react-bootstrap/Form';
import {useEffect, useState, useContext} from 'react'
import {useNavigate} from 'react-router-dom'


import "./register.css"
import axios from "axios";


export default function Register() {
    const [name, setName] = useState('')
    const [bio, setBio] = useState('')
    const [username, setUsername] = useState('')
    const[password, setPassword] = useState('')
    const[rePassword, setRePassword] = useState('')

    const navigate = useNavigate()
    const registerAccount = async () => {
        if (password != rePassword) {
            alert("Password is not same")
        } else {
            try {
                const response = await axios.post(`http://127.0.0.1:8000/user/register/`, {
                    "username":username,
                    "password":password,
                    "name":name,
                    "bio":bio,
                }, 
                ).catch (function (error) {
                    if (error.response.status == 401) {
                        alert("An error has occured")
                    }
                })
                console.log(response.status)
                if (response.status == 201) {
                    navigate('/')
                }
            } catch (e) {
                console.log(e.message)
            }
        }
    }


    return (
        <>
            <Navbar/>
            <div className="Auth-form-container">
                <form className="Auth-form">
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title">Register</h3>
                        <div className="form-group mt-3">
                            <label>Username</label>
                            <input
                            type="text"
                            className="form-control mt-1"
                            placeholder="Enter username"
                            onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Name</label>
                            <input
                            type="text"
                            className="form-control mt-1"
                            placeholder="Enter name"
                            onChange={(e) => setName(e.target.value)}

                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Bio</label>
                            <Form.Control as="textarea" rows={3} placeholder="Enter bio" onChange={(e) => setBio(e.target.value)}/>

                        </div>
                        <div className="form-group mt-3">
                            <label>Password</label>
                            <input
                            type="password"
                            className="form-control mt-1"
                            placeholder="Enter password"
                            onChange={(e) => setPassword(e.target.value)}

                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Re-enter Password</label>
                            <input
                            type="password"
                            className="form-control mt-1"
                            placeholder="Re-enter password"
                            onChange={(e) => setRePassword(e.target.value)}
                            />
                        </div>
                        <div className="d-grid gap-2 mt-3">
                            <button onClick={() => registerAccount()} className="btn btn-primary">
                            Register
                            </button>
                        </div>
                        
                    </div>
                </form>
            </div>
        </>
    )
}