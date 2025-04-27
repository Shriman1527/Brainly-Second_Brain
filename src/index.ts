/*
// @ts-ignore
// ugly way to remove the errors
*/
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';

dotenv.config();
import { UserModel ,ContentModel, ShareModel} from './db';

import { JWT_PASSWORD, PORT, MONGO_URL } from './config';
import { userMiddleware } from './middleware';
import {randomBytes} from 'crypto'


//.d.ts

const app=express();
app.use(express.json());


app.post("/api/v1/signup",async (req,res)=>{

    //Todos for today=>
    // add zod validations
    // hash the password
    const username= req.body.username;
    const password= req.body.password;
    try{
        await  UserModel.create({
            username:username,
            password:password
    
        })
    
        res.json({
            message:"User signed up"
        })
    }catch(e){
        res.status(411).json({
            message:"User already exists"
        })
    }
   

})

app.post("/api/v1/signin",async (req,res)=>{
    const username= req.body.username;
    const password= req.body.password;

    const existingUser= await UserModel.findOne({
        username:username,
        password:password
    })

    if(existingUser){
        const token= jwt.sign({
            id:existingUser._id
        }, JWT_PASSWORD)

      res.json({
        token: `Bearer ${token}`
      })  

    } else
    {
        res.status(403).json({
            message:"Incorrect Credentials"
        })
    }
})

app.post("/api/v1/content", userMiddleware,async (req,res)=>{
    
    const link= req.body.link;
    const title= req.body.title;
    
    // const userId= req.userId;
    //@ts-ignore
    console.log("User id from req.userID",req.userId);

    try{
        await ContentModel.create({
            title:title,
            link:link,
            tags:[],
            //@ts-ignore
            userId:req.userId

        })

         res.json({
            message:"Content created"
        })
    } catch(e){
        res.status(500).json({
            message:"Unable to add a content",
           
        })
      

    }

    
})

app.get("/api/v1/content",userMiddleware, async(req,res)=>{
    
    //@ts-ignore
    const userId= req.userId;
    try{
        const content= await ContentModel.find({
            userId:userId
        }).populate("userId","username")
    // Here above we learn the populate through the other relational schema
        res.json({
            content
        })
    
    } catch(e:any){

        res.json({
            message:"there is error while fetching the content"
        })

    }
   

})

app.delete("/api/v1/content",userMiddleware, async (req,res)=>{

    const contentId=req.body.contentId;

    //@ts-ignore
    const userId=req.userId;
    try{
    const deletedContent= await ContentModel.deleteMany({
            _id :contentId,
            userId:userId
        })
    
        if(!deletedContent)
        {
            res.json({
                message:"Error"
            })
            return ;
        }
    
        res.json({
            message:"Conetnt deleted successfully",
            deletedContent
    
        })
    }catch(e){
        res.json({
            message:"There is error"
        })
    }
    
    
})

app.post("/api/v1/brain/share",userMiddleware, async (req,res)=>{

    const contentId= req.body.contentId;
    //@ts-ignore
    const userId= req.userId;

    try{
        const content= await ContentModel.findOne({
            _id:contentId,
            userId:userId
        }) 

        if(!content){
            res.status(404).json({
                message:"content not found"
            })
        }

        const shareId= randomBytes(6).toString('hex'); // 12 characters


        await ShareModel.create({
            shareId:shareId,
            contentId:contentId
        })

        res.json({
            shareLink:`/api/v1/brain/${shareId}`
        })

    }catch(e){
        res.status(500).json({
            message:"Error while creating the share link"
        })
    }
})

app.get("/api/v1/brain/:sharelink" , userMiddleware,async (req,res)=>{

    const shareId= req.params.sharelink;

    try{

    const shared=  await ShareModel.findOne({
            shareId:shareId
        }).populate("contentId");

    if(!shared){
       res.status(404).json({
            message:"Shared link not found"

        })
    }


    res.json({
        content:shared?.contentId
    })



    }catch(e){
        res.status(500).json({
            message:"Error while fetching the shared conetnt"

        })
    }
})


async function main() {
    try {
      await mongoose.connect(MONGO_URL);
      console.log("Connected to MongoDB");
  
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } catch (error) {
      console.error("Failed to connect to MongoDB", error);
    }
  }
  
  main();
  






//Vector databases embeddings

//Building gpt from scratch => carpaci something 
// three blue one brown
 
//Elastic serach is very fast search 

//Vector databases Embeddings


//Best approach =>
// 1 . create the skeleton
// 2. create the database schemas


// 1.40




