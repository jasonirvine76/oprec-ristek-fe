import "./navbar.css"
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

import React, {useEffect, useState, useContext} from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';

import Image from "react-bootstrap/Image";
// import Navbar from 'react-bootstrap/Navbar';


export default function Navbar() {
    let {user, authToken, logoutUser} = useContext(AuthContext)
    const [userPicture, setUserPicture] = useState('')

    const getProfile = async () => {
        const response = await axios.get('http://127.0.0.1:8000/user/login/', {
        headers: {
        Authorization: `Bearer ${authToken.access}`,
        },
        }).catch(function (error) {
            if (error.response.status == 401) {
                logoutUser()
            }
        })
        setUserPicture(response.data.profile_picture)
    }
    
    let navigate = useNavigate();
    let profile;
    if (localStorage.getItem('authToken') != null) {
        getProfile()
        profile = 
        <div className="navbarRight">
            <PersonOutlineIcon/>
            <span id="name" >{user.user_id}</span>
        </div>

        profile = 
        <div className="navbarRightLogin">
                <NavDropdown
                title={
                    <span><Image src={userPicture} roundedCircle height={40} width={50} id="dropdown-autoclose-true"/> {user.user_id}</span>
                }
                id="nav-dropdown">
                
                <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Item onClick={ logoutUser }>Logout</NavDropdown.Item>
            </NavDropdown>
        </div>

    } else {
        profile = 
        <div className="navbarRight">
            <Nav>
            
                <Nav.Link href="/login">
                    <Button bsPrefix="custom-btn">Login</Button>{' '}
                </Nav.Link>
                <Nav.Link eventKey={2} href="/register">
                    <Button bsPrefix="custom-btn">Register</Button>{' '}
                </Nav.Link>
            </Nav>
        </div>
    }
    return (
        <div className="navbarContainer">
            <div className="navbarLeft">
                <a href="/">
                    <Image src={process.env.PUBLIC_URL + "3433898.png"} width="50" />
                </a>
                <span>RISTEK MedSOS</span>
            </div>
            
            {profile}
        </div>
    )
}