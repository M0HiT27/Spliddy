"use client"

import { useRouter } from 'next/navigation'
import { useRef } from "react"
// import { z } from 'zod';
// import MessagePopup from './MessagePopup';
// const signinSchema = z.object({
//     email: z.string().email(),
//     password: z.string().min(8, "Password must be atleast 8 charcters").max(20, "Password must be atmost 20 charcters")
// })
function SigninCard() {
    const router = useRouter();

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);


    // async function sendSigninReq() {
    //     const userData = {
    //         email: emailRef.current?.value,

    //         password: passwordRef.current?.value,
    //     }
    //     try {
    //         const parsedData = signinSchema.parse(userData);


    //     } catch (e) {



    //     }
    // }
    return (
        <div className=" flex flex-col justify-center gap-8  p-4 bg-white border-lightBlue border rounded-2xl shadow-2xl h-[50%] w-[80%] max-w-100">

            <div className=" text-gray-500">
                <input ref={emailRef} placeholder="E-mail" className="my-2 w-full p-2 border rounded-md  border-gray-400"></input>
                <input type="password" ref={passwordRef} placeholder="Password" className="my-2 w-full p-2 border rounded-md border-gray-400"></input>
            </div>
            <div className="flex flex-col items-end justify-center">
                <button onClick={() => console.log('signin clicked')} className="border hover:bg-lightBlue border-gray-400 rounded-md p-2  w-full text-ourPurple">Signup</button>
                <button onClick={() => { router.push('/signup') }} className=" hover:text-ourPurple text-md ">Register</button>
            </div>
        </div>
    )
}


export default function Signin() {
    return (
        <div className="md:bg-lightBlue bg-ourPurple h-screen flex-grow flex flex-col">
            <div className="md:hidden block p-2 text-4xl  text-white">
                Spliddy
            </div>
            <div className="flex-grow flex justify-center items-center">
                <SigninCard />
            </div>
            <div>

            </div>
        </div>
    )
}