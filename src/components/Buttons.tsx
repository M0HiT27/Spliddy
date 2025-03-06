"use client"
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

function LogoutIconArrow() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="md:size-5 size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
        </svg>

    )
}

export function LogoutButton() {
    const router = useRouter();
    async function logout() {
        await signOut();
        router.push('/');
    }
    return (
        // <button onClick={() => logout()} className="hover:bg-red-900 flex items-center justify-evenly bg-lightBlue border-2 border-red-900 rounded-lg text-ourPurple  p-1 px-2">

        // </button>

        <button onClick={() => logout()} className="hover:cursor-pointer hover:scale-[1.2] flex items-center justify-evenly text-lg bg-lightBlue text-ourPurple">
            {/* <LogoutIconArrow /> */}
            <div className="ml-1  md:text-lg text-md">
                Log Out
            </div>
        </button>
    )
}

export function SigninButton() {
    const router = useRouter();
    return (
        <button onClick={() => router.push('/signin')} className="hover:cursor-pointer hover:scale-[1.2] text-lg bg-lightBlue text-ourPurple">
            Login
        </button>
    )
}

export function SignupButton() {
    const router = useRouter();
    return (<button onClick={() => router.push('/signup')} className="hover:cursor-pointer hover:scale-[1.2] text-lg bg-lightBlue text-ourPurple ">
        Join Now
    </button>)
}
export function HomeButton() {
    const router = useRouter();
    return (
        <button onClick={() => router.push('/')} className="hover:cursor-pointer hover:scale-[1.2] text-lg text-lightBlue  ">
            Home
        </button>
    )
}