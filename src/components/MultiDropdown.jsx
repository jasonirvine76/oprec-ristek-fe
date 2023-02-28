import React, { useState, useEffect, useContext  } from 'react';
import { Container } from "react-bootstrap";
import Multiselect from 'multiselect-react-dropdown';
import AuthContext from "../context/AuthContext";
import MultiSelect from 'react-bootstrap-multiselect';
import axios from 'axios'

function Selectmultidropdown()
{

let {user, authToken} = useContext(AuthContext)
const [userData, setUserData]= useState([]);
const [selected, setSelected] = useState([])

useEffect(()=>{
  const getUserData= async()=>{
    const closeFriends = []
    const listUser = []
    let response = await axios.get('http://127.0.0.1:8000/user/all-users/', {
          headers: {
              Authorization: `Bearer ${authToken.access}`,
          },
      })

    for(let i=0; i<response.data.length; i++) {   
        if (response.data[i].username != user.user_id) {
            listUser.push(response.data[i].username);
        }

        if (response.data[i].is_close_friends == true && response.data[i].username != user.user_id) {
          closeFriends.push(response.data[i].username)
        }
            
    }
    setUserData(listUser);
    setSelected(closeFriends)
  }
getUserData();
},[]);

const addCloseFriends = async (e) => {
  let response = await axios.post('http://127.0.0.1:8000/user/close-friends/', 
    {
      "close_friends": e
    }, {
      headers: {
        "Authorization": `Bearer ${authToken.access}`,
      },
    }
  )
}

    return(<React.Fragment>
         <Container className="content">
        <div className="row">
          <div className="col-sm-12">


             <div className="col-md-5">
                <label  className="form-label"> </label>
            
                    <div className="text-dark"> 
                      <Multiselect 
                      isObject={false}
                      onRemove={ addCloseFriends }
                      onSelect={ addCloseFriends }
                      selectedValues = {selected}
                      
                      options={ userData }                
                      showCheckbox
                      />      
                      
                    </div>
                    </div>

        </div>
        </div>
        </Container>
       
    </React.Fragment>);
}

export default Selectmultidropdown;