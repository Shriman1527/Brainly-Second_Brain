import { Request,Response,NextFunction } from "express";
import jwt from 'jsonwebtoken'

import { JWT_PASSWORD } from "./config";

export const userMiddleware= (req:Request, res:Response,next:NextFunction)=>{

    const authHeader= req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
         res.status(401).json({ message: "JWT must be provided" });
         return ;
      }
    
      const token = authHeader.split(" ")[1];
      console.log(token);


    try{
        const decoded= jwt.verify(token as string, JWT_PASSWORD);

    // @ts-ignore
        req.userId= decoded.id ;
        //@ts-ignore
        console.log("decoded token id",decoded.id);
        next();

    }catch(e)
    {
        res.status(403).json({
            message:"Invalid token"
        })
        return ;

    }
   
    



}



// How to override the types of the express request object