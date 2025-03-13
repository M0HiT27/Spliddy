"use client"
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { useRef, useState } from "react";

import MessagePopup from './MessagePopup';

import { z } from 'zod';
const signinSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be atleast 8 charcters").max(20, "Password must be atmost 20 characters")
})

function SigninCard() {
    const router = useRouter();

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [errorState, setErrorState] = useState<string>("");
    const isErrorRef = useRef<boolean>(true);


    function errorMaker(errorMessage: string) {
        console.log("errorMaker called with " + errorMessage);
        isErrorRef.current = true;
        setErrorState(errorMessage);
    }

    function successMaker(message: string) {
        isErrorRef.current = false;
        setErrorState(message);
    }

    async function sendSigninReq() {
        const userData = {
            email: emailRef.current?.value,

            password: passwordRef.current?.value,
        }
        try {
            const parsedData = signinSchema.parse(userData);
            const res = await signIn('credentials', {
                email: parsedData.email,
                password: parsedData.password,
                redirect: false,
            });
            console.log("something");
            if (res?.status == 200) {
                successMaker("Successfully signed in");
                setTimeout(() => { router.push('/home') }, 500);

            } else {
                errorMaker('Invalid credentials');
            }

        } catch (e) {
            console.log("error flag");
            //catching zod errors
            if (e instanceof z.ZodError) {
                const error = e.flatten().fieldErrors;
                if (error.email) {
                    errorMaker(error.email[0]);
                }
                else if (error.password) {
                    errorMaker(error.password[0])
                }

            } else {

            }
        }
    }
    return (
        <div className=" flex flex-col justify-evenly   p-4 bg-white border-lightBlue border rounded-2xl shadow-2xl h-[60%] w-[70%] max-w-80">

            <div className=" text-gray-500">
                <input ref={emailRef} placeholder="E-mail" className="mb-4 w-full p-2 border rounded-md  border-gray-400"></input>
                <input type="password" ref={passwordRef} placeholder="Password" className="mt-2 w-full p-2 border rounded-md border-gray-400"></input>
            </div>

            <div className="flex gap-2 flex-col items-end justify-center">
                <button onClick={() => sendSigninReq()} className="border hover:cursor-pointer hover:bg-lightBlue border-gray-400 rounded-md p-2  w-full text-ourPurple">Signin</button>
                <button onClick={() => { router.push('/signup') }} className="hover:cursor-pointer hover:text-ourPurple text-md ">Register</button>
            </div>

            {errorState && <MessagePopup message={errorState} errorSetter={setErrorState} isError={isErrorRef.current} />}
        </div>
    )
}


export default function Signin() {
    return (
        <div className=" h-screen flex-grow flex flex-col">
            <div className="md:hidden block p-2 pl-4 text-4xl  text-white">
                Spliddy
            </div>
            <div className="flex-grow flex justify-center items-center">
                <SigninCard />
            </div>

        </div>
    )
}