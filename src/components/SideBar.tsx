"use client"
import { useRouter } from 'next/navigation'

import { useState, useEffect } from "react";
import axios from 'axios';

import { PlusIcon, SpliddiesIcon, } from "./Icons";
import { Spliddies } from '@prisma/client';
// import { GroupIcon ,SummaryIcon } from "./Icons";

export default function SideBar() {
    const router = useRouter();
    const [isSpliddyHidden, setSpliddyHidden] = useState<boolean>(false);
    // const [isGroupHidden, setGroupHidden] = useState<boolean>(true);
    function toggleSpliddy() {
        // setSpliddyHidden(!isSpliddyHidden);
        setSpliddyHidden(false);
        router.push('/')
        // setGroupHidden(true);
    }
    // function toggleGroup() {
    //     setGroupHidden(!isGroupHidden);
    //     setSpliddyHidden(true);
    // }
    const [spliddies, setSpliddies] = useState<Spliddies[]>([])
    useEffect(() => {
        async function getData() {
            const response = await axios.get('/api/spliddy');
            setSpliddies(response.data.spliddies);
        }
        getData();
    }, [])
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


            <div className="   pr-1 max-h-[60%]    text-white flex flex-col ">
                <button onClick={() => toggleSpliddy()} className=" h-auto w-[95%] text-xl flex my-1 py-2 pl-6 items-center  rounded-r-2xl gap-2 hover:cursor-pointer hover:bg-gray-400 hover:scale-[1.1]">

                    <SpliddiesIcon />

                    <h3 className=" text-xl    ">
                        Spliddies
                    </h3>
                </button>

                <div className={`overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 flex flex-col ${isSpliddyHidden ? 'hidden' : "block"}`}>
                    <button onClick={() => router.push('/home/spliddy/create')} className="h-auto w-[95%]  text-md flex my-1 py-2 pl-10 items-center  rounded-r-2xl gap-2 hover:cursor-pointer hover:bg-gray-400 hover:scale-[1.1]">
                        <PlusIcon size="size-6" />
                        New Spliddy
                    </button>
                    {
                        spliddies.map(spl =>
                            <button key={spl.id} onClick={() => router.push('/home/spliddy/view/' + spl.id)} className="h-auto w-[95%] text-md flex my-1 py-2 pl-10 items-center  rounded-r-2xl gap-2 hover:cursor-pointer hover:bg-gray-400 hover:scale-[1.1]">

                                {spl.title}
                            </button>
                        )
                    }

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