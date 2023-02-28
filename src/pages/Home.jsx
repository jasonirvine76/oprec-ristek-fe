import React, {useEffect, useState, useContext} from 'react'

import axios from 'axios'

import Navbar from '../components/Navbar'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';


import AuthContext from "../context/AuthContext";
import Selectmultidropdown from "../components/MultiDropdown"

import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

import "./home.css";


export default function Home() {
    const [feeds, setFeeds] = useState([])
    const [feed_msg, setFeedMsg] = useState('')
    const [username, setUsername] = useState([])
    const [userPicture, setUserPicture] = useState('')
    let {user, authToken, logoutUser} = useContext(AuthContext)

    const [show, setShow] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const[editMsg, setEditMsg] = useState('')
    const[visible, setVisible] = useState(false)
    const[editId, setEditId] = useState(0)


    const handleClose = () => {
        setShow(false);
    }

    const handleEditFeed = () => {
        editFeed()
        setShowEditModal(false)
        setVisible(false)
        setEditMsg('')
    }

    const handleCloseEdit = () => {
        setShowEditModal(false)
    }

    const handleShow = () => {
        setShow(true)
        getAllUsers()
    };

    const handleShowEdit = (id) => {
        setEditId(id)
        setShowEditModal(true)
    }

    const getFeeds = async () => {
        try {
            let response = null
            if (user == null) {
                response = await axios.get('http://127.0.0.1:8000/feed/')
            } else {
                response = await axios.get('http://127.0.0.1:8000/feed/', {
                    headers: {
                        Authorization: `Bearer ${authToken.access}`
                    },
                }).catch(function (error) {
                    if (error.response.status == 401) {
                        logoutUser()
                    }
                })

            }
            setFeeds(response.data.data)
        } catch(e) {
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
            })
            getFeeds();
        } catch (e) {
            console.log(e.message)
        }
    }

    const postFeed = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://127.0.0.1:8000/home/', {
                "feed_msg":feed_msg,
                "visibility_to_close_friends":false
            }, {
                headers: {
                    Authorization: `Bearer ${authToken.access}`,
                }
            })
            getFeeds();
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
            })
            console.log(response)
            getFeeds();
        } catch (e) {
            console.log(e.message)
        }
    }

    const getAllUsers = async (e) => {
        try {
            let response = await axios.get('http://127.0.0.1:8000/user/all-users/', {
                headers: {
                    Authorization: `Bearer ${authToken.access}`,
                },
            })
        } catch(e) {
            console.log(e.message)
        }
    }

    const getProfile = async () => {
        const response = await axios.get('http://127.0.0.1:8000/user/login/', {
        headers: {
        Authorization: `Bearer ${authToken.access}`,
        },
        }).then((response) => setUserPicture(response.data.profile_picture))
    }

    useEffect(() => {
        getFeeds()
        getProfile()
    }, [])

    let userName = "Anonymous"
    let profilePicture;
    let userFeatures;
    let welcomeMessage;
    if (user != null) {
        userName = user.user_id
        welcomeMessage = "Welcome Back, "

        profilePicture = 
        <div>
        <Image src={userPicture} roundedCircle height={100} width={100}/>
        </div>

        userFeatures = 
        <Row>
            <Col xs={6}>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Control as="textarea" rows={6} placeholder="What's happening?" value={feed_msg} onChange={(e) => setFeedMsg(e.target.value)}
                        className="formControl" type="white"/>
                    </Form.Group>
                </Form> 
            </Col>
            <Col>
                <br></br>
                <br></br>
                <Button variant="light" onClick={postFeed}> Post </Button>
                <br></br>
                <br></br>
                <Button variant="light" onClick={handleShow}> Edit close friends </Button>
            </Col>
        </Row>
    } else {
        welcomeMessage = ""
        profilePicture = 
        <div>
        <Image src={process.env.PUBLIC_URL + "pp-depresi.jpg"} roundedCircle height={100} width={100}/>
        </div>
        userFeatures = null
    }

    let showFeeds;
    try {
        if (feeds == []) {
            showFeeds = null
        } else {
            showFeeds = 
            feeds.map(feed => {
                let deleteIcon = null
                let editButton = null
                if (user != null && feed.user == user.user_id) {
                    deleteIcon = 
                    <IconButton id = "del-icon" onClick={()=>{deleteFeed(feed.id)}}>
                        <DeleteIcon/>
                    </IconButton>
                    
                    editButton = <Button variant="primary" onClick={() => {handleShowEdit(feed.id)}}>Edit</Button>
    
                }
                return (
                    <div>
                        <Card className='customCard'>
                            <Card.Body>
    
                                <div className="card-title">
                                <Image src={feed.profile_picture} roundedCircle height={40} width={50}/>
                                    <div className="feed-username">
                                        <Card.Title>{feed.user}</Card.Title>
                                    </div>
                                    <div className="feed-date">
                                        <Card.Title id="font-date">{feed.created_at}</Card.Title>
                                    </div>
                                    
                                    <div className='delete-icon'>
                                        
                                        {deleteIcon}
                                            
                                    </div>
                                </div>
                                <Card.Text class="feed-msg">
                                {feed.feed_msg}
                                </Card.Text>
                                {editButton}
                            </Card.Body>
                        </Card>
                        
                        <br></br>
                    </div>
                    
                )
            })
        }
    } catch {
        showFeeds = null
    }

    const handleSubmit = event => {
        console.log(event.target[0].value)
    }
    
    
    return (
        <>  <div className = "allContainer">
            <Navbar/>
            <div className="homeContainer" style={{display: 'flex', justifyContent: 'center'}}>
                <div className="row">
                    <div className="mx-auto" style={{height: "200", display: "flex", marginBottom: "10px"}}>
                        {profilePicture}
                        <div>
                            <h2 className="welcome-container">
                                {welcomeMessage} <br></br>
                                @{userName}
                            </h2>
                        </div>
                    </div>
                    
                    <div className='feed'>
                        {userFeatures}
                        <Modal show={show} onHide={handleClose}>
                            <form id = "dropdownCloseFriend" onSubmit = {handleSubmit}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Edit Close Friends</Modal.Title>
                                </Modal.Header>
                                    <Dropdown>
                                        <Selectmultidropdown />    
                                    </Dropdown>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Close
                                    </Button>
                                    <Button variant="primary" onClick={handleClose}  form = "dropdownCloseFriend">
                                        Save Changes
                                    </Button>
                                </Modal.Footer>
                            </form>
                        </Modal>
                    </div>
                    <div>
                        
                        {
                            showFeeds
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
            </div>
        </>
    )
}