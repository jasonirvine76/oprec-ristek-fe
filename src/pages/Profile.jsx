import Navbar from '../components/Navbar'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Image from "react-bootstrap/Image";

import './profile.css'

import React, {useEffect, useState, useContext} from 'react'
import axios from 'axios'
import AuthContext from '../context/AuthContext';
import {useNavigate} from 'react-router-dom'


import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';



export default function Profile() {
    const [username, setUserName] = useState('')
    const [name, setName] = useState('')
    const [bio, setBio] = useState('')
    const [feeds, setFeeds] = useState([])
    const [profilePic, setProfilePic] = useState('')
    
    let {user, authToken, logoutUser} = useContext(AuthContext)
    
    
    
    const [showEditModal, setShowEditModal] = useState(false);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false)



    const [editName, setEditName] = useState('')
    const [editBio, setEditBio] = useState('')
    const [picture, setPicture] = useState([])

    const[editMsg, setEditMsg] = useState('')
    const[visible, setVisible] = useState(false)
    const[editId, setEditId] = useState(0)

    const navigate = useNavigate()

    

    const handleEditFeed = () => {
        editFeed()
        setShowEditModal(false)
        setVisible(false)
        setEditMsg('')
    }

    const handleCloseEdit = () => {
        setShowEditModal(false)
    }


    const handleCloseEditProfileModal = () => {
        
        setShowEditProfileModal(false);
    }
    const handleEditProfile = () => {
        if (editName == '' && editBio == '') {
            alert("Name and Bio can't be blank")
        }
        editProfile()
        setShowEditProfileModal(false);
        setEditName('')
        setEditBio('')
    }


    const handleShowEditProfileModal = () => {
        setShowEditProfileModal(true)
    }

   

    const handleShowEdit = (id) => {
        setEditId(id)
        setShowEditModal(true)
    }


    const editProfile = async () => {
        let formData = new FormData()
        formData.append('name', editName)
        formData.append('bio', editBio)
        formData.append('profile_picture', picture)
        console.log(formData.values())

        const payload = {
            name: editName,
            bio: editBio,
            profile_picture: picture
        }
        try {
            const response = await axios.post(`http://127.0.0.1:8000/user/change-profile/`, {
                payload
            }, {
                headers: {
                    Authorization: `Bearer ${authToken.access}`,
                    'Content-Type': 'multipart/form-data'
                }
            }).catch (function (error) {
                if (error.response.status == 401) {
                    logoutUser()
                }
            })
            if (response.status == 200) {
                getProfile()
            }
            console.log(response)
        } catch (e) {
            console.log(e.message)
        }
    }

    const editFeed = async () => {
        try {
            const response = await axios.patch(`http://127.0.0.1:8000/home/${editId}/`, {
                "feed_msg":editMsg,
                "visibility_to_close_friends":visible
            }, {
                headers: {
                    Authorization: `Bearer ${authToken.access}`,
                }
            }).catch(function (error) {
                if (error.response.status == 401) {
                    logoutUser()
                }
            })
            if (response.status == 200) {
                getProfile()
            }
        } catch (e) {
            console.log(e.message)
        }
    }

    const deleteFeed = async (id) => {

        try {
            const response = await axios.delete(`http://127.0.0.1:8000/home/${id}/`, {
                headers: {
                    Authorization: `Bearer ${authToken.access}`,
                }
            }).catch(function (error) {
                if (error.response.status == 401) {
                    logoutUser()
                }
            })
            if (response.status == 201) {
                getProfile()
            }
        } catch (e) {
            console.log(e.message)
        }
    }


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

        if (response.status == 200) {

            setUserName(response.data.username)
            setName(response.data.name)
            setBio(response.data.bio)
            setFeeds(response.data.feeds)
            setProfilePic(response.data.profile_picture)

        }
}
    
    useEffect( () => {
        (
            async () => {
                const response = await axios.get('http://127.0.0.1:8000/user/login/', {
                    headers: {
                    Authorization: `Bearer ${authToken.access}`,
                    },
                }).catch(function (error) {
                    if (error.response.status == 401) {
                        logoutUser()
                    }
                })

                if (response.status == 200) {

                    setUserName(response.data.username)
                    setName(response.data.name)
                    setBio(response.data.bio)
                    setFeeds(response.data.feeds)
                    setProfilePic(response.data.profile_picture)
                }

                    
            }
        )()
    }, [])
    
    return (
        <>  
            <div className="wrapperContainer">

                <Navbar/>
                <div className="homeContainer" style={{display: 'flex', justifyContent: 'center'}}>

                    <div className="row">
                        
                        <div className='profileContainer'>
                            <div className="name-button">
                                <Image src={profilePic} roundedCircle height={60} width={70}/>
                                <h2 className='username-text'>
                                    @{username}
                                </h2>
                                <div style={{marginLeft:"10px"}}>
                                    <Button variant="light" id = "editProfileButton" onClick={() => {handleShowEditProfileModal()}}> Edit Profile </Button>
                                </div>
                            </div>
                            <br></br>
                            <p className='bio-text'>{name}</p>
                            <p className='bio-text'>{bio}</p>
                        </div>
                        <div className='feedContainer'>
                        {
                            feeds.map(feed => {
                                let deleteIcon = null
                                let editButton = null
                                deleteIcon = 
                                <IconButton id = "del-icon" onClick={()=>{deleteFeed(feed.id)}}>
                                    <DeleteIcon/>
                                </IconButton>
                                
                                editButton = <Button variant="primary" onClick={() => {handleShowEdit(feed.id)}}>Edit</Button>

                                return (
                                    <div>
                                        <Card className='customCard'>
                                            <Card.Body>
                                                <div className="card-title">
                                                    <Image src={profilePic} roundedCircle height={40} width={50}/>

                                                    <div className="feed-username">
                                                        <Card.Title>{username}</Card.Title>
                                                    </div>
                                                    <div className="feed-date">
                                                        <Card.Title id="font-date">{feed.created_at}</Card.Title>
                                                    </div>
                                                    
                                                    <div className='delete-icon'>
                                                        
                                                        {deleteIcon}
                                                            
                                                    </div>
                                                </div>
                                                <Card.Text className='feed-msg'>
                                                {feed.feed}
                                                </Card.Text>
                                                {editButton}
                                            </Card.Body>
                                        </Card>
                                        
                                        <br></br>
                                    </div>
                                    
                                )
                            })
                            
                        }
                        </div>  
                    </div>
                </div>
                <Modal show={showEditModal} onHide={handleCloseEdit}>
                    <Modal.Header closeButton>
                    <Modal.Title>Edit Feed</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form>
                        <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlTextarea1"
                        >
                        <Form.Label>Message</Form.Label>
                        <Form.Control as="textarea" rows={3} 
                            onChange={(e) => setEditMsg(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Check 
                            type="switch"
                            id="visibility"
                            label="Show only for close friends"
                            onChange={(e) => setVisible(!visible)}
                        />
                    </Form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEdit}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleEditFeed}>
                        Save Changes
                    </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showEditProfileModal} onHide={handleCloseEditProfileModal}>
                    <Modal.Header closeButton>
                    <Modal.Title>Edit Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form>
                        <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlTextarea1"
                        >
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text"  
                                onChange={(e) => setEditName(e.target.value)}
                            />
                            <Form.Label>Bio</Form.Label>
                            <Form.Control as="textarea" rows={3} 
                                onChange={(e) => setEditBio(e.target.value)}
                            />
                            <Form.Label>Profile Picture</Form.Label>
                            <Form.Control type="file" onChange={(e) => setPicture(e.target.files[0])}/>
                        </Form.Group>
                        
                    </Form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditProfileModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleEditProfile}>
                        Save Changes
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}