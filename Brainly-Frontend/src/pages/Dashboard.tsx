

import {Button} from '../components/Button'
import { PlusIcon } from '../Icons/PlusIcon'
import { ShareIcon } from '../Icons/ShareIcon'
import { Card } from '../components/Card'
import { CreateContentModal } from '../components/CreateContentModal'
import { useEffect, useState } from 'react'
import { Sidebar } from '../components/SideBar'
import { useContent } from '../hooks/useContent'

import axios from 'axios'



function Dashboard() {
  
    const [modalOpen,setModalOpen]=useState(false)
    const {contents,refresh}= useContent();
    // console.log(contents);
    

    useEffect(()=>{
      refresh();
    },[modalOpen]);


    async function deleteContent(id: string) {
      try {
        await axios.delete(`http://localhost:3000/api/v1/content`, {
          data: { contentId: id },
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        refresh(); // Refresh content list after deletion
      } catch (err) {
        console.error(err);
        alert("Failed to delete content");
      }
    }


    return <div >
  
        <Sidebar/>
        <div className='p-4 ml-72 h-min-screen bg-gray-200 border-2'>
            <CreateContentModal open={modalOpen} onClose={()=>{
          setModalOpen(false)
            }}/>
          <div className='flex justify-end gap-4'>
            <Button onClick={()=>{
              setModalOpen(true)
            }} variant="primary" text="Add Content" startIcon={<PlusIcon/>}/>
            <Button onClick={async ()=>{
          const responce=  await  axios.post(`http://localhost:3000/api/v1/brain/share`,{
                share:true
              },{
                headers:{
                  "Authorization":localStorage.getItem("token")
                }
              })
            const shareUrl= `http://localhost:5173/share/${responce.data.hash}` 
            alert(shareUrl)
            }} variant="secondary" text="Share Brain" startIcon={<ShareIcon/>}/>
          </div>
          
  
          <div className='flex gap-4 flex-wrap'>
           
           {contents.map(({_id,title,link,type})=> <Card
              key={_id}
              id={_id}
              type={type}
              link={link}
              title={title}
              onDelete={deleteContent}         
             />)}
          
            
  
          </div>
        
        </div>
       
   
      </div>
    
  }
  
  export default Dashboard