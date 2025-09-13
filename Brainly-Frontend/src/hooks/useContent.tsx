import {useEffect, useState} from 'react'

import axios from 'axios'

export function useContent(){

    const [contents,setContents]=useState([]);

    function refresh(){
        axios.get(`http://localhost:3000/api/v1/content`,{
            headers:{
                "Authorization":localStorage.getItem("token")
            }
           })
          .then((responce)=>{
            setContents(responce.data.content)
          })
    }

    useEffect(()=>{

     refresh();

    let interval=setInterval(()=>{
        refresh();

      },10*1000);

      return ()=>{
        clearInterval(interval);

      }

    },[]);

    return {contents,refresh};

}

