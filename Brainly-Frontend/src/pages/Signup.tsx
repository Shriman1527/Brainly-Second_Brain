import { useRef } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

import axios from 'axios'
import { useNavigate } from "react-router-dom";

export function SignUp(){
    // This below are <> are generics
    const usernameRef= useRef<HTMLInputElement>(null);
    const passwordRef= useRef<HTMLInputElement>(null);
    const navigate= useNavigate();
    



    async function  signup(){
        const username= usernameRef.current?.value;
        const password= passwordRef.current?.value;

    await axios.post(`http://localhost:3000/api/v1/signup`,{

            username,
            password
            
        })

        alert("You have signed up");
        navigate("/signin");

    }

    return <div className="h-screen w-screen bg-gray-200 flex
    justify-center items-center">
        <div className="bg-white rounded-xl border min-w-48 p-8 ">
            <Input reference={usernameRef} placeholder="Username" />
            <Input reference={passwordRef} placeholder="Password" />
            <div className="flex justify-center pt-4">
            <Button onClick={signup} loading={false} variant="primary" text="Signup" fullWidth={true} />
            </div>
            

        </div>

    </div>

}