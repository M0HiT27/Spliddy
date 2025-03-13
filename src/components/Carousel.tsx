"use client"

import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";


const features = [
    { title: "Simplified Debts", desc: "Automatically combines debts to reduce the number of payments.", svg: <DebtSvg /> },
    { title: "Analytics", desc: "Tag your expenses, to easily analyse your expenses.", svg: <AnalyticsSvg /> },
    { title: "Cloud Storage", desc: "Your data is automatically saved on cloud.", svg: <CloudSvg /> },
    { title: "Easy Sharing", desc: "Add your friends to the group with a simple link.", svg: <ShareSvg /> },
];

function CloudSvg() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
        </svg>
    )

}
function ShareSvg() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
        </svg>

    )

}
function AnalyticsSvg() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>


    )

}
function DebtSvg() {
    return (
        <svg className="size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 9h3.75m-4.5 2.625h4.5M12 18.75 9.75 16.5h.375a2.625 2.625 0 0 0 0-5.25H9.75m.75-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>


    )

}
export default function Carousel() {
    const [ind, setInd] = useState<number>(0);
    function increaseInd() {
        setInd((ind + 1) % features.length);
    }
    useEffect(() => {
        const interval = setInterval(increaseInd, 5000);
        return () => clearInterval(interval);
    }, [])
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={ind}
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: "0%", opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}

                className="relative h-full w-full max-w-80 rounded-xl flex flex-col justify-evenly p-4  lg:scale-[1.2]  gap-2 bg-white"
            >

                <div className="flex flex-col justify-evenly items-start   text-ourPurple font-medium font-mono sm:text-2xl text-xl">
                    <div className=" rounded-lg p-2 bg-lightBlue border-ourPurple h-full">

                        {features[ind].svg}
                    </div>
                    <div >
                        {features[ind].title}
                    </div>

                </div>
                <div className="text-gray-600 font-mono  font-extralight">
                    {features[ind].desc}
                </div>
            </motion.div>
        </AnimatePresence>

    )
}


