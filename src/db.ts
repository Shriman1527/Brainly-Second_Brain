//Create user models and schemas here 
import mongoose , { model, Schema} from "mongoose";
import {MONGO_URL} from './config'






const UserScehma = new Schema({
    username:{type:String, unique:true},
    password:{type:String}
})



export const UserModel= model("User", UserScehma);

const ContentSchema= new Schema({
   
    title:String,
    link:String,
    tags:[{type:mongoose.Types.ObjectId, ref:'Tag'}],
    userId:{type:mongoose.Types.ObjectId, ref:"User", required:true}



})

export const ContentModel= model("Content",ContentSchema);


const ShareSchema= new Schema({
    shareId:{type:String, required:true, unique:true},
    contentId:{type:mongoose.Schema.ObjectId, ref:"Content", reuired:true}
})

export const ShareModel= model("Share", ShareSchema);




