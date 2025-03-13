import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation';

import Banner from "@/components/Banner"
import Signin from "@/components/Signin";
import { HomeButton } from '@/components/Buttons';


export default async function SignupPage() {
    const session = await getServerSession();

    if (session) redirect("/home");
    return (
        <div className="flex">
            <header className='fixed top-0  w-screen h-[8lvh]  p-2 px-6 flex justify-end items-center'>
                <div className='flex gap-8 '>
                    <HomeButton />
                </div>
            </header>
            <Banner />
            <Signin />
        </div>
    )
}