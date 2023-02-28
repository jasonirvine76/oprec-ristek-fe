import { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import jwt_decode from 'jwt-decode'
const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({children}) => {
    let [authToken, setAuthToken] = useState(localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('authToken')) : null)
    let [user, setUser] = useState(localStorage.getItem('authToken') ? jwt_decode(localStorage.getItem('authToken')) : null)
    let navigate = useNavigate()

    let loginUser = async(e) => {
        e.preventDefault()
        try {
            let response = await axios.post('http://127.0.0.1:8000/user/api/token/', {
                username: e.target.username.value,
                password: e.target.password.value
            })
            console.log(response.data)
            let data = response.data
            if (response.status = 200) {
                setAuthToken(data)
                setUser(jwt_decode(data.access))
                localStorage.setItem('authToken', JSON.stringify(data))
            }
            navigate('/')
        } catch(e) {
            alert("Username or password is incorrect")
        }
    }

    let logoutUser = () => {
        setAuthToken(null)
        setUser(null)
        localStorage.removeItem('authToken')
        navigate('/login')
    }



    let contextData = {
        user:user,
        loginUser:loginUser,
        authToken:authToken,
        logoutUser:logoutUser
    }

    return (
        <AuthContext.Provider value = {contextData} >
            {children}
        </AuthContext.Provider>
    )
}