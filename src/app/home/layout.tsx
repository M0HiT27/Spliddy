"use client"
import SideBar from "@/components/SideBar";
import "../globals.css";

import { LogoutButton } from "@/components/Buttons";
import { useState } from "react";
import { ThreeLinesIcon, XIcon } from "@/components/Icons";
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [sidebarHidden, setSidebarHidden] = useState(true);
    function toggleSidebar() {
        setSidebarHidden(sidebarHidden => !sidebarHidden);
    }
    return (

        <div suppressHydrationWarning className="bg-wave w-screen h-lvh flex flex-col">
            <div className="h-[8%] w-screen   border-b border-lightBlue">

                <header className=' bg-transparent w-full h-full z-10  p-2 pr-6 flex justify-between items-center'>
                    <div className="flex items-center ">
                        <button onClick={() => toggleSidebar()} className="text-white  sm:hidden  rounded border-white mr-4 ">
                            {sidebarHidden ? <ThreeLinesIcon size="size-8" /> : <XIcon size="size-8" />}
                        </button>
                        <h1 className='text-3xl text-white'>Spliddy</h1>
                    </div>
                    <div className='flex gap-8 '>
                        <LogoutButton variant={'home'} />
                    </div>
                </header>
            </div>
            <div className="flex w-full h-[92%] ">
                <div className={`h-full w-[15%] min-w-50 z-10 sm:static fixed sm:block sm:bg-transparent bg-ourPurple ${sidebarHidden ? "hidden" : "block"} `}>

                    <SideBar />
                </div>


                {children}
            </div>

        </div>

    );
}