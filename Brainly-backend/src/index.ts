/*
// @ts-ignore
// ugly way to remove the errors
*/
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';

import cors from 'cors'



dotenv.config();
import { UserModel ,ContentModel, LinkModel} from './db';

import { JWT_PASSWORD, PORT, MONGO_URL } from './config';
import { userMiddleware } from './middleware';
// import {randomBytes} from 'crypto'
import { random } from './utils';


//.d.ts

const app=express();
app.use(express.json());

app.use(cors({
    origin: ["http://localhost:5173","http://localhost:5174"], // Replace with your frontend origin (Vercel URL in prod)
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }));






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
    const type=req.body.type;
    
    // const userId= req.userId;
    //@ts-ignore
    console.log("User id from req.userID",req.userId);

    try{
        await ContentModel.create({
            title:title,
            link:link,
            type:type,
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

//This below commented things done by me 
// app.post("/api/v1/brain/share",userMiddleware, async (req,res)=>{

//     const contentId= req.body.contentId;
//     //@ts-ignore
//     const userId= req.userId;

//     try{
//         const content= await ContentModel.findOne({
//             _id:contentId,
//             userId:userId
//         }) 

//         if(!content){
//             res.status(404).json({
//                 message:"content not found"
//             })
//         }

//         const shareId= randomBytes(6).toString('hex'); // 12 characters


//         await ShareModel.create({
//             shareId:shareId,
//             contentId:contentId
//         })

//         res.json({
//             shareLink:`/api/v1/brain/${shareId}`
//         })

//     }catch(e){
//         res.status(500).json({
//             message:"Error while creating the share link"
//         })
//     }
// })

// app.get("/api/v1/brain/:sharelink" , userMiddleware,async (req,res)=>{

//     const shareId= req.params.sharelink;

//     try{

//     const shared=  await ShareModel.findOne({
//             shareId:shareId
//         }).populate("contentId");

//     if(!shared){
//        res.status(404).json({
//             message:"Shared link not found"

//         })
//     }


//     res.json({
//         content:shared?.contentId
//     })



//     }catch(e){
//         res.status(500).json({
//             message:"Error while fetching the shared conetnt"

//         })
//     }
// })


app.post("/api/v1/brain/share",userMiddleware,async function(req,res){
    const share= req.body.share;

    if(share){
   const exisitngLink= await LinkModel.findOne({
            //@ts-ignore
            userId:req.userId,
            
        })
    
    if(exisitngLink){
        res.json({
            hash:exisitngLink.hash
        })

        return 
    }

    const hash= random(10);

    await LinkModel.create({
        //@ts-ignore
        userId:req.userId,
        hash:hash
    })

    res.json({
        hash
    })
    
    
    
    
    }else
    {
        LinkModel.deleteOne({
            //@ts-ignore
            userId: req.userId
        })

        res.json({
            message:"Link is deletd "
        })
    }


    


})


app.get("/api/v1/brain/:sharelink",  async function(req,res){

    const hash= req.params.sharelink;

    try{
        const link= await LinkModel.findOne({

            hash:hash   
   
           })
       
       if(!link){
           res.status(404).json({
               message:"Hash is not correct"
   
           })
           return 
       }
   
   
           const content= await ContentModel.find({
               userId:link.userId
           })

           console.log("this is content", content);

   
           const user= await UserModel.findOne({
               _id:link.userId
           })

           console.log("This is User", user);

   
   
           if(!user){
              res.status(404).json({
                   message:"User not found, error should ideally not happen"
               })
               return 
           }
   
           res.json({
               username:user.username,
               content:content
           })
   

    }catch(e){
        res.json({
            message:"There is error"
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


//33.00 complete




