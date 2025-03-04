"use client"
import { useRouter } from "next/navigation";
export default function Page() {
    const router = useRouter();
    return <div className="h-screen w-screen p-8 flex justify-center items-center bg-ourPurple flex-col text-center">
        <h1 className="md:text-6xl text-4xl font-bold text-white mb-4">
            404 - Page Not Found
        </h1>
        <p className="md:text-xl text-lg text-gray-300 mb-8">
            Oops! The page you're looking for doesn't exist.
        </p>
        <button onClick={() => router.push('/')} className="hover:bg-lightBlue bg-white text-lg text-ourPurple p-2 px-4 rounded-2xl shadow">
            Go back to Home
        </button>
    </div>
}