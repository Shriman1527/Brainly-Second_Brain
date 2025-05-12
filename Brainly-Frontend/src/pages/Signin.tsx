import { useRef } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { BACKEND_URL } from "../config";
import axios from 'axios'
import { Navigate, useNavigate } from "react-router-dom";


export function SignIn(){


    const usernameRef= useRef<HTMLInputElement>(null);
    const passwordRef= useRef<HTMLInputElement>(null);

    const navigate= useNavigate();



    async function  signin(){
        const username= usernameRef.current?.value;
        const password= passwordRef.current?.value;

   const responce= await axios.post(`${BACKEND_URL}/api/v1/signin`,{

            username,
            password
            
        })



        const jwt=responce.data.token;
        localStorage.setItem("token",jwt);

        //redirect the user to dashaboard
        navigate("/dashboard");

    }

    return <div className="h-screen w-screen bg-gray-200 flex
    justify-center items-center">
        <div className="bg-white rounded=xl border min-w-48 p-8 ">
            <Input reference={usernameRef } placeholder="Username" />
            <Input reference={passwordRef} placeholder="Password" />
            <div className="flex justify-center pt-4">
            <Button onClick={signin} loading={false} variant="primary" text="Signin" fullWidth={true} />
            </div>
            

        </div>

    </div>

}