"use client"
import { useRouter } from 'next/navigation'

import { useState } from "react";


import { PlusIcon, SpliddiesIcon, } from "./Icons";
// import { GroupIcon ,SummaryIcon } from "./Icons";

export default function SideBar() {
    const router = useRouter();
    const [isSpliddyHidden, setSpliddyHidden] = useState<boolean>(true);
    // const [isGroupHidden, setGroupHidden] = useState<boolean>(true);
    function toggleSpliddy() {
        // setSpliddyHidden(!isSpliddyHidden);
        setSpliddyHidden(true);
        // setGroupHidden(true);
    }
    // function toggleGroup() {
    //     setGroupHidden(!isGroupHidden);
    //     setSpliddyHidden(true);
    // }
    return (
        <div className="h-full w-full   bg-transparent  border-gray-500 flex flex-col ">
            {/* <div className=" pr-1  text-white flex flex-col ">

                <button onClick={() => router.push('/home')} className=" h-auto w-[95%] text-xl  text-white flex my-1 py-2 pl-6 items-center  rounded-r-2xl gap-2 hover:cursor-pointer hover:bg-gray-400 hover:scale-[1.1]">

                    <SummaryIcon size="size-8" />

                    <h3 className=" text-xl    ">
                        Summary
                    </h3>
                </button>
            </div> */}


            <div className="   pr-1 max-h-[100%] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300   text-white flex flex-col ">
                <button onClick={() => toggleSpliddy()} className=" h-auto w-[95%] text-xl flex my-1 py-2 pl-6 items-center  rounded-r-2xl gap-2 hover:cursor-pointer hover:bg-gray-400 hover:scale-[1.1]">

                    <SpliddiesIcon />

                    <h3 className=" text-xl    ">
                        Spliddies
                    </h3>
                </button>

                <div className={`flex flex-col ${isSpliddyHidden ? 'hidden' : "block"}`}>
                    <button onClick={() => router.push('/home/spliddy/create')} className="h-auto w-[95%]  text-md flex my-1 py-2 pl-10 items-center  rounded-r-2xl gap-2 hover:cursor-pointer hover:bg-gray-400 hover:scale-[1.1]">
                        <PlusIcon size="size-6" />
                        New Spliddy
                    </button>
                    {/* <button className="h-auto w-[95%] text-md flex my-1 py-2 pl-10 items-center  rounded-r-2xl gap-2 hover:cursor-pointer hover:bg-gray-400 hover:scale-[1.1]">

                        Placeholder
                    </button> */}

                </div>



            </div>

            {/* <div className=" pr-1 max-h-[40%] text-white">
                <button onClick={() => toggleGroup()} className=" h-auto w-[95%] text-xl flex my-1 p-2 pl-6 items-center  rounded-r-2xl gap-2 hover:cursor-pointer hover:bg-gray-400 hover:scale-[1.1]">

                    <GroupIcon />

                    <h3 className=" text-xl    ">
                        Groups
                    </h3>
                </button>
                <div className={`flex flex-col ${isGroupHidden ? 'hidden' : "block"}`}>
                    <button className="h-auto w-[95%]  text-md flex my-1 py-2 pl-10 items-center  rounded-r-2xl gap-2 hover:cursor-pointer hover:bg-gray-400 hover:scale-[1.1]">
                        <PlusIcon size="size-6" />
                        New Group
                    </button>
                    <button className="h-auto w-[95%] text-md flex my-1 py-2 pl-10 items-center  rounded-r-2xl gap-2 hover:cursor-pointer hover:bg-gray-400 hover:scale-[1.1]">

                        Placeholder
                    </button>
                </div>
            </div> */}

        </div>
    )
}