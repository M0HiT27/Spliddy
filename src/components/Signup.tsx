"use client"
import axios, { AxiosError } from "axios"
import { useRouter } from 'next/navigation'
import { useRef, useState } from "react"
import { z } from 'zod';
import MessagePopup from "./MessagePopup";
const signupSchema = z.object({
    name: z.string().min(3, "Name must be atleast 3 characters").max(20, "Name must be atmost 20 characters"),
    email: z.string().email(),
    password: z.string().min(8, "Password must be atleast 8 charcters").max(20, "Password must be atmost 20 characters")
})
function SignupCard() {
    const router = useRouter()
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
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
            name: nameRef.current?.value,
            password: passwordRef.current?.value,
        }
        try {
            const parsedData = signupSchema.parse(userData);
            const response = await axios.post("/api/signup", {
                name: parsedData.name,
                email: parsedData.email,
                password: parsedData.password

            })
            if (response.status == 200) {
                successMaker('signup successful')
                setTimeout(() => { router.push('/signin') }, 1500);
            }
        } catch (e) {
            if (e instanceof z.ZodError) {
                const error = e.flatten().fieldErrors;
                if (error.name) {
                    errorMaker(error.name[0])
                } else if (error.email) {
                    errorMaker(error.email[0]);

                }
                else if (error.password) {
                    errorMaker(error.password[0])
                }

            } else if (e instanceof AxiosError) {
                if (e.response) {
                    errorMaker(e.response.data.message)
                } else if (e.request) {
                    errorMaker("Something went wrong")
                }

            }
        }
    }
    return (
        <div className=" flex flex-col justify-center gap-8  p-4 bg-white border-lightBlue border rounded-2xl shadow-2xl h-[60%] w-[70%] max-w-80">

            <div className=" text-gray-500">
                <input ref={nameRef} placeholder="Name" className="my-2 w-full p-2 border rounded-md  border-gray-400"></input>

                <input ref={emailRef} placeholder="E-mail" className="my-2 w-full p-2 border rounded-md  border-gray-400"></input>
                <input type="password" ref={passwordRef} placeholder="Password" className="my-2 w-full p-2 border rounded-md border-gray-400"></input>
            </div>
            <div className="flex flex-col items-end justify-center">
                <button onClick={() => sendSigninReq()} className="border hover:bg-lightBlue border-gray-400 rounded-md p-2  w-full text-ourPurple">Signup</button>
                <button onClick={() => { router.push('/signin') }} className=" hover:text-ourPurple text-md ">Sign In</button>
            </div>
            {errorState && <MessagePopup message={errorState} errorSetter={setErrorState} isError={isErrorRef.current} />}
        </div>
    )
}
export default function Signup() {

    return (
        <div className=" h-screen flex-grow flex flex-col">

            <div className="md:hidden block p-2 pl-4 text-4xl  text-white">

                Spliddy

            </div>
            <div className="flex-grow flex justify-center items-center">

                <SignupCard></SignupCard>

            </div>

        </div>
    )
}