import { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import jwt_decode from 'jwt-decode'
const UserContext = createContext()
import AuthContext from "../context/AuthContext";

export default UserContext

export const UserProvider = ({children}) => {
    let [user, setUser] = useState([])
    let navigate = useNavigate()
    let {authToken} = useContext(AuthContext)

    let listUser = async(e) => {
        try {
            let response = await axios.get('http://127.0.0.1:8000/user/all-users/', {
                headers: {
                    Authorization: `Bearer ${authToken.access}`,
                },
            })
            console.log(response.data)
            let data = response.data
            if (response.status = 200) {
                setUser(response.data)
            }
            navigate('/')
        } catch(e) {
            console.log(e.message)
        }
    }

    let contextData = {
        user:user,
        listUser:listUser,
    }

    return (
        <UserContext.Provider value = {contextData} >
            {children}
        </UserContext.Provider>
    )
}